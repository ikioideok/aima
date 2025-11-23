import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FadeIn } from '../components/FadeIn';
import { Sidebar } from '../components/Sidebar';
import { SEO } from '../components/SEO';
import { Article } from '../types';





export const MediaArticle: React.FC = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
    const [processedContent, setProcessedContent] = useState<{ intro: string; body: string } | null>(null);
    const [isTocOpen, setIsTocOpen] = useState(true);

    useEffect(() => {
        if (!id) return;

        try {
            const localArticlesStr = localStorage.getItem('aima_media_articles');
            if (localArticlesStr) {
                const localArticles: Article[] = JSON.parse(localArticlesStr);
                const foundIndex = localArticles.findIndex(a => a.id === id);

                if (foundIndex !== -1) {
                    const found = localArticles[foundIndex];

                    // Increment views
                    const updatedArticle = {
                        ...found,
                        views: (found.views || 0) + 1
                    };

                    // Update state
                    setArticle(updatedArticle);
                    processContent(updatedArticle.content);
                    fetchRelatedArticles(updatedArticle);

                    // Save back to localStorage
                    localArticles[foundIndex] = updatedArticle;
                    localStorage.setItem('aima_media_articles', JSON.stringify(localArticles));
                }
            }
        } catch (error) {
            console.error('Failed to parse local articles:', error);
        }
    }, [id]);

    const processContent = (content: any) => {
        if (typeof content !== 'string') {
            setProcessedContent(null);
            return;
        }

        // Simple regex to find H2 and H3
        const headings: { id: string; text: string; level: number }[] = [];
        let modifiedContent = content;

        // 1. Add IDs to H2 and H3
        const div = document.createElement('div');
        div.innerHTML = content;

        const elements = div.querySelectorAll('h2, h3');
        elements.forEach((el, index) => {
            const id = `heading-${index}`;
            el.id = id;
            headings.push({
                id,
                text: el.textContent || '',
                level: el.tagName === 'H2' ? 2 : 3
            });
        });

        modifiedContent = div.innerHTML;
        setToc(headings);

        // 2. Split content at the first H2
        const firstH2Index = modifiedContent.indexOf('<h2');
        if (firstH2Index !== -1) {
            setProcessedContent({
                intro: modifiedContent.substring(0, firstH2Index),
                body: modifiedContent.substring(firstH2Index)
            });
        } else {
            setProcessedContent({
                intro: modifiedContent,
                body: ''
            });
        }
    };

    const fetchRelatedArticles = (currentArticle: Article) => {
        try {
            const localArticlesStr = localStorage.getItem('aima_media_articles');
            let allArticles: Article[] = [];

            if (localArticlesStr) {
                allArticles = JSON.parse(localArticlesStr);
            }

            // Filter: Same category, exclude current
            const related = allArticles
                .filter(a => a.category === currentArticle.category && a.id !== currentArticle.id)
                .slice(0, 3); // Take top 3

            setRelatedArticles(related);
        } catch (e) {
            console.error(e);
        }
    };

    if (!article) return <div className="pt-40 text-center">Loading...</div>;

    const displayArticle = article;

    return (
        <div className="font-serif text-black bg-white w-full overflow-x-hidden min-h-screen flex flex-col">
            <SEO
                title={displayArticle.title}
                description={displayArticle.subtitle || displayArticle.excerpt}
                image={displayArticle.image}
                path={`/media/${displayArticle.id}`}
            />
            <Navigation />

            <main className="flex-grow pt-40 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Article Content */}
                    <div className="lg:w-2/3">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-4 text-xs font-eng tracking-widest text-gray-500 mb-6">
                                <span>{displayArticle.category}</span>
                                <span>{displayArticle.date}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
                                {displayArticle.title}
                            </h1>
                            <div className="w-full aspect-video overflow-hidden">
                                <img
                                    src={displayArticle.heroImage || displayArticle.image}
                                    alt={displayArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none font-medium leading-loose text-justify mb-32">
                            {processedContent ? (
                                <>
                                    {/* Intro */}
                                    <div dangerouslySetInnerHTML={{ __html: processedContent.intro }} />

                                    {/* TOC */}
                                    {toc.length > 0 && (
                                        <div className="my-12 border border-gray-200 bg-gray-50 p-6 rounded-lg">
                                            <div
                                                className="flex justify-between items-center cursor-pointer mb-4"
                                                onClick={() => setIsTocOpen(!isTocOpen)}
                                            >
                                                <h3 className="text-lg font-bold m-0 !border-0 !p-0 !mt-0 !mb-0">目次</h3>
                                                <span className="text-xl">{isTocOpen ? '−' : '+'}</span>
                                            </div>
                                            {isTocOpen && (
                                                <ul className="list-none pl-0 space-y-2 m-0">
                                                    {toc.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className={`text-sm hover:text-gray-600 transition-colors ${item.level === 3 ? 'pl-4' : ''}`}
                                                        >
                                                            <a href={`#${item.id}`} className="no-underline text-black border-b border-transparent hover:border-gray-400">
                                                                {item.text}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {/* Supervisor Info */}
                                    {displayArticle.supervisor && (
                                        <div className="my-12 border border-black p-6 flex flex-col md:flex-row gap-6 items-start bg-white">
                                            {displayArticle.supervisor.image && (
                                                <img
                                                    src={displayArticle.supervisor.image}
                                                    alt={displayArticle.supervisor.name}
                                                    className="w-24 h-24 rounded-full object-cover flex-shrink-0 border border-gray-200"
                                                />
                                            )}
                                            <div>
                                                <div className="text-xs font-bold text-gray-500 mb-1">この記事の監修者</div>
                                                <div className="text-lg font-bold mb-1">{displayArticle.supervisor.name}</div>
                                                <div className="text-xs text-gray-600 mb-4">{displayArticle.supervisor.role}</div>
                                                {displayArticle.supervisor.comment && (
                                                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded relative">
                                                        <span className="absolute top-0 left-2 text-4xl text-gray-200 font-serif">“</span>
                                                        {displayArticle.supervisor.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Body */}
                                    <div dangerouslySetInnerHTML={{ __html: processedContent.body }} />
                                </>
                            ) : (
                                typeof displayArticle.content === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: displayArticle.content }} />
                                ) : (
                                    displayArticle.content
                                )
                            )}
                        </div>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div className="mb-24 border-t border-gray-200 pt-16">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[1px] w-12 bg-black"></div>
                                    <h2 className="text-sm font-eng font-bold tracking-widest m-0 !border-0 !p-0">RELATED ARTICLES</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {relatedArticles.map((article) => (
                                        <a key={article.id} href={`/media/${article.id}`} className="group block">
                                            <div className="aspect-video overflow-hidden mb-4 bg-gray-100">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 mb-2">{article.date}</div>
                                            <h3 className="text-sm font-bold leading-relaxed group-hover:text-gray-600 transition-colors m-0 !border-0 !p-0">
                                                {article.title}
                                            </h3>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-center mb-24">
                            <Link to="/media" className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest hover:text-gray-600 transition-colors">
                                BACK TO LIST
                            </Link>
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
