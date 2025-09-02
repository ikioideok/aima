import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import { CompactCard } from '../components/CompactCard'
import featuredArticle from '../data/featuredArticle.json'
import specialArticles from '../data/specialArticles.json'
import recentArticles from '../data/recentArticles.json'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

function htmlToText(html?: string): string {
  const s = String(html || '')
  // quick strip tags
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function SearchPage() {
  const q = useQuery().get('q')?.trim() || ''

  const all = React.useMemo(() => {
    const arr = [featuredArticle, ...specialArticles, ...recentArticles].filter(Boolean) as any[]
    return arr
  }, [])

  const results = React.useMemo(() => {
    if (!q) return [] as any[]
    const qLower = q.toLowerCase()
    const tokens = qLower.split(/\s+/).filter(Boolean)
    const match = (a: any) => {
      const title = String(a.title || '').toLowerCase()
      const excerpt = String(a.excerpt || '').toLowerCase()
      const body = htmlToText(a.body).toLowerCase()
      const hay = `${title} ${excerpt} ${body}`
      // require all tokens to appear (AND)
      return tokens.every((t) => hay.includes(t))
    }
    const filtered = all.filter((a) => match(a))
    return filtered
  }, [q, all])

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">検索</h1>
          <p className="text-muted-foreground">キーワードで記事を検索します</p>
        </div>

        <form action="/media/search" method="get" className="mb-6 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="記事を検索..."
            className="flex-1 border rounded px-3 py-2 bg-input-background"
            aria-label="検索キーワード"
          />
          <button type="submit" className="px-3 py-2 border rounded">検索</button>
        </form>

        {q ? (
          <div className="mb-4 text-sm text-muted-foreground">{results.length}件ヒット</div>
        ) : (
          <div className="mb-4 text-sm text-muted-foreground">キーワードを入力して検索してください</div>
        )}

        {q && results.length === 0 && (
          <div className="text-sm text-muted-foreground">該当する記事が見つかりませんでした。</div>
        )}

        <div className="space-y-4">
          {results.map((a) => (
            <Link to={`/articles/${a.slug}/`} key={a.slug}>
              <CompactCard {...a} />
            </Link>
          ))}
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

