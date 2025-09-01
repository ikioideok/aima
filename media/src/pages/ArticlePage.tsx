import React from 'react';
import { useParams } from 'react-router-dom';
import featuredArticle from '../data/featuredArticle.json';
import specialArticles from '../data/specialArticles.json';
import recentArticles from '../data/recentArticles.json';
import dummyArticle from '../data/dummyArticle.json'; // Import the new dummy article
import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';

// Combine all articles into one array. Note: featuredArticle is an object, not an array.
const allArticles = [featuredArticle, ...specialArticles, ...recentArticles, dummyArticle];

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = allArticles.find(a => a.slug === slug);

  // Build TOC and ensure headings have IDs
  const [processedHtml, setProcessedHtml] = React.useState<string | null>(null);
  const [toc, setToc] = React.useState<Array<{ id: string; text: string; level: 2 | 3 }>>([]);

  React.useEffect(() => {
    if (!article?.body) {
      setProcessedHtml(null);
      setToc([]);
      return;
    }
    const slugify = (s: string) => {
      return String(s || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.body, 'text/html');
      const headings = Array.from(doc.querySelectorAll('h2, h3')) as HTMLElement[];
      const seen = new Map<string, number>();
      const localToc: Array<{ id: string; text: string; level: 2 | 3 }> = [];
      headings.forEach((el) => {
        const level = el.tagName.toLowerCase() === 'h3' ? 3 : 2;
        const text = el.textContent || '';
        let id = el.getAttribute('id') || slugify(text);
        if (!id) return;
        // ensure unique ids
        const count = seen.get(id) || 0;
        if (count > 0) id = `${id}-${count + 1}`;
        seen.set(id, count + 1);
        el.setAttribute('id', id);
        localToc.push({ id, text, level: level as 2 | 3 });
      });
      setToc(localToc);
      setProcessedHtml(doc.body.innerHTML);
    } catch {
      // Fallback to raw HTML on parse error
      setProcessedHtml(article.body);
      setToc([]);
    }
  }, [article?.body]);

  const generateStructuredData = () => {
    if (!article) return null;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'image': [article.imageUrl],
      'datePublished': new Date(article.publishDate).toISOString(),
      'author': [{
        '@type': 'Person',
        'name': article.author
      }],
      'description': article.excerpt,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  };

  const pageContent = article ? (
    <article className="space-y-4">
      <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-8" />
      <h1 className="text-4xl font-bold text-foreground">{article.title}</h1>
      <div className="text-muted-foreground">
        <span>By {article.author}</span> | <span>{article.publishDate}</span> | <span>{article.readTime}</span>
      </div>
      <div className="border-b my-4"></div>
      <div className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-4">
        <p className="text-xl font-semibold">{article.excerpt}</p>
        {/* TOC */}
        {toc.length > 0 && (
          <nav className="rounded-md border p-4 bg-card/50">
            <div className="text-sm font-semibold mb-2">目次</div>
            <ul className="text-sm m-0">
              {toc.map((item, idx) => (
                <li key={idx} className={item.level === 3 ? 'ml-4 list-[circle]' : 'ml-0 list-disc'}>
                  <a href={`#${item.id}`} className="hover:underline">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {/* Render the body (with injected heading ids) */}
        {processedHtml && <div className="mt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />}
      </div>
    </article>
  ) : (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold">404 - Article Not Found</h1>
      <p className="text-muted-foreground">Sorry, the article you are looking for does not exist.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {generateStructuredData()}
      <SimpleHeader />
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        {pageContent}
      </main>
      <SimpleFooter />
    </div>
  );
};

export default ArticlePage;
