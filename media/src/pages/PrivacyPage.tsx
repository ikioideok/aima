import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">プライバシーポリシー</h1>
        <p className="text-muted-foreground mb-6">このページは仮のプライバシーポリシーです。正式版の掲載までしばらくお待ちください。</p>
        <div className="prose max-w-none">
          <p>本サイトでは、ユーザー体験の向上およびコンテンツ提供のためにアクセス情報等を利用する場合があります。詳細は正式版のポリシーにてご案内します。</p>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

