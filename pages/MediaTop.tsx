import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { Sidebar } from '../components/Sidebar';

// Mock Data
const featureArticle = {
    id: 'feat-1',
    title: 'AIと創造性の未来：共存か、代替か',
    subtitle: '生成AIがもたらすパラダイムシフトと、人間が果たすべき役割について',
    date: '2024.05.15',
    category: 'SPECIAL FEATURE',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop'
};

const featuredArticles = [
    {
        id: 'f-1',
        title: 'データドリブン経営の落とし穴',
        date: '2024.05.10',
        category: 'STRATEGY',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f-2',
        title: 'LLMが変える組織構造',
        date: '2024.05.01',
        category: 'TECHNOLOGY',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f-3',
        title: 'マーケティングオートメーションの最前線',
        date: '2024.04.28',
        category: 'MARKETING',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f-4',
        title: 'AI倫理とガバナンス',
        date: '2024.04.20',
        category: 'GOVERNANCE',
        image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1000&auto=format&fit=crop'
    }
];

const latestArticles = [
    {
        id: 'l-1',
        title: 'プロンプトエンジニアリングの基礎知識',
        date: '2024.05.14',
        category: 'SKILL',
        excerpt: '効果的な回答を引き出すための具体的なテクニックと、実践的なフレームワークを紹介します。'
    },
    {
        id: 'l-2',
        title: '2024年下半期 AIトレンド予測',
        date: '2024.05.12',
        category: 'TREND',
        excerpt: 'マルチモーダル化が進むAI市場において、注目すべき技術とビジネスチャンスを読み解きます。'
    },
    {
        id: 'l-3',
        title: 'スタートアップにおけるAI活用事例 5選',
        date: '2024.05.08',
        category: 'CASE STUDY',
        excerpt: 'リソースの限られたスタートアップがいかにしてAIを活用し、急成長を遂げたのか。その秘密に迫ります。'
    },
    {
        id: 'l-4',
        title: '非エンジニアのためのPython入門',
        date: '2024.05.05',
        category: 'EDUCATION',
        excerpt: '業務効率化のためのスクリプト作成から、簡単なデータ分析まで。文系職種こそ学ぶべきプログラミングスキル。'
    }
];

export const MediaTop: React.FC = () => {
    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full mb-32">

                {/* 2-Column Layout for Main Content & Sidebar */}
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content Column */}
                    <div className="lg:w-2/3">

                        {/* 1. Feature Article (特集記事) */}
                        <section className="mb-32">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] w-12 bg-black"></div>
                                <h2 className="text-sm font-eng font-bold tracking-widest">SPECIAL FEATURE</h2>
                            </div>
                            <FadeIn>
                                <a href={`/media/${featureArticle.id}`} className="group block relative">
                                    <div className="w-full aspect-[21/9] overflow-hidden mb-8">
                                        <img
                                            src={featureArticle.image}
                                            alt={`${featureArticle.category} ${featureArticle.title}`}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 text-xs font-eng tracking-widest text-gray-500 mb-4">
                                            <span className="text-black border border-black px-2 py-1">{featureArticle.category}</span>
                                            <span>{featureArticle.date}</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-gray-600 transition-colors">
                                            {featureArticle.title}
                                        </h3>
                                        <p className="text-gray-600 text-base font-medium">{featureArticle.subtitle}</p>
                                    </div>
                                </a>
                            </FadeIn>
                        </section>

                        {/* 2. Featured Articles (注目記事 - 4 items) */}
                        <section className="mb-32">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-[1px] w-12 bg-black"></div>
                                <h2 className="text-sm font-eng font-bold tracking-widest">FEATURED</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {featuredArticles.map((article, index) => (
                                    <FadeIn key={article.id} delay={index * 100}>
                                        <a href={`/media/${article.id}`} className="group block h-full flex flex-col">
                                            <div className="overflow-hidden mb-6 aspect-[4/3] w-full">
                                                <img
                                                    src={article.image}
                                                    alt={`${article.category} ${article.title}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-eng tracking-widest text-gray-500 mb-3">
                                                <span>{article.category}</span>
                                                <span>{article.date}</span>
                                            </div>
                                            <h3 className="text-lg font-bold leading-relaxed group-hover:text-gray-600 transition-colors">
                                                {article.title}
                                            </h3>
                                        </a>
                                    </FadeIn>
                                ))}
                            </div>
                        </section>

                        {/* 3. Latest Articles (最新記事 - List View) */}
                        <section>
                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-[1px] w-12 bg-black"></div>
                                <h2 className="text-sm font-eng font-bold tracking-widest">LATEST</h2>
                            </div>
                            <div className="border-t border-gray-200">
                                {latestArticles.map((article, index) => (
                                    <FadeIn key={article.id} delay={index * 50}>
                                        <a href={`/media/${article.id}`} className="group block border-b border-gray-200 py-8 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
                                                <div className="md:w-1/4 text-xs font-eng tracking-widest text-gray-500 mb-2 md:mb-0">
                                                    {article.date}
                                                </div>
                                                <div className="md:w-3/4">
                                                    <div className="text-xs font-eng tracking-widest font-bold mb-2">
                                                        {article.category}
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </FadeIn>
                                ))}
                            </div>
                            <div className="mt-12 text-center">
                                <button className="text-xs font-bold tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors">
                                    VIEW ALL ARCHIVES
                                </button>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:w-1/3">
                        <Sidebar />
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
};
