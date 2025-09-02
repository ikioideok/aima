import React from 'react'
import { Link } from 'react-router-dom'
import featuredArticle from '../data/featuredArticle.json'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import { SimpleCard } from '../components/SimpleCard'

export default function FeaturedPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">注目記事</h1>
          <p className="text-muted-foreground">現在の注目（Featured）記事</p>
        </div>

        {featuredArticle?.slug ? (
          <Link to={`/articles/${featuredArticle.slug}/`}>
            <SimpleCard {...featuredArticle} featured />
          </Link>
        ) : (
          <div className="text-muted-foreground">注目記事が見つかりません。</div>
        )}
      </main>
      <SimpleFooter />
    </div>
  )
}

