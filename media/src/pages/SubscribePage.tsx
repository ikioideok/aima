import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import NewsletterCard from '../components/NewsletterCard'

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">ニュースレター登録</h1>
        <div className="prose max-w-none leading-relaxed space-y-6">
          <p>
            AI×マーケの実務に役立つ最新記事やテンプレート情報を、メールでお届けします。登録は1分、いつでも解除可能です。
          </p>
        </div>
        <div className="mt-6">
          <NewsletterCard />
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

