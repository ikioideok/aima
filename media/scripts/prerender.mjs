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

  return bySlug
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

const articles = collectArticles()
const routes = ['/media/', ...Array.from(articles.keys()).map((slug) => `/media/articles/${slug}/`)]

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://ai-and-marketing.jp'

function applyHeadMeta(template, url) {
  let title = 'AI Marketing News｜マーケティングニュース・解説'
  let description = 'AI Marketing News｜マーケティングの最新ニュースと実務解説。'
  let canonical = `${SITE_ORIGIN}/media/`
  let ogUrl = `${SITE_ORIGIN}/media/`

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

  // Replace basic tags in head
  let out = template
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`) 
  out = out.replace(/<meta name=\"description\" content=\"[^\"]*\"\s*\/>/, `<meta name=\"description\" content=\"${description.replace(/"/g, '&quot;')}\">`)
  out = out.replace(/<meta property=\"og:title\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:title\" content=\"${title.replace(/"/g, '&quot;')}\">`)
  out = out.replace(/<meta property=\"og:description\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:description\" content=\"${description.replace(/"/g, '&quot;')}\">`)
  out = out.replace(/<meta property=\"og:url\" content=\"[^\"]*\"\s*\/>/, `<meta property=\"og:url\" content=\"${ogUrl}\">`)
  out = out.replace(/<link rel=\"canonical\" href=\"[^\"]*\"\s*\/>/, `<link rel=\"canonical\" href=\"${canonical}\">`)
  return out
}

for (const url of routes) {
  const { html } = await render(url)
  let page = applyHeadMeta(template, url)
  const outHtml = page.replace('<div id="root"></div>', `<div id=\"root\">${html}</div>`) 
  const rel = url.replace(/^\/media\/?/, '') // '' or 'articles/slug'
  const file = rel === '' ? path.join(outDir, 'index.html') : path.join(outDir, rel, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, outHtml)
}

await vite.close()
console.log('Prerendered routes:', routes)
