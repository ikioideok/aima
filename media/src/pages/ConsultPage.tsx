import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'
import consult from '../data/consult.json'

export default function ConsultPage() {
  const addr = (consult as any)?.mailto?.address || ''
  const subject = encodeURIComponent((consult as any)?.mailto?.subject || '無料相談のご依頼')
  const body = encodeURIComponent(((consult as any)?.mailto?.bodyTemplate || 'お名前：\nご相談内容：\n希望日時：\n') )
  const scheduler = (consult as any)?.schedulerUrl || ''

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">無料相談</h1>
        <p className="text-muted-foreground mb-6">コンテンツ/SEO/生成AI活用について、30分の壁打ち・現状診断を行います。お気軽にご連絡ください。</p>

        {scheduler ? (
          <div className="rounded-lg border overflow-hidden">
            <iframe src={scheduler} title="予約フォーム" className="w-full" style={{ minHeight: 720 }} />
          </div>
        ) : (
          <div className="p-6 rounded-lg border bg-card/50">
            <h2 className="text-xl font-semibold mb-2">お問い合わせ</h2>
            <p className="text-sm text-muted-foreground mb-4">下記よりメールでご連絡ください。希望日時やご相談内容の簡単なメモがあるとスムーズです。</p>
            {addr ? (
              <a className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition" href={`mailto:${addr}?subject=${subject}&body=${body}`}>
                メールで相談する
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">メールアドレスが未設定です。設定ファイル（src/data/consult.json）に宛先を追加してください。</p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">個人情報はプライバシーポリシーに基づき適切に取り扱います。</p>
      </main>
      <SimpleFooter />
    </div>
  )
}

