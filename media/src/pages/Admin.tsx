import React, { useMemo, useState } from 'react'

type Article = {
  slug: string
  title: string
  excerpt: string
  author: string
  publishDate: string
  readTime: string
  category: string
  imageUrl: string
  body?: string
}

const initial: Article = {
  slug: '',
  title: '',
  excerpt: '',
  author: '',
  publishDate: new Date().toISOString().slice(0, 10),
  readTime: '8分',
  category: 'SEO',
  imageUrl: '',
  body: ''
}

const CMS_BASE = import.meta.env.VITE_CMS_API_BASE || ''
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || ''

export default function Admin() {
  const [article, setArticle] = useState<Article>(initial)
  const [target, setTarget] = useState<'featured' | 'recent' | 'special'>('recent')
  const [log, setLog] = useState<string>('')

  const json = useMemo(() => JSON.stringify({ ...article, featured: target === 'featured' }, null, 2), [article, target])

  function onChange<K extends keyof Article>(k: K, v: Article[K]) {
    setArticle((a) => ({ ...a, [k]: v }))
  }

  async function submit() {
    setLog('送信中...')
    try {
      if (!CMS_BASE) throw new Error('VITE_CMS_API_BASE が未設定です')
      const endpoint = target === 'featured' ? '/set-featured' : `/add-to/${target}`
      const res = await fetch(CMS_BASE + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify(article)
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'エラーが発生しました')
      setLog('保存に成功しました。mainへコミット済み → 自動ビルドが走ります。')
    } catch (e: any) {
      setLog('失敗: ' + e.message)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">記事管理（簡易）</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">記事タイプ</label>
              <div className="flex gap-4 text-sm">
                {['featured','recent','special'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="target" value={t}
                      checked={target===t}
                      onChange={() => setTarget(t as any)} />
                    {t==='featured'?'注目（置換）':t==='recent'?'最新（追加）':'特集（追加）'}
                  </label>
                ))}
              </div>
            </div>
            {([
              ['slug','スラッグ'],
              ['title','タイトル'],
              ['excerpt','要約'],
              ['author','著者'],
              ['publishDate','公開日(YYYY-MM-DD)'],
              ['readTime','読了時間(例: 8分)'],
              ['category','カテゴリ'],
              ['imageUrl','画像URL']
            ] as [keyof Article,string][]).map(([k, label]) => (
              <div key={k}>
                <label className="block text-sm mb-1">{label}</label>
                <input className="w-full border rounded px-3 py-2 bg-input-background" value={(article[k] as string) || ''}
                  onChange={(e) => onChange(k, e.target.value as any)} />
              </div>
            ))}
            <div>
              <label className="block text-sm mb-1">本文（HTML）</label>
              <textarea className="w-full h-48 border rounded px-3 py-2 bg-input-background"
                value={article.body || ''}
                onChange={(e) => onChange('body', e.target.value)} />
            </div>
            <button onClick={submit} className="px-4 py-2 rounded bg-red-accent text-red-accent-foreground">保存する</button>
            <div className="text-sm text-muted-foreground">{log}</div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">生成されるJSON</h2>
            <pre className="p-4 bg-muted rounded overflow-auto text-sm" style={{maxHeight:'32rem'}}>{json}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

