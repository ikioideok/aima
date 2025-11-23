import { Article } from '../types';
import { articles as staticArticlesData } from '../data/articles';

const STORAGE_KEY = 'aima-media-articles';
const staticArticles = staticArticlesData as Article[];
const adminSecret = import.meta.env.VITE_ADMIN_SECRET;

const hasWindow = typeof window !== 'undefined';

const readStoredArticles = (): Article[] => {
    if (!hasWindow) return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Article[]) : [];
    } catch (error) {
        console.error('Failed to read stored articles', error);
        return [];
    }
};

const persistStoredArticles = (articles: Article[]) => {
    if (!hasWindow) return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
        console.error('Failed to persist articles', error);
    }
};

const mergeArticles = (...lists: Article[][]) => {
    const merged = new Map<string, Article>();
    lists.forEach((list) => {
        list.forEach((article) => {
            merged.set(article.id, article);
        });
    });
    return Array.from(merged.values());
};

const fetchServerArticles = async (): Promise<Article[] | null> => {
    if (!hasWindow) return null;
    const endpoints = ['/api/articles', '/save_article.php', '/articles.json'];
    for (const endpoint of endpoints) {
        try {
            const res = await fetch(endpoint, { method: 'GET' });
            if (!res.ok) throw new Error(`Failed to fetch articles from ${endpoint}`);
            const data = await res.json();
            return data as Article[];
        } catch (error) {
            console.warn(`Failed to fetch from ${endpoint}`, error);
        }
    }
    return null;
};

export const loadArticles = async (): Promise<Article[]> => {
    const stored = readStoredArticles();
    const serverArticles = await fetchServerArticles();
    // Order: locally stored (drafts) > server > static seed
    const merged = mergeArticles(stored, serverArticles || [], staticArticles);

    // Keep cache in localStorage to survive reloads/offline
    persistStoredArticles(merged.filter((a) => !staticArticles.find((s) => s.id === a.id)));
    return merged;
};

export const saveArticle = async (article: Article): Promise<{ articles: Article[]; savedToServer: boolean }> => {
    // Save locally first for instant reflection
    const locallyMerged = mergeArticles([article], readStoredArticles(), staticArticles);
    persistStoredArticles(locallyMerged.filter((a) => !staticArticles.find((s) => s.id === a.id)));

    let savedToServer = false;
    const endpoints = ['/api/save-article', '/save_article.php'];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(adminSecret ? { 'X-Admin-Secret': adminSecret } : {})
                },
                body: JSON.stringify(article),
            });

            if (response.ok) {
                const serverArticles = (await response.json()) as Article[];
                const merged = mergeArticles(serverArticles, readStoredArticles(), staticArticles);
                persistStoredArticles(merged.filter((a) => !staticArticles.find((s) => s.id === a.id)));
                savedToServer = true;
                break;
            } else {
                throw new Error(`Failed to save via ${endpoint}`);
            }
        } catch (error) {
            console.warn(`Failed to save to ${endpoint}, trying next`, error);
        }
    }

    const latest = mergeArticles(readStoredArticles(), staticArticles);
    return { articles: latest, savedToServer };
};
