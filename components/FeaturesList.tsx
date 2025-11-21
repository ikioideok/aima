import React, { useState } from 'react';
import './FeaturesList.css';

interface FeatureItem {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
}

const features: FeatureItem[] = [
    {
        id: '01',
        title: 'AI Marketing',
        shortDescription: '行動予測による最適化。\nユーザーの無意識領域へのアプローチ。',
        longDescription: '従来のデモグラフィック分析を超え、ユーザーの微細な行動ログから潜在的なニーズを予知します。心理学と機械学習を融合させ、意識される前の「欲しい」という感情にアプローチすることで、コンバージョン率を劇的に向上させます。',
    },
    {
        id: '02',
        title: 'LLM Ops',
        shortDescription: '企業ナレッジの資産化。\nRAG構築による組織知能の拡張。',
        longDescription: '社内に散在するドキュメント、チャットログ、議事録をAIが学習・構造化。必要な時に必要な情報が即座に手に入るRAG（検索拡張生成）システムを構築し、個人の知見を組織全体の武器へと昇華させます。',
    },
    {
        id: '03',
        title: 'Analysis',
        shortDescription: '不可視領域の可視化。\n純粋データによる戦略立案。',
        longDescription: '直感や経験則に頼らない、完全なデータドリブンな意思決定を支援します。市場のノイズを取り除き、複雑な相関関係の中から「勝てるロジック」だけを抽出。見えなかった機会損失やリスクを可視化し、確実性の高い戦略を導き出します。',
    },
];

export const FeaturesList: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    return (
        <section className="features-list-container">
            {features.map(item => (
                <div
                    key={item.id}
                    className={`feature-card ${openId === item.id ? 'active' : ''}`}
                    onClick={() => toggle(item.id)}
                >
                    <div className="feature-header">
                        <span className="feature-id">{item.id}</span>
                        <div className="feature-title-group">
                            <h3 className="feature-title">{item.title}</h3>
                            <p className="feature-short-desc">
                                {item.shortDescription.split('\n').map((line, i) => (
                                    <span key={i} className="block">{line}</span>
                                ))}
                            </p>
                        </div>
                        <span className="feature-toggle-icon">
                            {openId === item.id ? '−' : '+'}
                        </span>
                    </div>

                    <div className={`feature-body ${openId === item.id ? 'open' : ''}`}>
                        <div className="feature-body-content">
                            <p className="feature-long-desc">{item.longDescription}</p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};
