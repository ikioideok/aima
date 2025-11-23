import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';

export const MediaAdmin: React.FC = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState<Article['category']>('INSIGHT');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newArticle: Article = {
            id: `local-${Date.now()}`,
            title,
            subtitle,
            date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
            category,
            image,
            content,
            excerpt: subtitle // Use subtitle as excerpt for list view
        };

        // Save to localStorage
        const existingArticlesStr = localStorage.getItem('aima_media_articles');
        const existingArticles: Article[] = existingArticlesStr ? JSON.parse(existingArticlesStr) : [];
        const updatedArticles = [newArticle, ...existingArticles];
        localStorage.setItem('aima_media_articles', JSON.stringify(updatedArticles));

        setMessage('記事を投稿しました！');

        // Reset form
        setTitle('');
        setSubtitle('');
        setCategory('INSIGHT');
        setImage('');
        setContent('');

        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full mb-32">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content: Form */}
                    <div className="lg:w-2/3">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] w-12 bg-black"></div>
                            <h2 className="text-sm font-eng font-bold tracking-widest">MEDIA ADMIN</h2>
                        </div>

                        <h1 className="text-3xl font-bold mb-12">記事投稿</h1>

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold mb-2">タイトル</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">サブタイトル / 抜粋</label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold mb-2">カテゴリー</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as Article['category'])}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                    >
                                        <option value="INSIGHT">INSIGHT</option>
                                        <option value="STRATEGY">STRATEGY</option>
                                        <option value="TECHNOLOGY">TECHNOLOGY</option>
                                        <option value="MARKETING">MARKETING</option>
                                        <option value="GOVERNANCE">GOVERNANCE</option>
                                        <option value="SKILL">SKILL</option>
                                        <option value="TREND">TREND</option>
                                        <option value="CASE STUDY">CASE STUDY</option>
                                        <option value="EDUCATION">EDUCATION</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">画像URL</label>
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">本文 (HTML可)</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded h-64 focus:outline-none focus:border-black transition-colors font-mono text-sm"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">※ &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; などのHTMLタグが使用できます。</p>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-12 py-4 font-bold tracking-widest hover:bg-gray-800 transition-colors"
                                >
                                    POST ARTICLE
                                </button>
                            </div>
                        </form>
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
