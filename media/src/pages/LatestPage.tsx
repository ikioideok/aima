import React from 'react'
import { Link } from 'react-router-dom'
import recentArticles from '../data/recentArticles.json'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import { CompactCard } from '../components/CompactCard'

export default function LatestPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">最新記事</h1>
          <p className="text-muted-foreground">最新の記事一覧</p>
        </div>

        <div className="space-y-4">
          {recentArticles.map((a) => (
            <Link to={`/articles/${a.slug}/`} key={a.slug}>
              <CompactCard {...a} />
            </Link>
          ))}
        </div>

        {/* pagination entry point */}
        {recentArticles.length > 10 && (
          <div className="text-center pt-8">
            <a className="underline" href="/media/page/2/">さらに記事を読む →</a>
          </div>
        )}
      </main>
      <SimpleFooter />
    </div>
  )
}

