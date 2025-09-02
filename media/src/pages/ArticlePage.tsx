import React from 'react';
import { useParams, Link } from 'react-router-dom';
import featuredArticle from '../data/featuredArticle.json';
import specialArticles from '../data/specialArticles.json';
import recentArticles from '../data/recentArticles.json';
import dummyArticle from '../data/dummyArticle.json'; // Import the new dummy article
import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';
import { CompactCard } from '../components/CompactCard';

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

  // Related articles (same category first, then fill with latest)
  const related = React.useMemo(() => {
    if (!article) return [] as typeof allArticles
    const bySlug = new Map<string, any>()
    for (const a of allArticles) if (a?.slug) bySlug.set(a.slug, a)
    const pool = Array.from(bySlug.values()).filter(a => a.slug !== article.slug)
    const sameCat = pool.filter(a => a.category === article.category)
    const sortByDateDesc = (arr: any[]) => arr.slice().sort((a,b)=> String(b.publishDate||'').localeCompare(String(a.publishDate||'')))
    const primary = sortByDateDesc(sameCat).slice(0, 3)
    if (primary.length >= 3) return primary
    const latest = sortByDateDesc(pool.filter(a => !primary.find(p=>p.slug===a.slug)))
    return [...primary, ...latest].slice(0,3)
  }, [article])

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
      {article.imageUrl ? (
        <div className="w-full aspect-[16/9] rounded-lg mb-8 overflow-hidden bg-white">
          <img
            src={article.imageUrl}
            alt={article.title}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            width={1600}
            height={900}
            className="w-full h-full object-contain"
          />
        </div>
      ) : null}
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
        {/* Render the body (SSR fallback to original HTML) */}
        {((processedHtml ?? article.body) as string) && (
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: (processedHtml ?? article.body) as string }}
          />
        )}
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">関連記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((a) => (
              <Link to={`/articles/${a.slug}/`} key={a.slug}>
                <CompactCard {...a} />
              </Link>
            ))}
          </div>
        </section>
      )}
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
      {/* BreadcrumbList JSON-LD */}
      {article && (
        <script
          type="application/ld+json"
          // Home (/media/) > Article
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ai-and-marketing.jp/media/' },
              { '@type': 'ListItem', position: 2, name: article.title, item: `https://ai-and-marketing.jp/media/articles/${article.slug}/` }
            ]
          }) }}
        />
      )}
      <SimpleHeader />
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        {pageContent}
      </main>
      <SimpleFooter />
    </div>
  );
};

export default ArticlePage;
