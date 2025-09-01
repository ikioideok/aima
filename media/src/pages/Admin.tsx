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

  // AI Assist states
  const [keyword, setKeyword] = useState<string>('')
  const [aiCategory, setAiCategory] = useState<string>('SEO')
  const [tone, setTone] = useState<string>('実務的で明快')
  const [audience, setAudience] = useState<string>('マーケ担当者・事業責任者')
  const [words, setWords] = useState<number>(1800)
  const [outline, setOutline] = useState<any | null>(null)
  const [loadingOutline, setLoadingOutline] = useState(false)
  const [loadingArticle, setLoadingArticle] = useState(false)

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
            {/* AI Assist */}
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-3">AIアシスト：構成案 → 記事作成</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">キーワード</label>
                  <input className="w-full border rounded px-3 py-2 bg-input-background" value={keyword}
                         onChange={(e)=>setKeyword(e.target.value)} placeholder="例: E-E-A-T 対策" />
                </div>
                <div>
                  <label className="block text-sm mb-1">カテゴリ</label>
                  <input className="w-full border rounded px-3 py-2 bg-input-background" value={aiCategory}
                         onChange={(e)=>setAiCategory(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">トーン</label>
                  <input className="w-full border rounded px-3 py-2 bg-input-background" value={tone}
                         onChange={(e)=>setTone(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">想定読者</label>
                  <input className="w-full border rounded px-3 py-2 bg-input-background" value={audience}
                         onChange={(e)=>setAudience(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">目標文字数</label>
                  <input type="number" className="w-full border rounded px-3 py-2 bg-input-background" value={words}
                         onChange={(e)=>setWords(Number(e.target.value)||0)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button disabled={loadingOutline || !keyword} onClick={async ()=>{
                  try {
                    setLoadingOutline(true)
                    setLog('構成案を生成中...')
                    const res = await fetch(CMS_BASE + '/generate-outline', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
                      body: JSON.stringify({ keyword, category: aiCategory, tone, target_audience: audience, word_count_target: words })
                    })
                    const data = await res.json().catch(()=>null)
                    if (!res.ok) throw new Error(data?.error || '生成に失敗しました')
                    setOutline(data.outline)
                    setLog('構成案を生成しました。内容を確認してください。')
                  } catch(e:any) {
                    setLog('失敗: ' + e.message)
                  } finally {
                    setLoadingOutline(false)
                  }
                }}
                className="px-3 py-2 rounded bg-muted text-foreground disabled:opacity-50">
                  {loadingOutline ? '生成中...' : '構成案を生成'}
                </button>
                <button disabled={loadingArticle || !outline} onClick={async ()=>{
                  try {
                    setLoadingArticle(true)
                    setLog('記事を生成中...')
                    const res = await fetch(CMS_BASE + '/generate-article', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
                      body: JSON.stringify({ outline, category: aiCategory })
                    })
                    const data = await res.json().catch(()=>null)
                    if (!res.ok) throw new Error(data?.error || '生成に失敗しました')
                    setArticle((a)=>({
                      ...a,
                      ...data.article,
                      // keep selected target category for saving UI if any
                    }))
                    setLog('記事を生成しました。必要に応じて編集し、保存してください。')
                  } catch(e:any) {
                    setLog('失敗: ' + e.message)
                  } finally {
                    setLoadingArticle(false)
                  }
                }}
                className="px-3 py-2 rounded bg-red-accent text-red-accent-foreground disabled:opacity-50">
                  {loadingArticle ? '生成中...' : 'この構成で記事を作成'}
                </button>
              </div>

              {outline && (
                <div className="mt-4 text-sm">
                  <div className="mb-2"><span className="font-semibold">候補タイトル:</span> {outline.title}</div>
                  <div className="mb-2"><span className="font-semibold">スラッグ:</span> {outline.slug}</div>
                  <div className="mb-2"><span className="font-semibold">トーン/読者/文字数:</span> {outline.tone} / {outline.target_audience} / 約{outline.word_count_target}文字</div>
                  <div className="mb-2"><span className="font-semibold">SEOキーワード:</span> {(outline.seo?.keywords||[]).join(', ')}</div>
                  <div>
                    <div className="font-semibold mb-1">見出し構成</div>
                    <ul className="list-disc ml-5">
                      {outline.h2?.map((s:any, idx:number)=> (
                        <li key={idx} className="mb-1">
                          <span className="font-medium">{s.title}</span>
                          {Array.isArray(s.h3) && s.h3.length>0 && (
                            <ul className="list-[circle] ml-5 mt-1">
                              {s.h3.map((t:string, i:number)=> <li key={i}>{t}</li>)}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

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
