import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
        <div className="prose max-w-none leading-relaxed space-y-6">
          <p>
            AI Marketing News（以下、「当サイト」といいます）は、利用者の個人情報を適切に取り扱うことを重要な責務と考え、以下のとおりプライバシーポリシーを定めます。
          </p>

          <section>
            <h2 className="text-2xl font-bold">第1条（個人情報の定義）</h2>
            <p>
              「個人情報」とは、氏名、住所、電話番号、メールアドレスなど特定の個人を識別できる情報を指します。また、Cookie、アクセスログ、IPアドレス等の個人関連情報も含まれる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第2条（収集する情報と利用目的）</h2>
            <h3 className="text-xl font-semibold">収集する情報</h3>
            <ul>
              <li>お問い合わせフォームやメールマガジン登録時に入力された情報（例：氏名、メールアドレス）</li>
              <li>サイト利用時に自動的に収集される情報（Cookie、IPアドレス、閲覧履歴、利用端末の種類等）</li>
            </ul>
            <h3 className="text-xl font-semibold">利用目的</h3>
            <ul>
              <li>お問い合わせ対応およびご連絡</li>
              <li>ニュースレターや情報提供のため</li>
              <li>サイト利用状況の分析によるコンテンツ改善</li>
              <li>サービス品質向上および新サービスの企画・開発</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第3条（Googleアナリティクスの利用について）</h2>
            <p>
              当サイトでは、アクセス解析のために Google アナリティクス を利用しています。Google アナリティクスは Cookie を使用して利用者のアクセス情報を収集します。収集される情報は匿名であり、個人を特定するものではありません。
            </p>
            <p>
              詳細は <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" className="underline">Google アナリティクス利用規約</a> および <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer" className="underline">Google プライバシーポリシー</a> をご確認ください。 また、利用者は <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noopener noreferrer" className="underline">Google アナリティクス オプトアウト アドオン</a> により、情報収集を停止することができます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第4条（個人情報の管理と海外サーバー利用）</h2>
            <p>
              当サイトのデータは、Render社が提供する海外サーバー上に保存・管理されています。そのため、利用者の個人情報は国外（アメリカ等）に転送・保管される可能性があります。
            </p>
            <p>
              当サイトは、利用者の個人情報が適切に保護されるよう、技術的・組織的な安全管理措置を講じます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第5条（第三者提供について）</h2>
            <p>当サイトは、次の場合を除き、個人情報を第三者へ提供することはありません。</p>
            <ul>
              <li>利用者本人の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>サービス運営上、業務委託が必要な場合（この場合は適切な管理・監督を行います）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第6条（個人情報の開示・訂正・削除）</h2>
            <p>
              利用者が自己の個人情報について、開示・訂正・利用停止・削除を希望する場合には、当サイト所定の方法によりご連絡ください。本人確認のうえ、合理的な範囲で速やかに対応いたします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第7条（外部リンクについて）</h2>
            <p>
              当サイトには外部サイトへのリンクが含まれる場合があります。リンク先のサイトにおける個人情報の取り扱いについて、当サイトは責任を負いません。各サイトのプライバシーポリシーをご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第8条（プライバシーポリシーの変更）</h2>
            <p>
              本ポリシーは、必要に応じて改定することがあります。変更内容は当サイト上で公表し、掲載時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第9条（お問い合わせ窓口）</h2>
            <p>
              本ポリシーに関するお問い合わせは、以下の窓口よりお願いいたします。
            </p>
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
