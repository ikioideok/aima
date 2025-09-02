import { createServer } from 'vite'
import fs from 'fs'
import path from 'path'

// Build routes: '/' and all article detail pages
function collectArticles() {
  const dataDir = path.resolve('src/data')
  const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(dataDir, p), 'utf-8'))

  const featured = readJSON('featuredArticle.json')
  const recent = readJSON('recentArticles.json')
  const special = readJSON('specialArticles.json')
  const dummy = fs.existsSync(path.join(dataDir, 'dummyArticle.json'))
    ? readJSON('dummyArticle.json')
    : null

  const bySlug = new Map()
  const add = (a) => { if (a?.slug) bySlug.set(a.slug, a) }
  add(featured)
  for (const a of recent || []) add(a)
  for (const a of special || []) add(a)
  if (dummy) add(dummy)

  return { bySlug, featured, recent, special }
}

// Use Vite's SSR loader
const vite = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true, hmr: false },
  appType: 'custom'
})

// The entry is under src/media/entry-server.tsx
const { render } = await vite.ssrLoadModule('/src/media/entry-server.tsx')

// dist output path from media/vite.config.ts
const outDir = path.resolve('../dist/media')
const templatePath = path.join(outDir, 'index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

const { bySlug: articles, recent, special, featured } = collectArticles()
const PAGE_SIZE = 10
const totalPages = Math.max(1, Math.ceil((recent || []).length / PAGE_SIZE))
const pageRoutes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => `/media/page/${i + 2}/`)
// collect categories
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const all = [featured, ...(special||[]), ...(recent||[])].filter(Boolean)
const catSet = new Map()
for (const a of all) {
  const c = a?.category
  if (!c) continue
  catSet.set(slugify(c), c)
}
const categoryRoutes = Array.from(catSet.keys()).map((s) => `/media/category/${s}/`)

const routes = [
  '/media/',
  '/media/latest/',
  '/media/featured/',
  '/media/special/',
  '/media/search/',
  '/media/privacy/',
  '/media/terms/',
  '/media/ads/',
  '/media/categories/',
  ...categoryRoutes,
  ...Array.from(articles.keys()).map((slug) => `/media/articles/${slug}/`),
  ...pageRoutes
]

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://ai-and-marketing.jp'

function applyHeadMeta(template, url, opts = {}) {
  let title = 'AI Marketing News｜マーケティングニュース・解説'
  let description = 'AI Marketing News｜マーケティングの最新ニュースと実務解説。'
  let canonical = `${SITE_ORIGIN}/media/`
  let ogUrl = `${SITE_ORIGIN}/media/`
  const siteName = 'AI Marketing News'
  const locale = 'ja_JP'
  const twitterSite = '@ai_marketing_news'

  const m = url.match(/^\/media\/articles\/([^/]+)\/?$/)
  if (m) {
    const slug = m[1]
    const a = articles.get(slug)
    if (a) {
      title = `${a.title}｜AI Marketing News`
      description = (a.excerpt || description).slice(0, 160)
      canonical = `${SITE_ORIGIN}/media/articles/${slug}/`
      ogUrl = canonical
    }
  }
  // search page (shell) — add noindex
  if (url === '/media/search/') {
    title = `検索｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/search/`
    ogUrl = canonical
  }
  // pagination pages
  const pm = url.match(/^\/media\/page\/(\d+)\/?$/)
  if (pm) {
    const n = Number(pm[1] || '2')
    title = `最新記事 - ページ ${n}｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/page/${n}/`
    ogUrl = canonical
  }
  // categories index
  if (url === '/media/categories/') {
    title = `カテゴリー｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/categories/`
    ogUrl = canonical
  }
  // static legal pages
  if (url === '/media/privacy/') {
    title = `プライバシーポリシー｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/privacy/`
    ogUrl = canonical
  }
  if (url === '/media/terms/') {
    title = `利用規約｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/terms/`
    ogUrl = canonical
  }
  if (url === '/media/ads/') {
    title = `広告掲載について｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/ads/`
    ogUrl = canonical
  }
  // category pages
  const cm = url.match(/^\/media\/category\/([^/]+)\/?$/)
  if (cm) {
    const slug = cm[1]
    const name = catSet.get(slug) || 'カテゴリー'
    title = `${name}｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/category/${slug}/`
    ogUrl = canonical
  }
  // section pages
  if (url === '/media/latest/') {
    title = `最新記事｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/latest/`
    ogUrl = canonical
  } else if (url === '/media/featured/') {
    title = `注目記事｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/featured/`
    ogUrl = canonical
  } else if (url === '/media/special/') {
    title = `特集記事｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/special/`
    ogUrl = canonical
  }

  // Replace basic tags in head
  let out = template
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`) 
  out = out.replace(/<meta name=\"description\" content=\"[^\"]*\"\s*\/>/, `<meta name=\"description\" content=\"${description.replace(/"/g, '&quot;')}\">`)
  out = out.replace(/<meta property=\"og:title\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:title\" content=\"${title.replace(/"/g, '&quot;')}\">`)
  out = out.replace(/<meta property=\"og:description\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:description\" content=\"${description.replace(/"/g, '&quot;')}\">`)
  out = out.replace(/<meta property=\"og:url\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:url\" content=\"${ogUrl}\">`)
  out = out.replace(/<link rel=\"canonical\" href=\"[^\"]*\"\s*\/>/, `<link rel=\"canonical\" href=\"${canonical}\">`)
  // Inject site-wide metas if missing
  const injectIfMissing = (html, needleRegex, tag) => needleRegex.test(html) ? html : html.replace('</head>', `${tag}\n</head>`)
  out = injectIfMissing(out, /<meta property=\"og:site_name\"[^>]*>/, `<meta property=\"og:site_name\" content=\"${siteName}\">`)
  out = injectIfMissing(out, /<meta property=\"og:locale\"[^>]*>/, `<meta property=\"og:locale\" content=\"${locale}\">`)
  out = injectIfMissing(out, /<meta name=\"twitter:site\"[^>]*>/, `<meta name=\"twitter:site\" content=\"${twitterSite}\">`)
  if (url === '/media/search/') {
    out = injectIfMissing(out, /<meta name=\"robots\"[^>]*>/, `<meta name=\"robots\" content=\"noindex, nofollow\">`)
  }

  // prev/next for pagination
  const total = opts.totalPages || 1
  if (url === '/media/' && total > 1) {
    out = injectIfMissing(out, /<link rel=\"next\"[^>]*>/, `<link rel=\"next\" href=\"${SITE_ORIGIN}/media/page/2/\">`)
  }
  const pm2 = url.match(/^\/media\/page\/(\d+)\/?$/)
  if (pm2) {
    const n = Number(pm2[1] || '2')
    if (n > 1) {
      const prevHref = n === 2 ? `${SITE_ORIGIN}/media/` : `${SITE_ORIGIN}/media/page/${n - 1}/`
      out = injectIfMissing(out, /<link rel=\"prev\"[^>]*>/, `<link rel=\"prev\" href=\"${prevHref}\">`)
    }
    if (n < total) {
      const nextHref = `${SITE_ORIGIN}/media/page/${n + 1}/`
      out = injectIfMissing(out, /<link rel=\"next\"[^>]*>/, `<link rel=\"next\" href=\"${nextHref}\">`)
    }
  }
  return out
}

for (const url of routes) {
  const { html } = await render(url)
  let page = applyHeadMeta(template, url, { totalPages })
  const outHtml = page.replace('<div id="root"></div>', `<div id=\"root\">${html}</div>`) 
  const rel = url.replace(/^\/media\/?/, '') // '' or 'articles/slug'
  const file = rel === '' ? path.join(outDir, 'index.html') : path.join(outDir, rel, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, outHtml)
}

await vite.close()
// Generate RSS feed
try {
  const items = Object.values(Object.fromEntries(articles))
    .filter((a) => a && a.slug)
    // prioritize recent order as listed in data
  const recentOrder = (recent || []).map((a) => a.slug)
  const bySlug = new Map(items.map((a) => [a.slug, a]))
  const ordered = recentOrder.map((s) => bySlug.get(s)).filter(Boolean)

  const rssItems = ordered.slice(0, 50).map((a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_ORIGIN}/media/articles/${a.slug}/</link>
      <guid>${SITE_ORIGIN}/media/articles/${a.slug}/</guid>
      <pubDate>${new Date(a.publishDate).toUTCString()}</pubDate>
      <description>${escapeXml(a.excerpt || '')}</description>
    </item>`).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>AI Marketing News</title>
      <link>${SITE_ORIGIN}/media/</link>
      <description>マーケティングの最新ニュースと実務解説</description>
      <language>ja</language>
      ${rssItems}
    </channel>
  </rss>`
  fs.writeFileSync(path.join(outDir, 'feed.xml'), rss.trim() + '\n')
} catch (e) {
  console.warn('Failed to generate RSS:', e?.message || e)
}

// Generate sitemap for /media
try {
  const urls = [
    `${SITE_ORIGIN}/media/`,
    ...Array.from(articles.keys()).map((slug) => `${SITE_ORIGIN}/media/articles/${slug}/`),
    ...pageRoutes.map((p) => `${SITE_ORIGIN}${p}`),
    `${SITE_ORIGIN}/media/latest/`,
    `${SITE_ORIGIN}/media/featured/`,
    `${SITE_ORIGIN}/media/special/`,
    `${SITE_ORIGIN}/media/privacy/`,
    `${SITE_ORIGIN}/media/terms/`,
    `${SITE_ORIGIN}/media/ads/`,
    `${SITE_ORIGIN}/media/categories/`,
    ...categoryRoutes.map((p) => `${SITE_ORIGIN}${p}`)
  ]
  const today = new Date().toISOString().slice(0, 10)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((u) => `<url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('\n    ')}
  </urlset>`
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml.trim() + '\n')
} catch (e) {
  console.warn('Failed to generate sitemap:', e?.message || e)
}

console.log('Prerendered routes:', routes)

// helpers
function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
