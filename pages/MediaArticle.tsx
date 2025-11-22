import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { Sidebar } from '../components/Sidebar';

const ARTICLE_DATA: Record<string, {
    title: string;
    date: string;
    category: string;
    heroImage: string;
    content: React.ReactNode;
}> = {
    'llmo-seo-difference': {
        title: 'LLMOとは？SEOとの違いや生成AI時代に必須の対策方法を徹底解説',
        date: '2024.11.22',
        category: 'INSIGHT',
        heroImage: 'https://images.unsplash.com/photo-1679082292712-3dc12473cd2d?q=80&w=1200&auto=format&fit=crop',
        content: (
            <div className="space-y-12">
                <p>
                    ChatGPTをはじめとする生成AIの普及により、私たちが情報を探す方法は劇的に変化しています。
                    これに伴い、従来のSEO対策だけではカバーできない新たなマーケティング領域「LLMO」が注目を集めています。
                    本記事では、これからの時代に企業が生き残るために不可欠なLLMOの基礎知識から実践的な対策までを詳しくご紹介します。
                </p>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMO（Large Language Model Optimization）の定義と意味</h2>
                    <p className="mb-6">
                        生成AIが日常的なツールとして定着する中、自社の情報がAIの回答に正確に反映されているか不安を感じる企業が増えています。
                        検索エンジンの上位表示を目指すだけでは不十分な時代において、AIからの参照を獲得する新たな手法が求められています。
                    </p>
                    <h3 className="text-xl font-bold mb-3">LLMOとは何か</h3>
                    <p className="mb-6">
                        LLMO（Large Language Model Optimization）とは、大規模言語モデル（LLM）に対して、自社のコンテンツやブランド情報が「信頼できる回答元」として引用・参照されるように最適化を行うマーケティング手法のことです。
                        従来のSEOがGoogleなどの検索結果ページで上位表示を目指すのに対し、LLMOはChatGPTやClaude、Perplexityといった対話型AIがユーザーの質問に答える際、その回答内容の中に自社の製品名やサービス情報、あるいはWebサイトのリンクが含まれることを目的としています。
                    </p>
                    <p className="mb-6">
                        AIは学習データや検索機能（RAG）を通じて情報を生成するため、その学習プロセスや参照プロセスにおいて「選ばれる」ための技術的・コンテンツ的な工夫が必要となります。
                        これは単なる露出の拡大にとどまらず、AI時代におけるブランドの信頼性を担保するための重要な戦略と言えます。
                    </p>

                    <h3 className="text-xl font-bold mb-3">GEO（Generative Engine Optimization）やAIOとの関係性</h3>
                    <p>
                        LLMOと似た文脈で使われる言葉に、GEO（Generative Engine Optimization）やAIO（Artificial Intelligence Optimization）があります。
                        これらはしばしば同義語として扱われますが、厳密には対象とするプラットフォームのニュアンスが異なります。
                        GEOは主にGoogleのAI Overview（旧SGE）やBingのAI検索機能など「検索エンジンに組み込まれた生成AI」への最適化を指す傾向が強い言葉です。
                        一方、AIOはより広義なAI全般への最適化を意味します。
                    </p>
                    <p>
                        LLMOはこれらを包括しつつ、特に大規模言語モデルそのものの学習データや文脈理解にどう食い込むかという点に重きを置いています。
                        実務上の対策内容は重複する部分が多いため、マーケティング担当者はこれらを包括的な「AI対策」として捉え、用語の違いにこだわりすぎず本質的な情報の信頼性向上に努める姿勢が大切です。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">なぜ今、LLMOが必要とされているのか</h2>
                    <p className="mb-6">
                        ユーザーの情報収集行動は、キーワードを入力する検索から、AIと対話して答えを得る形式へと急速にシフトしています。
                        この変化に対応できなければ、将来的に顧客との接点を大きく失うリスクがあります。
                    </p>
                    <h3 className="text-xl font-bold mb-3">検索行動の変化：キーワード検索から対話型検索へ</h3>
                    <p className="mb-6">
                        かつてユーザーは「SEO 対策」のような単語の羅列で検索し、表示されたリンクを自らクリックして情報を探していました。
                        しかし現在は「SEO対策の具体的な手順を教えて」とAIに話しかけ、要約された回答を直接受け取るスタイルが定着しつつあります。
                        この対話型検索において、AIが最初の回答で自社ブランドを推奨しなければ、ユーザーの目に触れる機会さえ与えられない状況が生まれ始めています。
                    </p>
                    <h3 className="text-xl font-bold mb-3">ゼロクリックサーチの増加とAI Overview（SGE）の影響</h3>
                    <p className="mb-6">
                        Google検索にAI Overview（SGE）が導入されたことで、検索結果ページ上で回答が完結する「ゼロクリックサーチ」が加速しています。
                        サイトへの流入が減る中でもブランド認知を高めるには、AIの生成する回答内で好意的な言及を獲得し、指名検索や直接のコンバージョンにつなげるという、従来とは異なるアプローチが必要です。
                    </p>
                    <h3 className="text-xl font-bold mb-3">企業マーケティングにおける新たな競争軸</h3>
                    <p>
                        競争の軸は「検索順位」から「AIの推奨枠」へと移行しています。
                        単なるキーワードの詰め込みは通用せず、企業としての実態、専門性、そしてサイテーションが鍵になります。
                        競合よりもAIに「詳しい」「信頼できる」と認識させることが、ブランド戦略の差別化要因となります。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMOとSEOの決定的な違い</h2>
                    <p className="mb-6">
                        両者は仕組みも目指すべきゴールも根本的に異なるため、戦略を明確に切り替える必要があります。
                    </p>
                    <h3 className="text-xl font-bold mb-3">最適化の対象：検索アルゴリズム対大規模言語モデル</h3>
                    <p className="mb-6">
                        SEOはクローラーが前提、LLMOは文章としての論理性と機械可読性が重要です。
                        検索エンジンは「場所」を探すシステム、LLMは「意味」を理解して再構成するシステムという違いを押さえましょう。
                    </p>
                    <h3 className="text-xl font-bold mb-3">目的の違い：検索上位表示対AI回答での引用・推奨</h3>
                    <p className="mb-6">
                        LLMOの目的はAIの回答内でブランド名をポジティブに登場させること。シェア・オブ・モデルを高める発想が重要です。
                    </p>
                    <h3 className="text-xl font-bold mb-3">評価基準の違い：被リンク・キーワード対信頼性・エンティティ理解</h3>
                    <p>
                        LLMはエンティティの一貫性やサイテーション、矛盾のない情報を重視します。
                        事実ベースの情報発信と第三者言及を増やすことが評価ポイントです。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMO対策の具体的な実践方法：3つの柱</h2>
                    <h3 className="text-xl font-bold mb-3">1. テクニカル対策：構造化データとクロール制御</h3>
                    <p className="mb-6">
                        Schema.orgで企業概要やFAQを構造化し、GPTBotなどAIクローラーのアクセスを許可します。
                        機械可読性とクローラビリティの確保が前提です。
                    </p>
                    <h3 className="text-xl font-bold mb-3">2. コンテンツ対策：AIが理解しやすい記事構成とQ&amp;A</h3>
                    <p className="mb-6">
                        結論ファースト、Q&amp;A形式、リストや表を活用し、AIが抽出しやすい論理構造にします。
                    </p>
                    <h3 className="text-xl font-bold mb-3">3. 権威性対策：E-E-A-Tの強化とサイテーション獲得</h3>
                    <p>
                        外部の権威あるサイトでの言及を増やし、一貫した事実情報を発信することで信頼性を高めます。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">生成AIに選ばれるためのライティングと実装ポイント</h2>
                    <h3 className="text-xl font-bold mb-3">「〇〇とは」の定義文を明確かつ簡潔にする</h3>
                    <p className="mb-6">
                        定義を短く端的に示し、AIが事実として扱いやすい文にすることが重要です。
                    </p>
                    <h3 className="text-xl font-bold mb-3">一次情報と信頼できる具体的な数値を提示する</h3>
                    <p className="mb-6">
                        オリジナルデータや公的ソースを明記し、ファクトチェックを通過しやすい形で提示します。
                    </p>
                    <h3 className="text-xl font-bold mb-3">専門用語と関連エンティティの共起を意識する</h3>
                    <p>
                        トピックに紐づく専門用語やエンティティを自然に盛り込み、網羅性と専門性を示します。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMOの効果測定とモニタリング方法</h2>
                    <h3 className="text-xl font-bold mb-3">主要な生成AI（ChatGPT, Gemini, Perplexity）での出力確認</h3>
                    <p className="mb-6">
                        主要モデルに定期的にプロンプトを投げ、回答内容や文脈、正確性を確認し記録します。
                    </p>
                    <h3 className="text-xl font-bold mb-3">指名検索数（ブランド認知）の推移</h3>
                    <p className="mb-6">
                        Search Consoleでブランド名クエリの推移を追い、AI露出との相関を確認します。
                    </p>
                    <h3 className="text-xl font-bold mb-3">AI参照トラフィックの変化分析</h3>
                    <p>
                        AIプラットフォームからの参照を解析し、ランディングページや滞在時間の変化を複合的に観察します。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">LLMOに取り組むメリットと今後の展望</h2>
                    <h3 className="text-xl font-bold mb-3">先行者利益によるブランド信頼性の確立</h3>
                    <p className="mb-6">
                        競合が少ない今のうちにAIからの第一想起を獲得することで、長期的な信頼を築けます。
                    </p>
                    <h3 className="text-xl font-bold mb-3">検索エンジン以外からの流入チャネル確保</h3>
                    <p className="mb-6">
                        AIチャットや音声アシスタントなど、SERP外のチャネルからの認知を増やしリスク分散します。
                    </p>
                    <h3 className="text-xl font-bold mb-3">AI時代のデジタルマーケティング戦略の再定義</h3>
                    <p>
                        AIにどう理解されるかを起点に、ブランドの提供価値を言語化し、デジタルでの存在意義を再設計します。
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">まとめ</h2>
                    <p>
                        LLMOは生成AI時代の新しいSEOとも呼べる重要なマーケティング戦略です。
                        構造化データやE-E-A-Tの強化、AIが理解しやすいコンテンツ設計に取り組むことで、将来にわたってブランドの信頼性と認知を獲得し続ける土台を作れます。
                        変化の激しい今こそ、LLMOへの取り組みをスタートさせる最適なタイミングです。
                    </p>
                </section>
            </div>
        )
    }
};

export const MediaArticle: React.FC = () => {
    const { id } = useParams();
    const article = (id && ARTICLE_DATA[id]) || ARTICLE_DATA['llmo-seo-difference'] || null;

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow pt-40 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Article Content */}
                    <div className="lg:w-2/3">
                        <FadeIn>
                            <div className="text-center mb-16">
                                <div className="flex items-center justify-center gap-4 text-xs font-eng tracking-widest text-gray-500 mb-6">
                                    <span>{article?.category || 'INSIGHT'}</span>
                                    <span>{article?.date || '2024.05.15'}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
                                    {article?.title || 'AIと創造性の未来：共存か、代替か'}
                                </h1>
                                <div className="w-full aspect-video overflow-hidden">
                                    <img
                                        src={article?.heroImage || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop'}
                                        alt={article?.title || 'AI記事ヘッダー画像'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="prose prose-lg max-w-none font-medium leading-loose text-justify mb-32">
                                {article?.content}
                            </div>

                            <div className="text-center mb-24">
                                <Link to="/media" className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest hover:text-gray-600 transition-colors">
                                    BACK TO LIST
                                </Link>
                            </div>
                        </FadeIn>
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
