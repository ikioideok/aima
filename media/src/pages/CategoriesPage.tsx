import React from 'react'
import { Link } from 'react-router-dom'
import featuredArticle from '../data/featuredArticle.json'
import specialArticles from '../data/specialArticles.json'
import recentArticles from '../data/recentArticles.json'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

function slugify(str: string): string {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function CategoriesPage() {
  // Use unique articles (by slug) so counts match category pages
  const all = React.useMemo(() => {
    const pool = [featuredArticle, ...specialArticles, ...recentArticles].filter(Boolean) as any[]
    const bySlug = new Map<string, any>()
    for (const a of pool) if (a?.slug) bySlug.set(a.slug, a)
    return Array.from(bySlug.values())
  }, [])
  const map = new Map<string, { name: string, count: number }>()
  for (const a of all) {
    const name = a?.category || 'その他'
    const s = slugify(name)
    const cur = map.get(s) || { name, count: 0 }
    cur.count += 1
    map.set(s, cur)
  }
  const cats = Array.from(map.entries()).map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">カテゴリー</h1>
          <p className="text-muted-foreground">記事のカテゴリー一覧</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}/`} className="p-4 border rounded hover:bg-accent/50 transition-colors">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.count}件</div>
            </Link>
          ))}
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}
