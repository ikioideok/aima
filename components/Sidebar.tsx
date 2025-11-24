import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { loadArticles } from '../utils/articleStorage';

const categories = [
    'LLMO', 'CONTENT', 'STRATEGY', 'TOOLS', 'CASES'
];

export const Sidebar: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [popularArticles, setPopularArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const allArticles = await loadArticles();

                // Filter for Editor's Picks (FEATURED)
                const featured = allArticles.filter(a => a.displayType === 'FEATURED').slice(0, 3);
                setFeaturedArticles(featured);

                // Sort by views for Popular (Mock logic: just take first 5 for now, or random)
                // In a real app, we would sort by views. Here we just take the latest 5 excluding featured if needed.
                const popular = [...allArticles].slice(0, 5);
                setPopularArticles(popular);

            } catch (error) {
                console.error('Failed to load sidebar articles:', error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <aside className="w-full space-y-16">

            {/* Editor's Picks */}
            {featuredArticles.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-8 bg-black"></div>
                        <h3 className="text-xs font-eng font-bold tracking-widest">EDITOR'S PICKS</h3>
                    </div>
                    <div className="space-y-6">
                        {featuredArticles.map((item) => (
                            <a key={item.id} href={`/media/${item.id}`} className="group block flex gap-4 items-start">
                                <div className="w-24 aspect-square overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h4 className="text-sm font-bold leading-relaxed group-hover:text-gray-600 transition-colors line-clamp-3">
                                    {item.title}
                                </h4>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-8 bg-black"></div>
                        <h3 className="text-xs font-eng font-bold tracking-widest">POPULAR</h3>
                    </div>
                    <ol className="space-y-6 list-decimal list-inside">
                        {popularArticles.map((item) => (
                            <li key={item.id} className="text-sm font-bold leading-relaxed border-b border-gray-100 pb-4 last:border-0">
                                <a href={`/media/${item.id}`} className="hover:text-gray-600 transition-colors pl-2 block">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {/* Categories */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-8 bg-black"></div>
                    <h3 className="text-xs font-eng font-bold tracking-widest">CATEGORIES</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <a
                            key={cat}
                            href={`/media/category/${cat.toLowerCase()}`}
                            className="text-[10px] font-eng font-bold tracking-widest border border-gray-200 px-3 py-2 hover:bg-black hover:text-white transition-colors"
                        >
                            {cat}
                        </a>
                    ))}
                </div>
            </section>

            {/* Supervisor */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-8 bg-black"></div>
                    <h3 className="text-xs font-eng font-bold tracking-widest">SUPERVISOR</h3>
                </div>
                <div className="bg-gray-50 p-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto">
                        <img
                            src="/supervisor.jpg"
                            alt="Supervisor"
                            className="w-full h-full object-cover transform scale-125"
                        />
                    </div>
                    <div className="text-center">
                        <h4 className="font-bold text-sm mb-2">水間 雄紀</h4>
                        <p className="text-xs text-gray-500 font-eng tracking-widest mb-4">CEO</p>
                        <p className="text-xs leading-loose text-justify text-gray-600">
                            Webマーケターとして株式会社circlizeを創業。ラグザス株式会社に事業譲渡後、株式会社AIMAの代表取締役としてAI×マーケティングの事業に取り組む
                        </p>
                    </div>
                </div>
            </section>

        </aside>
    );
};
