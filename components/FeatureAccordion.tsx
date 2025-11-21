import React, { useState } from 'react';
import './FeatureAccordion.css';

interface FeatureItem {
    id: string;
    title: string;
    description: string;
}

const features: FeatureItem[] = [
    {
        id: '01',
        title: 'AI Marketing',
        description: '行動予測による最適化。\nユーザーの無意識領域へのアプローチ。',
    },
    {
        id: '02',
        title: 'LLM Ops',
        description: '企業ナレッジの資産化。\nRAG構築による組織知能の拡張。',
    },
    {
        id: '03',
        title: 'Analysis',
        description: '不可視領域の可視化。\n純粋データによる戦略立案。',
    },
];

export const FeatureAccordion: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    return (
        <div className="feature-accordion">
            {features.map(item => (
                <div
                    key={item.id}
                    className={`feature-item ${openId === item.id ? 'open' : ''}`}
                    onClick={() => toggle(item.id)}
                >
                    <div className="feature-header">
                        <span className="feature-id">{item.id}</span>
                        <span className="feature-title">{item.title}</span>
                    </div>
                    {openId === item.id && (
                        <div className="feature-body">
                            {item.description.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
