import React from 'react';
import { useParams, Link } from 'react-router-dom';
import featuredArticle from '../data/featuredArticle.json';
import specialArticles from '../data/specialArticles.json';
import recentArticles from '../data/recentArticles.json';
import dummyArticle from '../data/dummyArticle.json'; // Import the new dummy article
import cta from '../data/cta.json';
import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';
import { CompactCard } from '../components/CompactCard';
import { ReviewerCard } from '../components/ReviewerCard';
import siteOwner from '../data/siteOwner.json';
import NewsletterCard from '../components/NewsletterCard';

// Combine all articles into one array. Note: featuredArticle is an object, not an array.
const allArticles = [featuredArticle, ...specialArticles, ...recentArticles, dummyArticle];

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = allArticles.find(a => a.slug === slug);

  // Build TOC and ensure headings have IDs
  const [processedHtml, setProcessedHtml] = React.useState<string | null>(null);
  const [toc, setToc] = React.useState<Array<{ id: string; text: string; level: 2 | 3 }>>([]);
  const [tocOpen, setTocOpen] = React.useState(false);

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
        // Clean heading text: remove accidental prefixes like "h3:"/"h3：" etc.
        const raw = el.textContent || '';
        const cleaned = raw.replace(/^\s*h[23]\s*[:：]\s*/i, '');
        if (cleaned !== raw) {
          el.textContent = cleaned;
        }
        const text = cleaned;
        let id = el.getAttribute('id') || slugify(text);
        if (!id) return;
        // ensure unique ids
        const count = seen.get(id) || 0;
        if (count > 0) id = `${id}-${count + 1}`;
        seen.set(id, count + 1);
        el.setAttribute('id', id);
        localToc.push({ id, text, level: level as 2 | 3 });
      });

      // Insert double line breaks (~150 chars) within long paragraphs for readability
      try {
        const LIMIT = 150;
        const paragraphs = Array.from(doc.querySelectorAll('p')) as HTMLParagraphElement[];
        const insertDoubleBreak = (node: Text, pos: number) => {
          const full = node.nodeValue || '';
          const before = full.slice(0, pos);
          const after = full.slice(pos);
          const beforeNode = document.createTextNode(before);
          const afterNode = document.createTextNode(after);
          const br1 = document.createElement('br');
          const br2 = document.createElement('br');
          const parent = node.parentNode!;
          parent.insertBefore(beforeNode, node);
          parent.insertBefore(br1, node);
          parent.insertBefore(br2, node);
          parent.insertBefore(afterNode, node);
          parent.removeChild(node);
          return afterNode; // remaining text node after the breaks
        };
        const applyBreaks = (el: HTMLElement) => {
          if ((el as any).dataset && (el as any).dataset.broken === '1') return;
          if (el.closest('pre, code, blockquote')) return; // skip code-like
          const total = (el.textContent || '').replace(/\s+/g, '').length;
          if (total <= LIMIT * 1.2) return; // only long paragraphs
          let count = 0;
          const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
          const toProcess: Text[] = [];
          while (true) {
            const n = walker.nextNode() as Text | null;
            if (!n) break;
            if ((n.nodeValue || '').trim().length === 0) continue;
            toProcess.push(n);
          }
          let nextBreakAt = LIMIT;
          for (let i = 0; i < toProcess.length; i++) {
            let t = toProcess[i];
            while (t) {
              const len = (t.nodeValue || '').replace(/\s+/g, '').length;
              if (count + len < nextBreakAt) { count += len; break; }
              const raw = t.nodeValue || '';
              if (!raw) break;
              let acc = 0;
              let splitPos = raw.length;
              for (let j = 0; j < raw.length; j++) {
                const ch = raw[j];
                if (!/\s/.test(ch)) acc++;
                if (acc === (nextBreakAt - count)) { splitPos = j + 1; break; }
              }
              // prefer punctuation near boundary
              const windowStart = Math.max(0, splitPos - 12);
              const windowEnd = Math.min(raw.length, splitPos + 12);
              const window = raw.slice(windowStart, windowEnd);
              const punctIndex = Math.max(window.lastIndexOf('。'), window.lastIndexOf('、'));
              if (punctIndex >= 0) {
                splitPos = windowStart + punctIndex + 1;
              }
              const remaining = insertDoubleBreak(t, splitPos);
              t = remaining;
              count = nextBreakAt;
              nextBreakAt += LIMIT;
            }
          }
          (el as any).dataset = { ...(el as any).dataset, broken: '1' };
        };
        paragraphs.forEach(p => applyBreaks(p));
      } catch {}

      // Inline CTA: insert around the middle of the content
      try {
        const cfg = (cta as any)?.inline || {};
        const hrefBase = String(cfg.href || '#');
        const utm = String(cfg.utm || '');
        const href = hrefBase + utm;
        if (cfg?.title && cfg?.buttonText && hrefBase !== '#') {
          const blocks = Array.from(doc.querySelectorAll('h2, h3, p, ul, ol, table, pre, blockquote, figure')) as HTMLElement[];
          const middleIdx = blocks.length > 0 ? Math.floor(blocks.length / 2) : -1;
          const target = middleIdx >= 0 ? blocks[middleIdx] : (doc.querySelector('h2') as HTMLElement | null);
          if (target) {
            const wrapper = doc.createElement('div');
            wrapper.innerHTML = `
              <div class="my-8 p-4 border rounded-lg bg-card/50" data-cta="inline">
                <div class="text-sm text-muted-foreground mb-1">おすすめリソース</div>
                <div class="flex flex-col md:flex-row md:items-center gap-3">
                  <div class="flex-1">
                    <div class="font-semibold text-foreground">${cfg.title}</div>
                    ${cfg.text ? `<p class=\"text-sm text-muted-foreground m-0\">${cfg.text}</p>` : ''}
                  </div>
                  <a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center justify-center px-5 py-3 rounded-md bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300">
                    ${cfg.buttonText}
                  </a>
                </div>
              </div>`;
            target.insertAdjacentElement('afterend', wrapper.firstElementChild as Element);
          }
        }
      } catch {}
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

    const reviewerName = (article.reviewer || '').trim() || (siteOwner?.name || '')
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
      ...(reviewerName ? { reviewedBy: [{ '@type': 'Person', name: reviewerName }] } : {}),
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
      {(() => {
        const hero = article.imageUrl && article.imageUrl.trim() !== ''
          ? article.imageUrl
          : '/media/ogp.png'
        return (
          <div className="w-full aspect-[16/9] rounded-lg mb-8 overflow-hidden bg-white" style={{ backgroundColor: '#ffffff' }}>
            <img
              src={hero}
              alt={article.title}
              decoding="async"
              loading="eager"
              fetchpriority="high"
              width={1600}
              height={900}
              className="w-full h-full object-contain"
            />
          </div>
        )
      })()}
      <h1 className="text-4xl font-bold text-foreground">{article.title}</h1>
      <div className="text-muted-foreground flex flex-wrap gap-2 items-center">
        <span>By {article.author}</span>
        <span className="opacity-50">|</span>
        <span>{article.publishDate}</span>
        <span className="opacity-50">|</span>
        <span>{article.readTime}</span>
        {(() => {
          const reviewerName = (article.reviewer || '').trim() || (siteOwner?.name || '')
          return reviewerName ? (
            <>
              <span className="opacity-50">|</span>
              <span>監修者: {reviewerName}</span>
            </>
          ) : null
        })()}
      </div>
      <div className="border-b my-4"></div>
      <div className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-4">
        <p className="text-xl font-semibold">{article.excerpt}</p>
        {/* TOC */}
        {toc.length > 0 && (
          <nav className="rounded-md border p-0 bg-card/50">
            <button
              type="button"
              onClick={() => setTocOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-accent/50"
              aria-expanded={tocOpen}
              aria-controls="toc-content"
            >
              <span>目次</span>
              <span className="text-xs text-muted-foreground">{tocOpen ? '閉じる' : '開く'}</span>
            </button>
            {tocOpen && (
              <ul id="toc-content" className="text-sm m-0 px-4 pb-4">
                {toc.map((item, idx) => (
                  <li key={idx} className={item.level === 3 ? 'ml-4 list-[circle]' : 'ml-0 list-disc'}>
                    <a href={`#${item.id}`} className="hover:underline" onClick={() => setTocOpen(false)}>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
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

      {/* Reviewer Card */}
      <ReviewerCard
        info={{
          name: (article.reviewer || '').trim() || (siteOwner?.name || ''),
          title: siteOwner?.title,
          bio: siteOwner?.bio,
          avatarUrl: siteOwner?.avatarUrl,
          links: siteOwner?.links as any,
        }}
      />

      {/* Newsletter Signup */}
      <section className="mt-10">
        <NewsletterCard />
      </section>

      {/* Bottom CTA */}
      {(() => {
        const cfg: any = (cta as any)?.bottom || {};
        if (!cfg?.title || !cfg?.buttonText || !cfg?.href) return null;
        const href = String(cfg.href) + String(cfg.utm || '');
        return (
          <section className="mt-12">
            <div className="p-6 rounded-xl border bg-card/50">
              <div className="text-sm text-muted-foreground mb-2">ご案内</div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold m-0">{cfg.title}</h2>
                  {cfg.text ? <p className="text-muted-foreground m-0">{cfg.text}</p> : null}
                </div>
                <a href={href} target="_blank" rel="noopener" className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition whitespace-nowrap">
                  {cfg.buttonText}
                </a>
              </div>
            </div>
          </section>
        );
      })()}

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
