import { Article } from '../types';
import { articles as staticArticlesData } from '../data/articles';

const STORAGE_KEY = 'aima-media-articles';
const staticArticles = staticArticlesData as Article[];

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

const mergeArticles = (stored: Article[]) => {
    const merged = new Map<string, Article>();

    // Prefer locally stored items (newer) over static seeds
    stored.forEach((article) => merged.set(article.id, article));
    staticArticles.forEach((article) => {
        if (!merged.has(article.id)) {
            merged.set(article.id, article);
        }
    });

    return Array.from(merged.values());
};

export const getAllArticles = (): Article[] => {
    const stored = readStoredArticles();
    return mergeArticles(stored);
};

export const saveArticleLocally = (article: Article): Article[] => {
    const stored = readStoredArticles();
    const filtered = stored.filter((item) => item.id !== article.id);
    const nextStored = [article, ...filtered];

    persistStoredArticles(nextStored);
    return mergeArticles(nextStored);
};

export const getArticleById = (id: string): Article | undefined => {
    return getAllArticles().find((article) => article.id === id);
};
