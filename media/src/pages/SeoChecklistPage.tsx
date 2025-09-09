import React from 'react'
import { SimpleHeader } from '../components/SimpleHeader'
import { SimpleFooter } from '../components/SimpleFooter'

export default function SeoChecklistPage() {
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [ok, setOk] = React.useState(false)
  const valid = /^\S+@\S+\.\S+$/.test(email)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    // 簡易ゲート: 送信後にDLリンクを表示（外部フォーム未設定のため）
    setOk(true)
  }

  const fileUrl = '/media/resources/seo-checklist.pdf'

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">SEO内部対策30項目チェックリスト</h1>
        <p className="text-muted-foreground mb-6">実務で使えるシンプルなチェックリスト。まずは基本の抜け漏れ防止に。</p>

        {!ok ? (
          <div className="p-6 rounded-lg border bg-card/50">
            <h2 className="text-xl font-semibold mb-3">ダウンロード</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">お名前（任意）</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm mb-1">メールアドレス</label>
                <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground" placeholder="you@example.com" />
                {!valid && email && <p className="text-xs text-destructive mt-1">メールアドレスを確認してください。</p>}
              </div>
              <button type="submit" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition">同意してダウンロードへ</button>
              <p className="text-xs text-muted-foreground">送信によりプライバシーポリシーに同意したものとみなします。登録は不要、すぐにDLリンクが表示されます。</p>
            </form>
          </div>
        ) : (
          <div className="p-6 rounded-lg border bg-card/50">
            <h2 className="text-xl font-semibold mb-2">ダウンロードリンク</h2>
            <a href={fileUrl} className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition" download>
              PDFをダウンロード
            </a>
            <p className="text-xs text-muted-foreground mt-2">届いていない場合はファイルを直接保存してください。</p>
          </div>
        )}
      </main>
      <SimpleFooter />
    </div>
  )
}

