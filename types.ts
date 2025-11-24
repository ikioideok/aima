export interface Article {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
    category: 'LLMO' | 'CONTENT' | 'STRATEGY' | 'TOOLS' | 'CASES';
    image: string;
    content?: string; // HTML content or plain text
    excerpt?: string;
    displayType?: 'SPECIAL' | 'FEATURED' | 'LATEST';
    supervisor?: {
        name: string;
        role: string;
        image?: string;
        comment?: string;
    };
    views?: number;
}
