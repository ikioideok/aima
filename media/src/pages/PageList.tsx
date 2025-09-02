import React from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import recentArticles from '../data/recentArticles.json'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import { CompactCard } from '../components/CompactCard'

const PAGE_SIZE = 10

export default function PageList() {
  const { page } = useParams<{ page: string }>()
  const current = Math.max(1, Math.floor(Number(page || '1')))
  // Canonicalize page 1 to home
  if (current === 1) return <Navigate to="/" replace />

  const total = Math.max(1, Math.ceil(recentArticles.length / PAGE_SIZE))
  if (current > total) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p className="text-muted-foreground">ページが見つかりません。</p>
          </div>
        </main>
        <SimpleFooter />
      </div>
    )
  }

  const start = (current - 1) * PAGE_SIZE
  const items = recentArticles.slice(start, start + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">最新記事 - ページ {current}</h1>
          <p className="text-muted-foreground">最近の記事一覧（{current} / {total}）</p>
        </div>

        <div className="space-y-4">
          {items.map((article) => (
            <Link to={`/articles/${article.slug}/`} key={article.slug}>
              <CompactCard {...article} />
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          {current > 1 ? (
            <a className="underline" href={current === 2 ? `/media/` : `/media/page/${current - 1}/`}>← 前のページ</a>
          ) : <span />}
          {current < total ? (
            <a className="underline" href={`/media/page/${current + 1}/`}>次のページ →</a>
          ) : <span />}
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

