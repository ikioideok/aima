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
  // 文字数指定は撤廃
  const [outline, setOutline] = useState<any | null>(null)
  const [loadingOutline, setLoadingOutline] = useState(false)
  const [loadingArticle, setLoadingArticle] = useState(false)
  const [editOutline, setEditOutline] = useState(false)
  // プロバイダ/モデルを「構成」と「本文」で分離
  const [providerOutline, setProviderOutline] = useState<'openai'|'gemini'>('gemini')
  const [modelOutline, setModelOutline] = useState<string>('gemini-2.5-pro')
  const [providerArticle, setProviderArticle] = useState<'openai'|'gemini'>('openai')
  const [modelArticle, setModelArticle] = useState<string>('gpt-5')

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
                {/* 構成用プロバイダ/モデル */}
                <div>
                  <label className="block text-sm mb-1">構成: プロバイダ</label>
                  <select className="w-full border rounded px-3 py-2 bg-input-background"
                          value={providerOutline}
                          onChange={(e)=>{
                            const p = e.target.value as 'openai'|'gemini'
                            setProviderOutline(p)
                            setModelOutline(p==='openai' ? 'gpt-5' : 'gemini-2.5-pro')
                          }}>
                    <option value="openai">GPT-5 (OpenAI)</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">構成: モデルID</label>
                  <input className="w-full border rounded px-3 py-2 bg-input-background" value={modelOutline}
                         onChange={(e)=>setModelOutline(e.target.value)} />
                </div>
                {/* 本文用プロバイダ/モデル */}
                <div>
                  <label className="block text-sm mb-1">本文: プロバイダ</label>
                  <select className="w-full border rounded px-3 py-2 bg-input-background"
                          value={providerArticle}
                          onChange={(e)=>{
                            const p = e.target.value as 'openai'|'gemini'
                            setProviderArticle(p)
                            setModelArticle(p==='openai' ? 'gpt-5' : 'gemini-2.5-pro')
                          }}>
                    <option value="openai">GPT-5 (OpenAI)</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">本文: モデルID</label>
                  <input className="w-full border rounded px-3 py-2 bg-input-background" value={modelArticle}
                         onChange={(e)=>setModelArticle(e.target.value)} />
                </div>
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
              </div>
              <div className="flex gap-3">
                <button disabled={loadingOutline || !keyword} onClick={async ()=>{
                  try {
                    if (!CMS_BASE) throw new Error('VITE_CMS_API_BASE が未設定です')
                    if (!ADMIN_TOKEN) throw new Error('VITE_ADMIN_TOKEN が未設定です')
                    setLoadingOutline(true)
                    setLog('構成案を生成中...')
                    const res = await fetch(CMS_BASE + '/generate-outline', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
                      body: JSON.stringify({ provider: providerOutline, model: modelOutline, keyword, category: aiCategory, tone, target_audience: audience })
                    })
                    const data = await res.json().catch(()=>null)
                    if (!res.ok) throw new Error((data?.error || '生成に失敗しました') + (data?.detail ? ` (${data.detail})` : ''))
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
                    if (!CMS_BASE) throw new Error('VITE_CMS_API_BASE が未設定です')
                    if (!ADMIN_TOKEN) throw new Error('VITE_ADMIN_TOKEN が未設定です')
                    setLoadingArticle(true)
                    setLog('記事を生成中...')
                    const res = await fetch(CMS_BASE + '/generate-article', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
                      body: JSON.stringify({ provider: providerArticle, model: modelArticle, outline, category: aiCategory })
                    })
                    const data = await res.json().catch(()=>null)
                    if (!res.ok) throw new Error((data?.error || '生成に失敗しました') + (data?.detail ? ` (${data.detail})` : ''))
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

              {/* 構成案プレビューは右カラムへ移動 */}
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{editOutline ? '構成案エディタ' : '構成案プレビュー'}</h2>
              {outline && (
                <button className="text-sm underline" onClick={()=>setEditOutline(e=>!e)}>
                  {editOutline ? 'プレビューに切替' : '編集する'}
                </button>
              )}
            </div>
            {outline ? (
              editOutline ? (
                <div className="p-4 mb-6 border rounded text-sm bg-card space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs mb-1">タイトル</label>
                      <input className="w-full border rounded px-3 py-2 bg-input-background" value={outline.title||''}
                             onChange={(e)=> setOutline((o:any)=> ({...o, title: e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">スラッグ</label>
                      <input className="w-full border rounded px-3 py-2 bg-input-background" value={outline.slug||''}
                             onChange={(e)=> setOutline((o:any)=> ({...o, slug: e.target.value}))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs mb-1">トーン</label>
                        <input className="w-full border rounded px-3 py-2 bg-input-background" value={outline.tone||''}
                               onChange={(e)=> setOutline((o:any)=> ({...o, tone: e.target.value}))} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">想定読者</label>
                        <input className="w-full border rounded px-3 py-2 bg-input-background" value={outline.target_audience||''}
                               onChange={(e)=> setOutline((o:any)=> ({...o, target_audience: e.target.value}))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">SEOキーワード（カンマ区切り）</label>
                      <input className="w-full border rounded px-3 py-2 bg-input-background"
                             value={(outline.seo?.keywords||[]).join(', ')}
                             onChange={(e)=> setOutline((o:any)=> ({...o, seo: { ...(o?.seo||{}), keywords: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) }}))} />
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">見出し構成（H2/H3）</div>
                      <button className="text-xs px-2 py-1 border rounded" onClick={()=> setOutline((o:any)=> ({...o, h2: [...(o?.h2||[]), { title: '新しいセクション', h3: [] }]}))}>H2を追加</button>
                    </div>
                    <div className="space-y-3">
                      {(outline.h2||[]).map((sec:any, idx:number)=> (
                        <div key={idx} className="p-2 border rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <input className="flex-1 border rounded px-2 py-1 bg-input-background" value={sec.title||''}
                                   onChange={(e)=> setOutline((o:any)=> { const h2=[...(o?.h2||[])]; h2[idx] = { ...h2[idx], title: e.target.value }; return { ...o, h2 } })} />
                            <button className="text-xs px-2 py-1 border rounded" onClick={()=> setOutline((o:any)=> { const h2=[...(o?.h2||[])]; h2.splice(idx,1); return { ...o, h2 } })}>H2削除</button>
                          </div>
                          <div className="ml-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs text-muted-foreground">H3（小見出し）</div>
                              <button className="text-xs px-2 py-1 border rounded" onClick={()=> setOutline((o:any)=> { const h2=[...(o?.h2||[])]; const list=[...(h2[idx]?.h3||[])]; list.push('新しいポイント'); h2[idx] = { ...h2[idx], h3: list }; return { ...o, h2 } })}>H3追加</button>
                            </div>
                            <div className="space-y-1">
                              {(sec.h3||[]).map((t:string, j:number)=> (
                                <div key={j} className="flex items-center gap-2">
                                  <input className="flex-1 border rounded px-2 py-1 bg-input-background" value={t}
                                         onChange={(e)=> setOutline((o:any)=> { const h2=[...(o?.h2||[])]; const list=[...(h2[idx]?.h3||[])]; list[j] = e.target.value; h2[idx] = { ...h2[idx], h3: list }; return { ...o, h2 } })} />
                                  <button className="text-xs px-2 py-1 border rounded" onClick={()=> setOutline((o:any)=> { const h2=[...(o?.h2||[])]; const list=[...(h2[idx]?.h3||[])]; list.splice(j,1); h2[idx] = { ...h2[idx], h3: list }; return { ...o, h2 } })}>削除</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 mb-6 border rounded text-sm bg-card">
                  <div className="mb-2"><span className="font-semibold">候補タイトル:</span> {outline.title}</div>
                  <div className="mb-2"><span className="font-semibold">スラッグ:</span> {outline.slug}</div>
                  <div className="mb-2"><span className="font-semibold">トーン/読者:</span> {outline.tone} / {outline.target_audience}</div>
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
              )
            ) : (
              <div className="p-4 mb-6 border rounded text-sm text-muted-foreground">構成案を生成するとここに表示されます。</div>
            )}

            <h2 className="text-xl font-semibold mb-2">生成されるJSON</h2>
            <pre className="p-4 bg-muted rounded overflow-auto text-sm" style={{maxHeight:'32rem'}}>{json}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
