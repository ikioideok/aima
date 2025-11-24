import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';
import { saveArticle, deleteArticle, loadArticles } from '../utils/articleStorage';

const defaultSupervisor = {
    name: '水間 雄紀',
    role: 'CEO',
    image: '/supervisor.jpg',
    comment: 'Webマーケターとして株式会社circlizeを創業。ラグザス株式会社に事業譲渡後、株式会社AIMAの代表取締役としてAI×マーケティングの事業に取り組む'
};

export const MediaAdmin: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState(''); // New slug state
    // Subtitle removed
    const [category, setCategory] = useState<Article['category']>('INSIGHT');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [displayType, setDisplayType] = useState<Article['displayType']>('LATEST');

    // Supervisor State
    const [supervisorName, setSupervisorName] = useState(defaultSupervisor.name);
    const [supervisorRole, setSupervisorRole] = useState(defaultSupervisor.role);
    const [supervisorImage, setSupervisorImage] = useState(defaultSupervisor.image);
    const [supervisorComment, setSupervisorComment] = useState(defaultSupervisor.comment);

    const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Load articles on mount
    useEffect(() => {
        loadArticles().then(data => {
            // Sort by date desc
            data.sort((a, b) => new Date(b.date.replace(/\./g, '/')).getTime() - new Date(a.date.replace(/\./g, '/')).getTime());
            setArticles(data);
        });
    }, []);

    const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('画像サイズが大きすぎます（5MB以下にしてください）。');
                return;
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/upload_image.php', {
                    method: 'POST',
                    headers: {
                        'X-API-KEY': apiKey || localStorage.getItem('aima_api_key') || ''
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.url) {
                        const imgTag = `<img src="${data.url}" alt="Image" />`;
                        const textarea = contentTextareaRef.current;
                        if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const newContent = content.substring(0, start) + imgTag + content.substring(end);
                            setContent(newContent);
                        } else {
                            setContent(prev => prev + imgTag);
                        }
                    } else {
                        alert('画像のアップロードに失敗しました。');
                    }
                } else {
                    alert('画像のアップロードに失敗しました。APIキーを確認してください。');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('画像のアップロード中にエラーが発生しました。');
            }
        }
    };

    const [apiKey, setApiKey] = useState('');
    const [message, setMessage] = useState('');

    const [activeTab, setActiveTab] = useState<'editor' | 'list'>('list');

    useEffect(() => {
        const storedKey = localStorage.getItem('aima_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        const data = await loadArticles();
        // Sort by date desc
        data.sort((a, b) => new Date(b.date.replace(/\./g, '/')).getTime() - new Date(a.date.replace(/\./g, '/')).getTime());
        setArticles(data);
    };

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = e.target.value;
        setApiKey(newKey);
        localStorage.setItem('aima_api_key', newKey);
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

        // Background: White
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decoration: Simple Pattern (Diagonal Stripes)
        ctx.strokeStyle = '#F5F5F5'; // Very light gray
        ctx.lineWidth = 10;
        const step = 60;
        for (let x = -canvas.height; x < canvas.width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + canvas.height, canvas.height);
            ctx.stroke();
        }

        // Decoration: Inner Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

        // Title Text Wrapping
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 60px "Times New Roman", Times, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxWidth = 900;
        const lineHeight = 100;
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
        const startY = (canvas.height - totalHeight) / 2 + 20; // Slightly adjusted for visual balance

        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
        });

        // Convert to Data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImage(dataUrl);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        resetForm();
        setActiveTab('list');
    };

    const handleEdit = (article: Article) => {
        setEditingId(article.id);
        setTitle(article.title);
        setSlug(article.id);
        setCategory(article.category);
        setImage(article.image);
        setContent(article.content);
        setDisplayType(article.displayType || 'LATEST');

        if (article.supervisor) {
            setSupervisorName(article.supervisor.name);
            setSupervisorRole(article.supervisor.role);
            setSupervisorImage(article.supervisor.image);
            setSupervisorComment(article.supervisor.comment || '');
        } else {
            setSupervisorName(defaultSupervisor.name);
            setSupervisorRole(defaultSupervisor.role);
            setSupervisorImage(defaultSupervisor.image);
            setSupervisorComment(defaultSupervisor.comment);
        }

        setActiveTab('editor');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('本当に削除しますか？この操作は取り消せません。')) return;

        const { success } = await deleteArticle(id, apiKey);
        if (success) {
            setMessage('記事を削除しました。');
            fetchArticles();
        } else {
            setMessage('削除に失敗しました。（APIキーを確認してください）');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleQuickDisplayChange = async (article: Article, newType: Article['displayType']) => {
        if (!apiKey) {
            alert('APIキーを入力してください。');
            return;
        }

        const updatedArticle = { ...article, displayType: newType };
        // Optimistic update
        setArticles(articles.map(a => a.id === article.id ? updatedArticle : a));

        const { savedToServer } = await saveArticle(updatedArticle, apiKey);

        if (savedToServer) {
            setMessage(`「${article.title}」の表示場所を更新しました。`);
        } else {
            setMessage('更新に失敗しました。APIキーを確認してください。');
            fetchArticles(); // Revert
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handlePostArticle = async (event?: React.FormEvent) => {
        event?.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('タイトルと本文は必須です。');
            return;
        }

        // Generate excerpt from content (strip HTML tags)
        const plainText = content.replace(/<[^>]+>/g, '');
        const excerpt = plainText.substring(0, 120) + '...';

        // Use custom slug or generate ID
        const finalId = slug.trim() ? slug.trim() : (editingId || Date.now().toString());

        const newArticle: Article = {
            id: finalId,
            title,
            subtitle: '',
            date: editingId ? (articles.find(a => a.id === editingId)?.date || new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')) : new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
            category,
            image,
            content,
            excerpt,
            displayType,
            supervisor: supervisorName || supervisorRole || supervisorImage || supervisorComment ? {
                name: supervisorName,
                role: supervisorRole,
                image: supervisorImage,
                comment: supervisorComment
            } : undefined
        };

        const { savedToServer } = await saveArticle(newArticle, apiKey, editingId || undefined);

        setEditingId(null);
        setMessage(savedToServer ? (editingId ? '記事を更新しました！' : '記事を投稿しました！') : 'ローカル保存のみ完了しました（APIキーを確認してください）');
        resetForm();
        fetchArticles();
        setTimeout(() => setMessage(''), 3000);
        setActiveTab('list'); // Switch to list after save
    };

    const resetForm = () => {
        setTitle('');
        setSlug('');
        setCategory('INSIGHT');
        setImage('');
        setContent('');
        setDisplayType('LATEST');
        setSupervisorName(defaultSupervisor.name);
        setSupervisorRole(defaultSupervisor.role);
        setSupervisorImage(defaultSupervisor.image);
        setSupervisorComment(defaultSupervisor.comment);
        setEditingId(null);
    };

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <SEO title="Media Admin" noindex={true} />
            <Navigation />

            <main className="flex-grow pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full mb-32">

                {/* Header & API Key */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-black"></div>
                        <h2 className="text-sm font-eng font-bold tracking-widest">MEDIA ADMIN</h2>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                        <h1 className="text-3xl font-bold">管理画面</h1>
                        <div className="w-full md:w-auto">
                            <label className="block text-xs font-bold mb-2 text-gray-500">API KEY</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                className="w-full md:w-64 border border-gray-300 p-2 rounded focus:outline-none focus:border-black transition-colors text-sm"
                                placeholder="Enter API Key"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`px-4 py-3 rounded mb-8 ${message.includes('ローカル保存のみ') || message.includes('失敗') ? 'bg-yellow-100 border border-yellow-400 text-yellow-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-8">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-8 py-4 font-bold text-sm tracking-widest transition-colors ${activeTab === 'list' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            記事一覧・表示管理
                        </button>
                        <button
                            onClick={() => { setActiveTab('editor'); resetForm(); }}
                            className={`px-8 py-4 font-bold text-sm tracking-widest transition-colors ${activeTab === 'editor' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {editingId ? '記事編集' : '新規投稿'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content */}
                    <div className="lg:w-2/3">

                        {/* TAB: LIST & MANAGE */}
                        {activeTab === 'list' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-sm text-gray-500">{articles.length}件の記事</p>
                                    <button
                                        onClick={fetchArticles}
                                        className="text-xs font-bold border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                                    >
                                        更新
                                    </button>
                                </div>

                                {articles.map((article) => (
                                    <div key={article.id} className={`flex flex-col md:flex-row gap-4 p-4 border rounded-lg items-start md:items-center bg-white hover:shadow-md transition-shadow ${article.displayType === 'SPECIAL' ? 'border-purple-200 bg-purple-50' : article.displayType === 'FEATURED' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
                                        <img src={article.image} alt={article.title} className="w-24 h-16 object-cover rounded bg-gray-100" />
                                        <div className="flex-grow min-w-0">
                                            <div className="flex gap-2 text-xs text-gray-500 mb-1">
                                                <span>{article.date}</span>
                                                <span className="border px-1 rounded bg-white">{article.category}</span>
                                            </div>
                                            <h3 className="font-bold text-sm md:text-base line-clamp-1 mb-2">{article.title}</h3>

                                            {/* Quick Display Type Edit */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-400">表示:</span>
                                                <select
                                                    value={article.displayType || 'LATEST'}
                                                    onChange={(e) => handleQuickDisplayChange(article, e.target.value as Article['displayType'])}
                                                    className={`text-xs font-bold border rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-black ${article.displayType === 'SPECIAL' ? 'text-purple-700 border-purple-300 bg-purple-100' : article.displayType === 'FEATURED' ? 'text-yellow-700 border-yellow-300 bg-yellow-100' : 'text-gray-600 border-gray-300 bg-gray-50'}`}
                                                >
                                                    <option value="LATEST">LATEST (通常)</option>
                                                    <option value="FEATURED">FEATURED (注目)</option>
                                                    <option value="SPECIAL">SPECIAL (特集)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="flex-1 md:flex-none bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, article.id)}
                                                className="flex-1 md:flex-none bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-50 transition-colors"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {articles.length === 0 && (
                                    <p className="text-gray-500 text-center py-16 bg-gray-50 rounded border border-dashed border-gray-300">
                                        記事がまだありません。<br />
                                        「新規投稿」タブから記事を作成してください。
                                    </p>
                                )}
                            </div>
                        )}

                        {/* TAB: EDITOR */}
                        {activeTab === 'editor' && (
                            <form className="space-y-12 mb-24" onSubmit={handlePostArticle}>
                                {/* 1. Title */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">タイトル</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors text-lg font-bold"
                                        required
                                        placeholder="記事のタイトルを入力"
                                    />
                                </div>

                                {/* 2. Slug */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">スラッグ (URL ID)</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors font-mono text-sm"
                                        placeholder="例: llmo-marketing (半角英数字とハイフン推奨)"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">※ 空欄の場合は自動生成されます。URLの一部になります: /media/[slug]</p>
                                </div>

                                {/* 3. Image */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">アイキャッチ画像</label>
                                    <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                            <button
                                                type="button"
                                                onClick={generateEyecatch}
                                                className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
                                            >
                                                タイトルから自動生成
                                            </button>
                                            <span className="text-xs text-gray-500">または</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, setImage)}
                                                className="text-sm"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder="画像URLを直接入力 (https://...)"
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        />
                                        {image && (
                                            <div className="mt-4">
                                                <p className="text-xs text-gray-500 mb-2">プレビュー:</p>
                                                <img src={image} alt="Preview" className="h-40 object-cover rounded border border-gray-200" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Category & Display */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">カテゴリー</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as Article['category'])}
                                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-black transition-colors"
                                        >
                                            <option value="LLMO">LLMO</option>
                                            <option value="CONTENT">CONTENT</option>
                                            <option value="STRATEGY">STRATEGY</option>
                                            <option value="TOOLS">TOOLS</option>
                                            <option value="CASES">CASES</option>
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

                                {/* 5. Content */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-sm font-bold">本文 (HTML可)</label>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="content-image-upload"
                                                className="hidden"
                                                onChange={handleContentImageUpload}
                                            />
                                            <label
                                                htmlFor="content-image-upload"
                                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold py-1 px-3 rounded transition-colors"
                                            >
                                                + 画像を挿入
                                            </label>
                                        </div>
                                    </div>
                                    <textarea
                                        ref={contentTextareaRef}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full border border-gray-300 p-3 rounded h-96 focus:outline-none focus:border-black transition-colors font-mono text-sm leading-relaxed"
                                        required
                                        placeholder="<p>ここに本文を入力...</p>"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">※ &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; などのHTMLタグが使用できます。</p>
                                </div>

                                {/* 6. Supervisor Section */}
                                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                    <h3 className="text-lg font-bold mb-6">監修者情報 (任意)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-xs font-bold mb-2">監修者名</label>
                                            <input
                                                type="text"
                                                value={supervisorName}
                                                onChange={(e) => setSupervisorName(e.target.value)}
                                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold mb-2">役職 / 肩書き</label>
                                            <input
                                                type="text"
                                                value={supervisorRole}
                                                onChange={(e) => setSupervisorRole(e.target.value)}
                                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold mb-2">監修者画像</label>
                                        <div className="flex gap-4 items-center">
                                            {supervisorImage && (
                                                <img src={supervisorImage} alt="Supervisor" className="h-12 w-12 object-cover rounded-full border border-gray-200" />
                                            )}
                                            <input
                                                type="text"
                                                value={supervisorImage}
                                                onChange={(e) => setSupervisorImage(e.target.value)}
                                                placeholder="画像URL"
                                                className="flex-grow border border-gray-300 p-2 rounded focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-2">監修者コメント</label>
                                        <textarea
                                            value={supervisorComment}
                                            onChange={(e) => setSupervisorComment(e.target.value)}
                                            className="w-full border border-gray-300 p-2 rounded h-20 focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons (Bottom) */}
                                <div className="pt-8 flex gap-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold"
                                    >
                                        リセット
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-grow bg-black text-white px-8 py-4 font-bold tracking-widest hover:bg-gray-800 transition-colors rounded-lg text-lg shadow-lg"
                                    >
                                        {editingId ? '記事を更新する' : '記事を投稿する'}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="border border-black text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-100 transition-colors rounded-lg"
                                        >
                                            キャンセル
                                        </button>
                                    )}
                                </div>
                            </form>
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
