import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function AdsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">広告掲載について</h1>
        <div className="prose max-w-none leading-relaxed space-y-6">
          <p>
            AI and Marketing（以下「当サイト」）では、当サイトの読者層・コンテンツに適した広告の掲載を受け付けております。広告主様の商品・サービスを広く効果的に訴求するため、以下の要領にてご案内いたします。
          </p>

          <section>
            <h2 className="text-2xl font-bold">掲載メディアについて</h2>
            <p>
              当サイト「AI and Marketing Media」は、AI・マーケティング・ビジネスに関心を持つ経営者・マーケター・ビジネスパーソンを対象とした専門情報サイトです。
            </p>
            <ul>
              <li>主な読者層：企業のマーケティング担当者、経営者、個人事業主、AI活用を検討するビジネス層</li>
              <li>月間PV数・UU数などの詳細はお問い合わせください</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">掲載可能な広告形態</h2>
            <h3 className="text-xl font-semibold">バナー広告</h3>
            <p>サイト内の記事一覧ページや記事詳細ページのサイドバー・フッターなどに表示します。</p>
            <h3 className="text-xl font-semibold">タイアップ記事広告</h3>
            <p>広告主様のサービスや商品を、記事形式で紹介する広告です。SEO・SNS拡散を考慮したライティングが可能です。</p>
            <h3 className="text-xl font-semibold">メールマガジン広告</h3>
            <p>当サイト読者向けのニュースレター内に広告を掲載します。</p>
            <h3 className="text-xl font-semibold">その他カスタムプラン</h3>
            <p>ウェビナー共催、資料ダウンロード企画、リード獲得施策など、ご要望に応じた施策もご相談いただけます。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">広告掲載の基準</h2>
            <p>以下に該当する広告はお受けできません。</p>
            <ul>
              <li>公序良俗に反する内容</li>
              <li>法律に違反する商品・サービス</li>
              <li>読者に誤解を与える恐れのある表現</li>
              <li>当サイトの運営方針にそぐわないと判断される内容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">広告掲載までの流れ</h2>
            <ol>
              <li>お問い合わせフォームよりご連絡</li>
              <li>担当者より掲載枠・料金・スケジュールのご案内</li>
              <li>掲載内容の確認・契約締結</li>
              <li>広告素材のご入稿</li>
              <li>掲載開始</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <p>広告掲載に関するお問い合わせは、以下よりお願いいたします。</p>
            <p>
              運営者：株式会社AIMA<br />
              お問い合わせフォーム：<a href="https://ai-and-marketing.jp/#contact" className="underline">https://ai-and-marketing.jp/#contact</a>
            </p>
          </section>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}
