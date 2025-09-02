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
          <h2 className="text-xl font-semibold mb-3">配布中のテンプレート（例）</h2>
          <ul className="list-disc ml-6 text-sm space-y-2">
            <li>記事ブリーフ雛形（検索意図・構成・CTA・E-E-A-T項目）</li>
            <li>編集チェックリスト（事実確認・引用・内部リンク・構造化）</li>
            <li>LLMプロンプト集（ブリーフ生成・見出し案・要約・校正）</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">※ダウンロード方法はお問い合わせにてご案内します。</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">資料請求・ダウンロードのご相談</h2>
          <p className="text-sm text-muted-foreground mb-4">
            ご希望のテンプレート名・用途をご記載のうえ、お問い合わせください。最適なセットでご案内します。
          </p>
          <a
            className="inline-block px-4 py-2 rounded bg-red-accent text-red-accent-foreground hover:bg-red-accent/90"
            href="https://ai-and-marketing.jp/#contact"
            rel="noopener noreferrer"
          >
            お問い合わせへ
          </a>
        </section>
      </main>
      <SimpleFooter />
    </div>
  )
}

