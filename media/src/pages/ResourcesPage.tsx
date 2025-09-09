import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">無料テンプレート・資料</h1>
          <p className="text-muted-foreground">実務ですぐ使える雛形・チェックリスト・プロンプト集</p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">配布中のテンプレート</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/media/resources/seo-checklist/" className="block p-4 border rounded-lg hover:bg-accent/30 transition">
              <div className="font-semibold">SEO内部対策30項目チェック</div>
              <p className="text-sm text-muted-foreground m-0">基本の抜け漏れを防ぐ実務チェックリスト（PDF）</p>
            </a>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">資料請求・ダウンロードのご相談</h2>
          <p className="text-sm text-muted-foreground mb-4">
            ご希望のテンプレート名・用途をご記載のうえ、お問い合わせください。最適なセットでご案内します。
          </p>
          <a className="inline-block px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90" href="/media/consult/">無料相談へ</a>
        </section>
      </main>
      <SimpleFooter />
    </div>
  )
}
