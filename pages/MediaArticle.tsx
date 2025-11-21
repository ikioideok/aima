import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { Sidebar } from '../components/Sidebar';

export const MediaArticle: React.FC = () => {
    const { id } = useParams();

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
                                    <span>INSIGHT</span>
                                    <span>2024.05.15</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
                                    AIと創造性の未来：<br />共存か、代替か
                                </h1>
                                <div className="w-full aspect-video overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
                                        alt="Article Header"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="prose prose-lg max-w-none font-medium leading-loose text-justify mb-32">
                                <p>
                                    AI技術の急速な進化は、クリエイティブな領域にも大きな波紋を広げています。
                                    生成AIの登場により、画像、テキスト、音楽など、これまで人間にしか生み出せないと考えられていたものが、
                                    瞬時に生成されるようになりました。
                                </p>
                                <p>
                                    しかし、これは人間の創造性が不要になることを意味するのでしょうか？
                                    私たちはそうは考えません。AIはあくまで「道具」であり、それをどう使いこなすか、
                                    どのような問いを投げかけるかという点において、人間の意志と美意識がより一層重要になってくるはずです。
                                </p>
                                <h3 className="text-2xl font-bold mt-12 mb-6">共創の時代へ</h3>
                                <p>
                                    これからのクリエイターに求められるのは、AIと対立するのではなく、
                                    AIをパートナーとして迎え入れ、自身の創造性を拡張することです。
                                    AIが生成する膨大なパターンの中から、真に価値あるものを選び取り、
                                    文脈を与え、意味を紡ぎ出す。その編集能力こそが、新たな時代のクリエイティビティとなるでしょう。
                                </p>
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
