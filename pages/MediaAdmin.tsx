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
    const [displayType, setDisplayType] = useState<Article['displayType']>('LATEST');
    const [message, setMessage] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                alert('画像サイズが大きすぎます（500KB以下にしてください）。ローカルストレージの容量制限のためです。');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
            excerpt: subtitle, // Use subtitle as excerpt for list view
            displayType
        };

        try {
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
            setDisplayType('LATEST');

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            alert('保存に失敗しました。ローカルストレージの容量がいっぱいの可能性があります。画像を減らすか、古い記事を削除してください。');
        }
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
                                    <label className="block text-sm font-bold mb-2">表示場所</label>
                                    <select
                                        value={displayType}
                                        onChange={(e) => setDisplayType(e.target.value as Article['displayType'])}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                    >
                                        <option value="LATEST">LATEST (最新記事リスト)</option>
                                        <option value="SPECIAL">SPECIAL FEATURE (トップ特集)</option>
                                        <option value="FEATURED">FEATURED (注目記事グリッド)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">画像</label>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                    />
                                    <div className="text-center text-sm text-gray-500">- OR -</div>
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="画像URLを直接入力 (https://...)"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                                {image && (
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500 mb-2">プレビュー:</p>
                                        <img src={image} alt="Preview" className="h-40 object-cover rounded border border-gray-200" />
                                    </div>
                                )}
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
