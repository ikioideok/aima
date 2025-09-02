import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function AdsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">広告掲載について</h1>
        <p className="text-muted-foreground mb-6">このページは仮の広告掲載案内です。正式な掲載要件・料金等は準備でき次第公開します。</p>
        <div className="prose max-w-none">
          <p>広告掲載のご相談は「お問い合わせ」よりご連絡ください。</p>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

