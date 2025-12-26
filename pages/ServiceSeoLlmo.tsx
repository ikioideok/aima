import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { SEO } from '../components/SEO';

export const ServiceSeoLlmo: React.FC = () => {
    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen">
            <SEO
                title="SEO・LLMO内製化"
                description="検索×AI時代に対応した社内コンテンツ制作チームの立ち上げ支援プログラム。"
                path="/service/seo-llmo"
            />
            <Navigation />

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
                    <FadeIn>
                        <span className="block text-sm font-light tracking-widest text-gray-500 mb-4">SERVICE 01</span>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
                            SEO・LLMO内製化
                        </h1>
                        <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800 max-w-3xl">
                            検索 × AIサーチ（LLMO）時代に対応した、<br />
                            社内コンテンツ制作チームの立ち上げ支援プログラム
                        </p>
                    </FadeIn>
                </section>

                {/* Common Problems */}
                <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
                    <FadeIn>
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">こんなお悩み、ありませんか？</h2>
                            <p className="text-gray-500">SEOとAI活用、現場の課題は山積みです。</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                {
                                    title: "順位が上がらない",
                                    desc: "記事を書いても検索順位が上がらず、流入が増えない。"
                                },
                                {
                                    title: "コストがかさむ",
                                    desc: "外注費が高騰し、社内リソースも不足している。"
                                },
                                {
                                    title: "ノウハウがない",
                                    desc: "AI活用の知見がなく、競合に置いていかれている。"
                                }
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300">
                                    <h3 className="text-xl font-bold mb-3 text-black">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* Why Choose Us */}
                <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
                    <FadeIn>
                        <div className="mb-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                                AIMAのSEO・LLMO内製化が<br className="md:hidden" />選ばれる理由
                            </h2>
                            <p className="text-gray-500 text-lg">圧倒的な成果を生む、3つの強み。</p>
                        </div>

                        <div className="space-y-8">
                            {[
                                {
                                    num: "01",
                                    title: "検索×AIの\nハイブリッド戦略",
                                    desc: "Google検索のSEO対策だけでなく、ChatGPTなどのAI検索（SGE/LLM）にも引用されるための最新ロジックを提供します。"
                                },
                                {
                                    num: "02",
                                    title: "実践的な\nワークフロー構築",
                                    desc: "座学だけでなく、実際の記事制作を通じて「企画→執筆→編集」のフローを定着させ、自走できる組織を作ります。"
                                },
                                {
                                    num: "03",
                                    title: "属人化を防ぐ\nテンプレート",
                                    desc: "誰が書いても一定の品質を担保できる「構成案テンプレート」や「チェックリスト」を提供し、品質のバラつきを無くします。"
                                }
                            ].map((item, index) => (
                                <div key={index} className="group relative bg-white rounded-3xl p-8 md:p-16 overflow-hidden border border-gray-200 hover:border-black transition-colors duration-500">
                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                                        <div className="text-7xl md:text-9xl font-thin text-gray-200 font-mono group-hover:text-black transition-colors duration-500">{item.num}</div>
                                        <div className="flex-grow">
                                            <h3 className="text-2xl md:text-4xl font-bold mb-6 text-black leading-tight whitespace-pre-line">{item.title}</h3>
                                            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="hidden md:block w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* Benefits */}
                <section className="bg-black text-white py-24 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight">本プログラムで実現できること</h2>
                        </FadeIn>

                        <div className="space-y-24">
                            {/* Benefit 01 */}
                            <FadeIn>
                                <div className="grid md:grid-cols-12 gap-8 border-t border-gray-800 pt-12">
                                    <div className="md:col-span-3 text-4xl font-light text-gray-500">01</div>
                                    <div className="md:col-span-9">
                                        <h3 className="text-2xl font-bold mb-6">社内メンバーだけで記事制作が回る仕組み化</h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <ul className="space-y-3 text-gray-300 list-disc pl-5">
                                                <li>検索意図に沿った構成の作り方</li>
                                                <li>AIドラフトの生成〜編集フロー</li>
                                                <li>見出し設計テンプレート</li>
                                                <li>記事レビューのチェック項目</li>
                                                <li>業務フロー化、進行管理テンプレ</li>
                                            </ul>
                                            <p className="text-gray-400 leading-relaxed">
                                                属人化しがちなSEO・コンテンツ制作を、誰でも再現できる状態にします。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Benefit 02 */}
                            <FadeIn>
                                <div className="grid md:grid-cols-12 gap-8 border-t border-gray-800 pt-12">
                                    <div className="md:col-span-3 text-4xl font-light text-gray-500">02</div>
                                    <div className="md:col-span-9">
                                        <h3 className="text-2xl font-bold mb-6">AIサーチ（LLM）に引用されやすい構造設計</h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <ul className="space-y-3 text-gray-300 list-disc pl-5">
                                                <li>文章構造（Q&A / 箇条書き / 要点整理）</li>
                                                <li>エンティティ整理（自社名・サービス名）</li>
                                                <li>最新性の担保</li>
                                                <li>明快な情報階層</li>
                                                <li>各見出しが問いに対する完結した答えを持つこと</li>
                                            </ul>
                                            <p className="text-gray-400 leading-relaxed">
                                                これらを踏まえたLLMO対応コンテンツ設計を習得できます。生成AIが回答を作る際、引用しやすいコンテンツには“共通の型”があります。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Benefit 03 */}
                            <FadeIn>
                                <div className="grid md:grid-cols-12 gap-8 border-t border-gray-800 pt-12">
                                    <div className="md:col-span-3 text-4xl font-light text-gray-500">03</div>
                                    <div className="md:col-span-9">
                                        <h3 className="text-2xl font-bold mb-6">外注費を大幅に削減できる</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            社内で安定した記事制作ができるようになるため、従来の外注費（1記事3〜7万円）が1/2〜1/3に圧縮されるケースがほとんどです。
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Benefit 04 */}
                            <FadeIn>
                                <div className="grid md:grid-cols-12 gap-8 border-t border-gray-800 pt-12">
                                    <div className="md:col-span-3 text-4xl font-light text-gray-500">04</div>
                                    <div className="md:col-span-9">
                                        <h3 className="text-2xl font-bold mb-6">検索とAIの両方からの流入強化</h3>
                                        <ul className="grid grid-cols-2 gap-4 text-gray-300">
                                            <li className="flex items-center space-x-2"><span>•</span><span>Google検索のSEO評価</span></li>
                                            <li className="flex items-center space-x-2"><span>•</span><span>Google AIサマリー</span></li>
                                            <li className="flex items-center space-x-2"><span>•</span><span>ChatGPT / Gemini の回答</span></li>
                                            <li className="flex items-center space-x-2"><span>•</span><span>SNSでの二次拡散</span></li>
                                        </ul>
                                        <p className="text-gray-400 leading-relaxed mt-6">
                                            複数チャネルで見つけてもらえる“マルチ露出構造”をつくります。
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* Program Content */}
                <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center tracking-tight">プログラム内容（例）</h2>

                        <div className="space-y-12 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gray-200">
                            {/* Step 1 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1 pl-12 md:pl-0">
                                    <h3 className="text-xl font-bold mb-2">Step1：インプット講座（SEO×LLMO）</h3>
                                    <p className="text-sm text-gray-500 mb-4">（60〜90分 × 1〜2回）</p>
                                    <ul className="text-gray-600 text-sm space-y-1 inline-block text-left">
                                        <li>• 検索の最新動向とAIサーチの仕組み</li>
                                        <li>• 検索意図の読み取り基準</li>
                                        <li>• AIに引用されやすい構造とは</li>
                                        <li>• コンテンツSEOの基本設計</li>
                                        <li>• 良い記事・悪い記事の判断基準</li>
                                    </ul>
                                </div>
                                <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold z-10 -translate-x-0 md:-translate-x-1/2">1</div>
                                <div className="md:w-1/2 md:pl-12 order-3 md:order-2"></div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1"></div>
                                <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold z-10 -translate-x-0 md:-translate-x-1/2">2</div>
                                <div className="md:w-1/2 md:pl-12 order-3 md:order-2 pl-12 md:pl-0">
                                    <h3 className="text-xl font-bold mb-2">Step2：社内専用テンプレの提供</h3>
                                    <ul className="text-gray-600 text-sm space-y-1">
                                        <li>• 記事構成テンプレ</li>
                                        <li>• 見出し設計テンプレ</li>
                                        <li>• LLMOチェックシート</li>
                                        <li>• 編集・校正チェックリスト</li>
                                        <li>• 社内フロー化テンプレート</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1 pl-12 md:pl-0">
                                    <h3 className="text-xl font-bold mb-2">Step3：実案件での実践（2〜4本）</h3>
                                    <ul className="text-gray-600 text-sm space-y-1 inline-block text-left mb-4">
                                        <li>• 実際に御社テーマで記事構成作成</li>
                                        <li>• AIドラフト生成</li>
                                        <li>• 推敲・編集</li>
                                        <li>• 改善ポイントのフィードバック</li>
                                        <li>• メンバー教育</li>
                                    </ul>
                                    <p className="text-sm font-medium text-black">“やってみたら結局分からない” を徹底的に潰します。</p>
                                </div>
                                <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold z-10 -translate-x-0 md:-translate-x-1/2">3</div>
                                <div className="md:w-1/2 md:pl-12 order-3 md:order-2"></div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1"></div>
                                <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold z-10 -translate-x-0 md:-translate-x-1/2">4</div>
                                <div className="md:w-1/2 md:pl-12 order-3 md:order-2 pl-12 md:pl-0">
                                    <h3 className="text-xl font-bold mb-2">Step4：仕組み化・運用フローの構築</h3>
                                    <ul className="text-gray-600 text-sm space-y-1">
                                        <li>• 社内で毎月記事を出すオペレーション設計</li>
                                        <li>• 担当者ごとの役割と進行管理</li>
                                        <li>• レビューラインの整理</li>
                                        <li>• KPI・目標設定</li>
                                        <li>• 運用ドキュメント化</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Pricing */}
                <section className="bg-gray-50 py-24 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center tracking-tight">料金プラン</h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Plan 1 */}
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">単発プラン</h3>
                                    <p className="text-sm text-gray-500 mb-6">（2回研修＋テンプレ提供）</p>
                                    <div className="text-3xl font-bold mb-6">15〜30<span className="text-base font-normal text-gray-500 ml-1">万円</span></div>
                                    <ul className="space-y-3 text-gray-600 text-sm mb-8 flex-grow">
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>SEO/LLMO講座</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>テンプレート一式</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>質疑応答</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>社内向けの簡易アドバイス</li>
                                    </ul>
                                    <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 text-center">
                                        ※ お試し・小規模向け
                                    </div>
                                </div>

                                {/* Plan 2 */}
                                <div className="bg-black text-white p-8 rounded-xl shadow-lg transform md:-translate-y-4 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-gray-800 text-xs px-3 py-1 rounded-bl-lg">おすすめ</div>
                                    <h3 className="text-xl font-bold mb-2">伴走プラン</h3>
                                    <p className="text-sm text-gray-400 mb-6">（1〜2ヶ月）</p>
                                    <div className="text-3xl font-bold mb-6">30〜80<span className="text-base font-normal text-gray-400 ml-1">万円</span></div>
                                    <ul className="space-y-3 text-gray-300 text-sm mb-8 flex-grow">
                                        <li className="flex items-start"><span className="mr-2 text-white">•</span>講座</li>
                                        <li className="flex items-start"><span className="mr-2 text-white">•</span>テンプレ提供</li>
                                        <li className="flex items-start"><span className="mr-2 text-white">•</span>記事レビュー（2〜4本）</li>
                                        <li className="flex items-start"><span className="mr-2 text-white">•</span>運用フロー構築</li>
                                        <li className="flex items-start"><span className="mr-2 text-white">•</span>KPI設計</li>
                                        <li className="flex items-start"><span className="mr-2 text-white">•</span>メンバー育成</li>
                                    </ul>
                                    <div className="pt-6 border-t border-gray-800 text-xs text-gray-400 text-center">
                                        ※ 内製化まで“しっかり持っていく”企業向け
                                    </div>
                                </div>

                                {/* Plan 3 */}
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">継続プラン</h3>
                                    <p className="text-sm text-gray-500 mb-6">（マーケ顧問）</p>
                                    <div className="text-3xl font-bold mb-6">月15〜30<span className="text-base font-normal text-gray-500 ml-1">万円</span></div>
                                    <ul className="space-y-3 text-gray-600 text-sm mb-8 flex-grow">
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>コンテンツ戦略のアップデート</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>SEO/LLMOの中長期改善</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>社内体制のアップデート</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>必要に応じた記事レビュー</li>
                                        <li className="flex items-start"><span className="mr-2 text-black">•</span>月2回MTG＋チャット相談</li>
                                    </ul>
                                    <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 text-center">
                                        ※ 内製化後の継続支援として自然に移行可能
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* Contact */}
                <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <h2 className="text-3xl font-bold mb-8">ご相談・お問い合わせ</h2>
                        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                            まずは御社の現状や課題を伺いながら、<br />
                            プログラムの内容を 15〜30分でご説明いたします。<br />
                            少しでも気になる点がありましたら、<br />
                            お気軽にお問い合わせください。
                        </p>
                        <a
                            href="https://form.run/@mizuma-yuuki-contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-black text-white px-12 py-4 rounded-full font-bold tracking-wider hover:bg-gray-800 transition-colors"
                        >
                            お問い合わせはこちら
                        </a>
                    </FadeIn>
                </section>
            </main>

            <Footer />
        </div>
    );
};
