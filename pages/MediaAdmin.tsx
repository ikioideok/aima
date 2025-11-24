import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';
import { saveArticle } from '../utils/articleStorage';

const defaultSupervisor = {
    name: '水間 雄紀',
    role: 'CEO',
    image: '/supervisor.jpg',
    comment: 'Webマーケターとして株式会社circlizeを創業。ラグザス株式会社に事業譲渡後、株式会社AIMAの代表取締役としてAI×マーケティングの事業に取り組む'
};

export const MediaAdmin: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState('');
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

    const [apiKey, setApiKey] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('aima_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

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

        const newArticle: Article = {
            id: editingId || Date.now().toString(),
            title,
            subtitle: '', // Deprecated but kept for type compatibility if needed, or just empty
            date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
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

        const { savedToServer } = await saveArticle(newArticle, apiKey);

        setEditingId(null);
        setMessage(savedToServer ? '記事を投稿しました！' : '記事を投稿しました！（ローカル保存のみ - APIキーを確認してください）');
        resetForm();
        setTimeout(() => setMessage(''), 3000);
    };

    const resetForm = () => {
        setTitle('');
        // setSubtitle('');
        setCategory('INSIGHT');
        setImage('');
        setContent('');
        setDisplayType('LATEST');
        setSupervisorName(defaultSupervisor.name);
        setSupervisorRole(defaultSupervisor.role);
        setSupervisorImage(defaultSupervisor.image);
        setSupervisorComment(defaultSupervisor.comment);
    };



    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <SEO title="Media Admin" noindex={true} />
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

                        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded">
                            <label className="block text-xs font-bold mb-2 text-gray-500">API KEY (Server Password)</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black transition-colors text-sm"
                                placeholder="Enter API Key"
                            />
                        </div>

                        {message && (
                            <div className={`px-4 py-3 rounded mb-8 ${message.includes('ローカル保存のみ') ? 'bg-yellow-100 border border-yellow-400 text-yellow-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                                {message}
                            </div>
                        )}

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

                            {/* 2. Image */}
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

                            {/* 3. Category & Display */}
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

                            {/* 4. Content */}
                            <div>
                                <label className="block text-sm font-bold mb-2">本文 (HTML可)</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded h-96 focus:outline-none focus:border-black transition-colors font-mono text-sm leading-relaxed"
                                    required
                                    placeholder="<p>ここに本文を入力...</p>"
                                />
                                <p className="text-xs text-gray-500 mt-2">※ &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; などのHTMLタグが使用できます。</p>
                            </div>

                            {/* 5. Supervisor Section */}
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
