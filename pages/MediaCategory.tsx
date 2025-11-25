import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';
import { loadArticles } from '../utils/articleStorage';

export const MediaCategory: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            const allArticles = await loadArticles();
            // Filter by category (case-insensitive just in case, though types are strict)
            const filtered = allArticles.filter(
                a => a.category === category?.toUpperCase()
            );
            // Sort by date desc
            filtered.sort((a, b) => new Date(b.date.replace(/\./g, '/')).getTime() - new Date(a.date.replace(/\./g, '/')).getTime());
            setArticles(filtered);
            setLoading(false);
        };

        fetchArticles();
    }, [category]);

    const categoryTitle = category ? category.toUpperCase() : 'CATEGORY';

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <SEO title={`${categoryTitle} | AIMA MEDIA`} description={`${categoryTitle}に関する記事一覧`} />
            <Navigation />

            <main className="flex-grow pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full mb-32">

                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-eng tracking-tighter mb-4">{categoryTitle}</h1>
                    <p className="text-gray-500 font-bold tracking-widest text-sm">CATEGORY ARCHIVE</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Loading...</div>
                        ) : articles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                                {articles.map((article) => (
                                    <Link to={`/media/${article.id}`} key={article.id} className="group block">
                                        <div className="overflow-hidden rounded-lg mb-4 aspect-[4/3]">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold tracking-widest text-gray-400">{article.date}</span>
                                            <span className="text-[10px] font-bold border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {article.category}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h2>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-500 font-bold">この記事カテゴリにはまだ投稿がありません。</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <Sidebar />
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};
