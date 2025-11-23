export interface Article {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
    category: 'INSIGHT' | 'STRATEGY' | 'TECHNOLOGY' | 'MARKETING' | 'GOVERNANCE' | 'SKILL' | 'TREND' | 'CASE STUDY' | 'EDUCATION' | 'OTHER';
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
}
