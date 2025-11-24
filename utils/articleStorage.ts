import { Article } from '../types';

const STORAGE_KEY = 'aima-media-articles';

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
    try {
        // Fetch directly from the JSON file served by the server
        const res = await fetch(`/articles.json?t=${Date.now()}`, { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        return data as Article[];
    } catch (error) {
        console.warn('Failed to fetch server articles, using local data', error);
        return null;
    }
};

export const loadArticles = async (): Promise<Article[]> => {
    const stored = readStoredArticles();
    const serverArticles = await fetchServerArticles();
    // Order: locally stored (drafts) > server
    const merged = mergeArticles(stored, serverArticles || []);

    // Keep cache in localStorage to survive reloads/offline
    persistStoredArticles(merged);
    return merged;
};

export const saveArticle = async (article: Article, apiKey: string, originalId?: string): Promise<{ articles: Article[]; savedToServer: boolean }> => {
    // Save locally first for instant reflection
    // Note: Local storage logic is simplified here; renaming in local storage is tricky without a full rewrite, 
    // but since we rely on server response to refresh, it's acceptable to just save the new one locally.
    const locallyMerged = mergeArticles([article], readStoredArticles());
    persistStoredArticles(locallyMerged);

    let savedToServer = false;
    let latestArticles = locallyMerged;

    try {
        // Post to the PHP script
        const payload = { ...article, originalId };
        const response = await fetch('/save_article.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const serverArticles = (await response.json()) as Article[];
            // Update local storage with the authoritative server list
            // Merge order: Local < Server (Server overwrites Local)
            const merged = mergeArticles(readStoredArticles(), serverArticles);
            persistStoredArticles(merged);
            latestArticles = merged;
            savedToServer = true;
        } else {
            console.error('Server responded with error:', await response.text());
        }
    } catch (error) {
        console.warn('Failed to save to server, kept local only', error);
    }

    return { articles: latestArticles, savedToServer };
};

export const deleteArticle = async (id: string, apiKey: string): Promise<{ articles: Article[]; success: boolean }> => {
    // Delete locally
    const stored = readStoredArticles();
    const filtered = stored.filter(a => a.id !== id);
    persistStoredArticles(filtered);

    let success = false;
    let latestArticles = mergeArticles(filtered);

    try {
        const response = await fetch('/save_article.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify({ id, delete: true }),
        });

        if (response.ok) {
            const serverArticles = (await response.json()) as Article[];
            const merged = mergeArticles(serverArticles, filtered);
            persistStoredArticles(merged);
            latestArticles = merged;
            success = true;
        }
    } catch (error) {
        console.warn('Failed to delete from server', error);
    }

    return { articles: latestArticles, success };
};
