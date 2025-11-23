import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';

export const MediaAdmin: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState<Article['category']>('INSIGHT');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [displayType, setDisplayType] = useState<Article['displayType']>('LATEST');

    // Supervisor State
    const [supervisorName, setSupervisorName] = useState('');
    const [supervisorRole, setSupervisorRole] = useState('');
    const [supervisorImage, setSupervisorImage] = useState('');
    const [supervisorComment, setSupervisorComment] = useState('');

    const [message, setMessage] = useState('');

    useEffect(() => {
        loadArticles();
    }, []);

    // Set robots noindex/nofollow while on this page
    useEffect(() => {
        const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
        let created: HTMLMetaElement | null = null;
        if (existing) {
            existing.content = 'noindex,nofollow';
        } else {
            const meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'noindex,nofollow';
            document.head.appendChild(meta);
            created = meta;
        }
        return () => {
            if (created) {
                document.head.removeChild(created);
            } else if (existing) {
                existing.content = 'index,follow';
            }
        };
    }, []);

    const loadArticles = () => {
        try {
            const existingArticlesStr = localStorage.getItem('aima_media_articles');
            if (existingArticlesStr) {
                setArticles(JSON.parse(existingArticlesStr));
            }
        } catch (error) {
            console.error('Failed to parse local articles:', error);
            alert('記事データの読み込みに失敗しました。データが破損している可能性があります。');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                alert('画像サイズが大きすぎます（500KB以下にしてください）。ローカルストレージの容量制限のためです。');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateEyecatch = () => {
        if (!title) {
            alert('タイトルを入力してください。');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions (OGP standard)
        canvas.width = 1200;
        canvas.height = 630;

        // Background
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decoration: Top Logo
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '0.2em';
        ctx.fillText('AIMA INSIGHTS', canvas.width / 2, 100);

        // Decoration: Accent Line
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 50, 130);
        ctx.lineTo(canvas.width / 2 + 50, 130);
        ctx.stroke();

        // Title Text Wrapping
        ctx.font = 'bold 60px "Times New Roman", Times, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxWidth = 1000;
        const lineHeight = 90;
        const words = title.split(''); // Split by character for Japanese wrapping
        let line = '';
        const lines = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                lines.push(line);
                line = words[i];
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Draw Title
        const totalHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalHeight) / 2 + (lineHeight / 2);

        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
        });

        // Convert to Data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImage(dataUrl);
    };

    const handleEdit = (article: Article) => {
        setEditingId(article.id);
        setTitle(article.title);
        setSubtitle(article.subtitle || article.excerpt || '');
        setCategory(article.category);
        setImage(article.image);
        setContent(article.content || '');
        setDisplayType(article.displayType || 'LATEST');

        // Supervisor
        setSupervisorName(article.supervisor?.name || '');
        setSupervisorRole(article.supervisor?.role || '');
        setSupervisorImage(article.supervisor?.image || '');
        setSupervisorComment(article.supervisor?.comment || '');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('本当に削除しますか？この操作は取り消せません。')) {
            const updatedArticles = articles.filter(a => a.id !== id);
            localStorage.setItem('aima_media_articles', JSON.stringify(updatedArticles));
            setArticles(updatedArticles);
            setMessage('記事を削除しました。');
            setTimeout(() => setMessage(''), 3000);
            if (editingId === id) {
                handleCancelEdit();
            }
        }
    };

    const resetForm = () => {
        setTitle('');
        setSubtitle('');
        setCategory('INSIGHT');
        setImage('');
        setContent('');
        setDisplayType('LATEST');
        setSupervisorName('');
        setSupervisorRole('');
        setSupervisorImage('');
        setSupervisorComment('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newArticle: Article = {
            id: editingId || `local-${Date.now()}`,
            title,
            subtitle,
            date: editingId ? articles.find(a => a.id === editingId)?.date || new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
            category,
            image,
            content,
            excerpt: subtitle, // Use subtitle as excerpt for list view
            displayType,
            supervisor: supervisorName ? {
                name: supervisorName,
                role: supervisorRole,
                image: supervisorImage,
                comment: supervisorComment
            } : undefined
        };

        try {
            let existingArticles: Article[] = [];
            try {
                const existingArticlesStr = localStorage.getItem('aima_media_articles');
                existingArticles = existingArticlesStr ? JSON.parse(existingArticlesStr) : [];
            } catch (e) {
                console.error('Failed to parse existing articles during save:', e);
            }

            let updatedArticles: Article[];
            if (editingId) {
                updatedArticles = existingArticles.map(a => a.id === editingId ? newArticle : a);
                setMessage('記事を更新しました！');
            } else {
                updatedArticles = [newArticle, ...existingArticles];
                setMessage('記事を投稿しました！');
            }

            localStorage.setItem('aima_media_articles', JSON.stringify(updatedArticles));
            setArticles(updatedArticles);

            if (!editingId) {
                resetForm();
            } else {
                // Keep form populated or clear? Usually clear after update or stay. Let's clear and go back to create mode.
                handleCancelEdit();
            }

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

                        <h1 className="text-3xl font-bold mb-12">{editingId ? '記事編集' : '記事投稿'}</h1>

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8 mb-24">
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
                                <label className="block text-sm font-bold mb-2">メイン画像</label>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={generateEyecatch}
                                            className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 transition-colors"
                                        >
                                            タイトルから画像を自動生成
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, setImage)}
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

                            {/* Supervisor Section */}
                            <div className="border-t border-b border-gray-200 py-8 my-8">
                                <h3 className="text-xl font-bold mb-6">監修者情報 (任意)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">監修者名</label>
                                        <input
                                            type="text"
                                            value={supervisorName}
                                            onChange={(e) => setSupervisorName(e.target.value)}
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">役職 / 肩書き</label>
                                        <input
                                            type="text"
                                            value={supervisorRole}
                                            onChange={(e) => setSupervisorRole(e.target.value)}
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2">監修者画像</label>
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setSupervisorImage)}
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        />
                                        <input
                                            type="text"
                                            value={supervisorImage}
                                            onChange={(e) => setSupervisorImage(e.target.value)}
                                            placeholder="画像URL"
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    {supervisorImage && (
                                        <div className="mt-4">
                                            <img src={supervisorImage} alt="Supervisor" className="h-20 w-20 object-cover rounded-full border border-gray-200" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">監修者コメント</label>
                                    <textarea
                                        value={supervisorComment}
                                        onChange={(e) => setSupervisorComment(e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded h-24 focus:outline-none focus:border-black transition-colors"
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

                            <div className="pt-8 flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-12 py-4 font-bold tracking-widest hover:bg-gray-800 transition-colors flex-grow md:flex-grow-0"
                                >
                                    {editingId ? 'UPDATE ARTICLE' : 'POST ARTICLE'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="border border-black text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-100 transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Article List Section */}
                        <div className="border-t border-gray-200 pt-16">
                            <h2 className="text-2xl font-bold mb-8">投稿済み記事一覧</h2>
                            {articles.length === 0 ? (
                                <p className="text-gray-500">投稿された記事はありません。</p>
                            ) : (
                                <div className="space-y-6">
                                    {articles.map(article => (
                                        <div key={article.id} className="border border-gray-200 p-6 rounded flex flex-col md:flex-row gap-6 items-start">
                                            <div className="w-full md:w-32 aspect-video bg-gray-100 flex-shrink-0">
                                                {article.image && (
                                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold bg-gray-100 px-2 py-1">{article.category}</span>
                                                    {article.displayType && article.displayType !== 'LATEST' && (
                                                        <span className="text-xs font-bold bg-black text-white px-2 py-1">{article.displayType}</span>
                                                    )}
                                                    <span className="text-xs text-gray-500">{article.date}</span>
                                                </div>
                                                <h3 className="font-bold mb-2">{article.title}</h3>
                                                <div className="flex gap-4 mt-4">
                                                    <button
                                                        onClick={() => handleEdit(article)}
                                                        className="text-sm font-bold text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        編集
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(article.id)}
                                                        className="text-sm font-bold text-red-600 hover:text-red-800 underline"
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
