import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from './FadeIn';
import { ServiceModal } from './ServiceModal';
import './Services.css';

interface ServiceData {
  id: string;
  number: string;
  title: React.ReactNode;
  shortDescription: React.ReactNode;
  longDescription: string;
  link?: string;
}

const servicesData: ServiceData[] = [
  {
    id: '01',
    number: '01',
    title: <>SEO・LLMO<br />内製化支援</>,
    shortDescription: <>行動予測による最適化。<br />ユーザーの無意識領域へのアプローチ。</>,
    longDescription: "従来のデモグラフィック分析を超え、ユーザーの微細な行動ログから潜在的なニーズを予知します。心理学と機械学習を融合させ、意識される前の「欲しい」という感情にアプローチすることで、コンバージョン率を劇的に向上させます。",
    link: '/service/seo-llmo'
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
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const navigate = useNavigate();

  return (
    <section id="works" className="w-full py-12 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto mb-16">
        <FadeIn>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Works</h2>
        </FadeIn>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24">

        {/* Left Side: Navigation List */}
        <div className="md:w-1/3 flex flex-col justify-center space-y-16">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`cursor-pointer group transition-all duration-300 ${activeId === service.id ? 'opacity-100 translate-x-4' : 'opacity-40 hover:opacity-70'}`}
              onMouseEnter={() => setActiveId(service.id)}
              onClick={() => setActiveId(service.id)}
            >
              <div className="flex items-baseline space-x-4">
                <span className={`text-sm font-light tracking-widest transition-colors duration-300 ${activeId === service.id ? 'text-black' : 'text-gray-400'}`}>
                  {service.number}
                </span>
                <h3 className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${activeId === service.id ? 'text-black' : 'text-gray-300'}`}>
                  {service.title}
                </h3>
              </div>
              <div className={`h-[1px] bg-black mt-4 transition-all duration-500 ease-out ${activeId === service.id ? 'w-full' : 'w-0'}`} />
            </div>
          ))}
        </div>

        {/* Right Side: Content Preview */}
        <div className="md:w-2/3 relative min-h-[400px] flex items-center">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center ${activeId === service.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
            >
              <FadeIn key={activeId === service.id ? 'active' : 'inactive'}>
                <div className="space-y-8">
                  <div className="text-xl font-medium leading-relaxed text-gray-800">
                    {service.shortDescription}
                  </div>
                  <p className="text-gray-500 leading-loose text-justify">
                    {service.longDescription}
                  </p>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="group flex items-center space-x-2 text-sm font-bold tracking-widest uppercase border-b border-black pb-1 w-fit hover:text-gray-600 transition-colors"
                  >
                    <span>View Details</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </button>
                </div>
              </FadeIn>
            </div>
          ))}
        </div>

      </div>

      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
    </section>
  );
};