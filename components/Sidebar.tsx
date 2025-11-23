import React from 'react';
import { FadeIn } from './FadeIn';

// Mock Data for Sidebar
const picks = [
    { id: 'p-1', title: '生成AI時代の著作権法', image: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=500&auto=format&fit=crop' },
    { id: 'p-2', title: 'シリコンバレー現地レポート', image: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=500&auto=format&fit=crop' },
];

const popular = [
    { id: 'pop-1', title: 'プロンプトエンジニアリング完全ガイド' },
    { id: 'pop-2', title: 'AI導入に失敗する企業の共通点' },
    { id: 'pop-3', title: '2025年、エンジニアの仕事はどう変わる？' },
    { id: 'pop-4', title: 'ChatGPT vs Claude 徹底比較' },
    { id: 'pop-5', title: '画像生成AIの商用利用リスク' },
];

const categories = [
    'STRATEGY', 'TECHNOLOGY', 'MARKETING', 'GOVERNANCE', 'SKILL', 'TREND', 'CASE STUDY', 'EDUCATION'
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-full space-y-16">

            {/* Editor's Picks */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-8 bg-black"></div>
                    <h3 className="text-xs font-eng font-bold tracking-widest">EDITOR'S PICKS</h3>
                </div>
                <div className="space-y-6">
                    {picks.map((item) => (
                        <a key={item.id} href={`/media/${item.id}`} className="group block flex gap-4 items-start">
                            <div className="w-24 aspect-square overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <h4 className="text-sm font-bold leading-relaxed group-hover:text-gray-600 transition-colors">
                                {item.title}
                            </h4>
                        </a>
                    ))}
                </div>
            </section>

            {/* Popular Articles */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-8 bg-black"></div>
                    <h3 className="text-xs font-eng font-bold tracking-widest">POPULAR</h3>
                </div>
                <ol className="space-y-6 list-decimal list-inside">
                    {popular.map((item) => (
                        <li key={item.id} className="text-sm font-bold leading-relaxed border-b border-gray-100 pb-4 last:border-0">
                            <a href={`/media/${item.id}`} className="hover:text-gray-600 transition-colors pl-2">
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ol>
            </section>

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
                            Webマーケターとして株式会社circlizeを創業。RAXUSに事業譲渡後、株式会社AIMAの代表取締役としてAI×マーケティングの事業に取り組む
                        </p>
                    </div>
                </div>
            </section>

        </aside>
    );
};
