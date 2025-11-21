import React, { useState } from 'react';
import { FadeIn } from './FadeIn';
import './Services.css';

interface ServiceData {
  id: string;
  number: string;
  title: string;
  shortDescription: React.ReactNode;
  longDescription: string;
}

const servicesData: ServiceData[] = [
  {
    id: '01',
    number: '01',
    title: 'AI Marketing',
    shortDescription: <>行動予測による最適化。<br />ユーザーの無意識領域へのアプローチ。</>,
    longDescription: "従来のデモグラフィック分析を超え、ユーザーの微細な行動ログから潜在的なニーズを予知します。心理学と機械学習を融合させ、意識される前の「欲しい」という感情にアプローチすることで、コンバージョン率を劇的に向上させます。"
  },
  {
    id: '02',
    number: '02',
    title: 'LLM Ops',
    shortDescription: <>企業ナレッジの資産化。<br />RAG構築による組織知能の拡張。</>,
    longDescription: "社内に散在するドキュメント、チャットログ、議事録をAIが学習・構造化。必要な時に必要な情報が即座に手に入るRAG（検索拡張生成）システムを構築し、個人の知見を組織全体の武器へと昇華させます。"
  },
  {
    id: '03',
    number: '03',
    title: 'Analysis',
    shortDescription: <>不可視領域の可視化。<br />純粋データによる戦略立案。</>,
    longDescription: "直感や経験則に頼らない、完全なデータドリブンな意思決定を支援します。市場のノイズを取り除き、複雑な相関関係の中から「勝てるロジック」だけを抽出。見えなかった機会損失やリスクを可視化し、確実性の高い戦略を導き出します。"
  }
];

export const Services: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('01');

  return (
    <section className="w-full py-20 px-4 md:px-0">
      <div className="max-w-7xl mx-auto h-[600px] flex flex-col md:flex-row gap-2">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className={`kinetic-item ${activeId === service.id ? 'active' : ''}`}
            onMouseEnter={() => setActiveId(service.id)}
            onClick={() => setActiveId(service.id)} // For mobile touch
          >
            <div className="kinetic-bg" />

            <div className="kinetic-content relative z-10 h-full flex flex-col justify-between p-8">
              {/* Header Area */}
              <div className="kinetic-header">
                <span className="kinetic-number">{service.number}</span>
                <h3 className="kinetic-title">{service.title}</h3>
              </div>

              {/* Body Area - Visible only when active */}
              <div className={`kinetic-body ${activeId === service.id ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                <div className="kinetic-short-desc mb-6">
                  {service.shortDescription}
                </div>
                <p className="kinetic-long-desc">
                  {service.longDescription}
                </p>
              </div>

              {/* Vertical Title for inactive state (Desktop only) */}
              <div className={`kinetic-vertical-title ${activeId !== service.id ? 'opacity-100' : 'opacity-0'}`}>
                {service.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};