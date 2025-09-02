import React from 'react'
import { Link } from 'react-router-dom'
import specialArticles from '../data/specialArticles.json'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import { SimpleCard } from '../components/SimpleCard'

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">特集記事</h1>
          <p className="text-muted-foreground">厳選した特集記事一覧</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialArticles.map((a) => (
            <Link to={`/articles/${a.slug}/`} key={a.slug}>
              <SimpleCard {...a} />
            </Link>
          ))}
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

