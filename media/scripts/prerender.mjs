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
// Jinzai tenant renderer
let renderJinzai = null
try {
  ({ render: renderJinzai } = await vite.ssrLoadModule('/src/jinzai/entry-server.tsx'))
} catch (e) {
  console.warn('Jinzai renderer not found or failed to load:', e?.message || e)
}

// dist output path from media/vite.config.ts
const outDir = path.resolve('../dist/media')
const templatePath = path.join(outDir, 'index.html')
// Normalize template to a single HTML document to avoid accidental duplication
function normalizeTemplate(html) {
  const s = String(html || '')
  // If multiple doctypes exist, keep only the first block through its first </html>
  const firstDoctype = s.toLowerCase().indexOf('<!doctype html')
  if (firstDoctype >= 0) {
    const after = s.slice(firstDoctype)
    const endIdx = after.toLowerCase().indexOf('</html>')
    if (endIdx >= 0) return after.slice(0, endIdx + '</html>'.length)
    return after
  }
  // Otherwise, trim anything after first closing </html>
  const endIdx = s.toLowerCase().indexOf('</html>')
  if (endIdx >= 0) return s.slice(0, endIdx + '</html>'.length)
  return s
}
const template = normalizeTemplate(fs.readFileSync(templatePath, 'utf-8'))
// jinzai outputs to separate folder and reuses the same template (CSS links) but strips JS to avoid SPA hydration mismatch
const outDirJinzai = path.resolve('../dist/jinzai')
function stripJS(html) {
  return html
    .replace(/<script\s+type="module"[^>]*>\s*<\/script>/g, '')
    .replace(/<script\s+nomodule[^>]*>\s*<\/script>/g, '')
    .replace(/<script\b[^>]*>[^<]*<\/script>/g, '')
}

const { bySlug: articles, recent, special, featured } = collectArticles()
// Load CTA config for SSR injection on article pages (ensures button appears in view-source too)
let inlineCtaCfg = null
try {
  const ctaPath = path.resolve('src/data/cta.json')
  inlineCtaCfg = JSON.parse(fs.readFileSync(ctaPath, 'utf-8'))?.inline || null
} catch {}
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
  const s = slugify(c)
  if (!s) continue
  catSet.set(s, c)
}
const categoryRoutes = Array.from(catSet.keys()).map((s) => `/media/category/${s}/`)

const routes = [
  '/media/',
  '/media/latest/',
  '/media/featured/',
  '/media/special/',
  '/media/resources/',
  '/media/tools/article/',
  '/media/search/',
  '/media/privacy/',
  '/media/terms/',
  '/media/ads/',
  '/media/categories/',
  ...categoryRoutes,
  ...Array.from(articles.keys()).map((slug) => `/media/articles/${slug}/`),
  ...pageRoutes
]

// Routes for jinzai tenant
const jinzaiRoutes = [
  '/jinzai/',
  '/jinzai/hiring/',
  '/jinzai/retention/',
  '/jinzai/staffing/',
  '/jinzai/efficiency/',
  '/jinzai/quality/'
]

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://ai-and-marketing.jp'

function applyHeadMeta(template, url, opts = {}) {
  let title = 'AI Marketing News｜マーケティングニュース・解説'
  let description = 'AI Marketing News｜マーケティングの最新ニュースと実務解説。'
  let canonical = `${SITE_ORIGIN}/media/`
  let ogUrl = `${SITE_ORIGIN}/media/`
  let ogType = 'website'
  let ogImage = `${SITE_ORIGIN}/media/ogp.png`
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
      ogType = 'article'
      const img = (a.imageUrl || '/media/ogp.png')
      ogImage = /^https?:\/\//.test(img) ? img : `${SITE_ORIGIN}${img}`
    }
  }
  // search page (shell) — add noindex
  if (url === '/media/search/') {
    title = `検索｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/search/`
    ogUrl = canonical
  }
  if (url === '/media/resources/') {
    title = `無料テンプレート・資料｜AI Marketing News`
    canonical = `${SITE_ORIGIN}/media/resources/`
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
  // og:type, og:image (article pages), keep website for others
  out = out.replace(/<meta property=\"og:type\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:type\" content=\"${ogType}\">`)
  out = out.replace(/<meta property=\"og:image\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:image\" content=\"${ogImage}\">`)
  // Inject site-wide metas if missing
  const injectIfMissing = (html, needleRegex, tag) => needleRegex.test(html) ? html : html.replace('</head>', `${tag}\n</head>`)
  out = injectIfMissing(out, /<meta property=\"og:site_name\"[^>]*>/, `<meta property=\"og:site_name\" content=\"${siteName}\">`)
  out = injectIfMissing(out, /<meta property=\"og:locale\"[^>]*>/, `<meta property=\"og:locale\" content=\"${locale}\">`)
  out = injectIfMissing(out, /<meta name=\"twitter:site\"[^>]*>/, `<meta name=\"twitter:site\" content=\"${twitterSite}\">`)
  // Twitter image fallback
  out = injectIfMissing(out, /<meta name=\"twitter:image\"[^>]*>/, `<meta name=\"twitter:image\" content=\"${ogImage}\">`)
  // Optional: image dimensions for OG
  out = injectIfMissing(out, /<meta property=\"og:image:width\"[^>]*>/, `<meta property=\"og:image:width\" content=\"1600\">`)
  out = injectIfMissing(out, /<meta property=\"og:image:height\"[^>]*>/, `<meta property=\"og:image:height\" content=\"900\">`)
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
  // jinzai: override head for tenant pages
  if (url === '/jinzai/' || url.startsWith('/jinzai/')) {
    const t = '人材不足解決.com｜Workforce Solutions'
    const can = `${SITE_ORIGIN}${url}`
    out = out
      .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
      .replace(/<meta name=\"description\"[^>]*>/, `<meta name=\"description\" content=\"人材不足を、現場から解決。採用・育成・配置・現場支援まで、投資対効果を可視化して実装まで伴走します。\">`)
      .replace(/<meta property=\"og:title\"[^>]*>/, `<meta property=\"og:title\" content=\"${t.replace(/"/g, '&quot;')}\">`)
      .replace(/<meta property=\"og:description\"[^>]*>/, `<meta property=\"og:description\" content=\"人材不足を、現場から解決。採用・育成・配置・現場支援まで。\">`)
      .replace(/<meta property=\"og:url\"[^>]*>/, `<meta property=\"og:url\" content=\"${can}\">`)
      .replace(/<link rel=\"canonical\"[^>]*>/, `<link rel=\"canonical\" href=\"${can}\">`)
      .replace(/<meta property=\"og:site_name\"[^>]*>/, `<meta property=\"og:site_name\" content=\"人材不足解決.com\">`)
  }
  return out
}

for (const url of routes) {
  let { html } = await render(url)
  // If this is an article page, inject inline CTA into SSR HTML so it is visible without client JS
  if (/^\/media\/articles\//.test(url) && inlineCtaCfg && inlineCtaCfg.title && inlineCtaCfg.buttonText && inlineCtaCfg.href) {
    const href = String(inlineCtaCfg.href) + String(inlineCtaCfg.utm || '')
    const ctaBlock = `\n<div class=\"my-8 p-4 border rounded-lg bg-card/50\" data-cta=\"inline\" style=\"overflow:visible\">\n  <div class=\"text-sm text-muted-foreground mb-1\">おすすめリソース</div>\n  <div class=\"flex flex-col md:flex-row md:items-center gap-3\">\n    <div class=\"flex-1\">\n      <div class=\"font-semibold text-foreground\">${inlineCtaCfg.title}</div>\n      ${inlineCtaCfg.text ? `<p class=\\\"text-sm text-muted-foreground m-0\\\">${inlineCtaCfg.text}</p>` : ''}\n    </div>\n    <a href=\"${href}\" target=\"_blank\" rel=\"noopener\" class=\"aima-inline-cta-btn\" style=\"display:inline-block;padding:12px 20px;border-radius:8px;background-color:#dc2626;color:#fff;-webkit-text-fill-color:#fff;font-weight:700;text-decoration:none;line-height:1.2;position:relative;z-index:10;box-shadow:0 6px 16px rgba(220,38,38,.2);opacity:1;visibility:visible;mix-blend-mode:normal;isolation:isolate;white-space:nowrap;font-size:16px;pointer-events:auto\">\n      <span style=\"position:relative;z-index:1;color:#fff;-webkit-text-fill-color:#fff;text-shadow:0 1px 0 rgba(0,0,0,.3),0 0 2px rgba(0,0,0,.2);-webkit-text-stroke:0.25px rgba(0,0,0,.15)\">${inlineCtaCfg.buttonText}</span>\n    </a>\n  </div>\n</div>\n`
    if (!/data-cta=\"inline\"/.test(html)) {
      html = html.replace('<div class="mt-4">', `<div class=\"mt-4\">${ctaBlock}`)
    }
  }
  let page = applyHeadMeta(template, url, { totalPages })
  // Replace the entire <body> to avoid accidental duplication or stale SSR remnants
  const outHtml = page.replace(/<body[^>]*>[\s\S]*?<\/body>/i, `<body><div id=\"root\">${html}</div></body>`)
  const rel = url.replace(/^\/media\/?/, '') // '' or 'articles/slug'
  const file = rel === '' ? path.join(outDir, 'index.html') : path.join(outDir, rel, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, outHtml)
}

// prerender jinzai tenant if renderer is available
if (renderJinzai) {
  for (const url of jinzaiRoutes) {
    const { html } = await renderJinzai(url)
    let page = applyHeadMeta(template, url)
    // strip JS to avoid hydrating with /media bundle; keep CSS from template
    page = stripJS(page)
    // For jinzai, replace the entire <body> to avoid any media remnants
    const outHtml = page.replace(/<body[^>]*>[\s\S]*?<\/body>/, `<body><div id=\"root\">${html}</div></body>`)
    const rel = url.replace(/^\/jinzai\/?/, '')
    const file = rel === '' ? path.join(outDirJinzai, 'index.html') : path.join(outDirJinzai, rel, 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, outHtml)
  }
  // Ensure Apache serves /jinzai/ with its own index.html (not /media/) and supports SPA-style routing under /jinzai
  try {
    const ht = `Options -MultiViews\nDirectoryIndex index.html\n# Disable any inherited rewrites; always serve files in this dir\nRewriteEngine Off\n`
    fs.writeFileSync(path.join(outDirJinzai, '.htaccess'), ht)
  } catch (e) {
    console.warn('Failed to write /jinzai/.htaccess:', e?.message || e)
  }
}

await vite.close()
// Ensure uploaded images are published: copy repo public/media/uploads -> dist/media/uploads
try {
  const srcUploads = path.resolve('../public/media/uploads')
  const dstUploads = path.resolve('../dist/media/uploads')
  if (fs.existsSync(srcUploads)) {
    fs.mkdirSync(dstUploads, { recursive: true })
    // Node 16+: use cpSync recursive
    fs.cpSync(srcUploads, dstUploads, { recursive: true })
  }
} catch (e) {
  console.warn('Failed to copy uploads:', e?.message || e)
}
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
    `${SITE_ORIGIN}/media/resources/`,
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
