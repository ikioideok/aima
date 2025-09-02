import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">利用規約</h1>
        <div className="prose max-w-none leading-relaxed space-y-6">
          <p>
            この利用規約（以下「本規約」といいます。）は、AI Marketing News（以下「当サイト」といいます。）が提供するコンテンツおよびサービスの利用条件を定めるものです。利用者（以下「ユーザー」といいます。）は、本規約に同意した上で当サイトをご利用ください。
          </p>

          <section>
            <h2 className="text-2xl font-bold">第1条（適用）</h2>
            <ul>
              <li>本規約は、ユーザーと当サイトとの間の一切の関係に適用されます。</li>
              <li>当サイトは、本規約のほか、ご利用に関して個別に定めるルール等を追加する場合があります。その場合、これらは本規約の一部を構成するものとします。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第2条（利用条件）</h2>
            <ul>
              <li>ユーザーは、自己の責任において当サイトを利用するものとします。</li>
              <li>未成年者が利用する場合、保護者の同意を得た上で利用してください。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第3条（禁止事項）</h2>
            <p>ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。</p>
            <ul>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為またはそれに関連する行為</li>
              <li>他のユーザー、第三者、または当サイトの権利を侵害する行為</li>
              <li>当サイトの運営を妨害する行為（不正アクセス、サーバーへの過度な負荷など）</li>
              <li>虚偽の情報を提供する行為</li>
              <li>無断での商業利用や転載・複製行為</li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第4条（著作権・知的財産権）</h2>
            <ul>
              <li>当サイトに掲載される文章、画像、動画、ロゴ、その他コンテンツの著作権・知的財産権は、当サイトまたは正当な権利を有する第三者に帰属します。</li>
              <li>ユーザーは、当サイトのコンテンツを、私的利用の範囲を超えて無断で使用することはできません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第5条（免責事項）</h2>
            <ul>
              <li>当サイトのコンテンツは正確性・最新性に努めていますが、その内容について保証するものではありません。</li>
              <li>当サイトの利用により生じた損害について、当サイトは一切責任を負いません。</li>
              <li>当サイトは、予告なくコンテンツの変更・中断・終了を行う場合があります。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第6条（外部サービスの利用）</h2>
            <p>
              当サイトでは、Google アナリティクス等の外部サービスを利用する場合があります。これにより収集された情報は各サービス提供者のプライバシーポリシーに基づいて管理されます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第7条（サービスの変更・停止・終了）</h2>
            <p>
              当サイトは、ユーザーへの事前通知なく、サービス内容の変更または提供の停止・終了を行うことができます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第8条（規約の変更）</h2>
            <p>
              当サイトは、必要に応じて本規約を改定することができます。変更後の規約は、当サイトに掲載した時点から効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第9条（準拠法・管轄裁判所）</h2>
            <p>
              本規約の解釈および適用は、日本法に準拠するものとします。 また、本規約に関して紛争が生じた場合は、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">第10条（お問い合わせ窓口）</h2>
            <p>本規約に関するお問い合わせは、以下よりお願いいたします。</p>
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
