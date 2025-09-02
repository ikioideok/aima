import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">利用規約</h1>
        <p className="text-muted-foreground mb-6">このページは仮の利用規約です。正式版の掲載までしばらくお待ちください。</p>
        <div className="prose max-w-none">
          <p>本サイトの利用にあたっての条件や禁止事項等については、正式版の規約にてご案内します。</p>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}

