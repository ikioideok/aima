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

export interface RecruitDetails {
    overview: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave?: string[];
    stack?: string[];
    location: string;
    hours: string;
    salary?: string;
    benefits?: string[];
}

export interface RecruitPosition {
    title: string;
    type: string;
    summary: string;
    tags: string[];
    details: RecruitDetails;
}
