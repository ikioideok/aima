import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { Sidebar } from '../components/Sidebar';
import { SEO } from '../components/SEO';
import { Article } from '../types';

export const MediaTop: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [featureArticle, setFeatureArticle] = useState<Article | null>(null);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [latestArticles, setLatestArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/articles.json');
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                }
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        if (articles.length === 0) return;

        // Sort by date descending
        const sorted = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // 1. Special Feature (Top 1 with displayType 'SPECIAL' or just latest)
        const special = sorted.find(a => a.displayType === 'SPECIAL');
        setFeatureArticle(special || sorted[0] || null);

        // 2. Featured (Next 4 with displayType 'FEATURED')
        const featured = sorted.filter(a => a.displayType === 'FEATURED' && a.id !== (special?.id || sorted[0]?.id)).slice(0, 4);
        setFeaturedArticles(featured);

        // 3. Latest (Rest)
        const latest = sorted.filter(a =>
            a.id !== (special?.id || sorted[0]?.id) &&
            !featured.find(f => f.id === a.id)
        );
        setLatestArticles(latest);
    }, [articles]);

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <SEO
                title="AIMA INSIGHTS"
                description="AIMA Inc.のオウンドメディア。AIマーケティングやLLM活用に関する最新の知見と実践的なノウハウを発信します。"
                path="/media"
            />
            <Navigation />

            <main className="flex-grow pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full mb-32">

                {/* 2-Column Layout for Main Content & Sidebar */}
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content Column */}
                    <div className="lg:w-2/3">

                        {/* 1. Feature Article (特集記事) */}
                        {featureArticle && (
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
                        )}

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
