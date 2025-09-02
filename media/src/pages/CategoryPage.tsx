import React from 'react'
import { Link, useParams } from 'react-router-dom'
import featuredArticle from '../data/featuredArticle.json'
import specialArticles from '../data/specialArticles.json'
import recentArticles from '../data/recentArticles.json'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import { CompactCard } from '../components/CompactCard'

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

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const all = React.useMemo(() => {
    const pool = [featuredArticle, ...specialArticles, ...recentArticles].filter(Boolean) as any[]
    const bySlug = new Map<string, any>()
    for (const a of pool) if (a?.slug) bySlug.set(a.slug, a)
    return Array.from(bySlug.values())
  }, [])
  const catName = React.useMemo(() => {
    for (const a of all) {
      const n = a?.category || ''
      if (slugify(n) === slug) return n
    }
    return ''
  }, [slug])

  const items = React.useMemo(() => {
    return all
      .filter((a) => slugify(a?.category || '') === slug)
      .sort((a, b) => String(b.publishDate||'').localeCompare(String(a.publishDate||'')))
  }, [slug, all])

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{catName || 'カテゴリー'}</h1>
          <p className="text-muted-foreground">{items.length}件の記事</p>
        </div>
        {items.length === 0 ? (
          <div className="text-muted-foreground">該当する記事がありません。</div>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <Link to={`/articles/${a.slug}/`} key={a.slug}>
                <CompactCard {...a} />
              </Link>
            ))}
          </div>
        )}
      </main>
      <SimpleFooter />
    </div>
  )
}
