import React from 'react'

function useCMSBase() {
  const raw = import.meta.env.VITE_CMS_API_BASE || ''
  if (!raw) return '/cms-api'
  try {
    const u = new URL(raw)
    return u.origin + (u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname)
  } catch {
    return raw
  }
}

type Outline = {
  title: string
  slug: string
  persona?: string
  target_audience?: string
  tone?: string
  word_count_target?: number
  seo?: { keywords?: string[]; meta_description?: string; cta?: string }
  h2: { title: string; h3?: string[] }[]
  keyword?: string
}

type SourceHeadings = { h1?: string[]; h2?: string[]; h3?: string[]; h4?: string[] }
type SourceResult = { url: string; title: string; headings: SourceHeadings }

export default function ToolsArticle() {
  const CMS_BASE = useCMSBase()
  const ADMIN_TOKEN = (import.meta as any).env?.VITE_ADMIN_TOKEN || ''
  // 初期表示は常に Gemini を既定にする（保存値は無視して起動）
  const [modelProvider, setModelProvider] = React.useState<'openai'|'gemini'>('gemini')
  const [modelId, setModelId] = React.useState<string>('gemini-2.5-pro')
  const [keyword, setKeyword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string>('')
  const [outline, setOutline] = React.useState<Outline|null>(null)
  const [articleHtml, setArticleHtml] = React.useState<string>('')
  const [articleTitle, setArticleTitle] = React.useState<string>('')
  const [articleExcerpt, setArticleExcerpt] = React.useState<string>('')
  // 新フロー: 検索→参照サイト選択→構成案
  const [sources, setSources] = React.useState<SourceResult[]>([])
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [manualUrls, setManualUrls] = React.useState<string>('')
  const [manualMode, setManualMode] = React.useState<boolean>(false)

  // Sakura 直下の /api を優先して呼ぶため、管理トークン前提のブロックは外す
  const canCall = true

  async function callCms(path: string, body: any) {
    const url = CMS_BASE + path
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ADMIN_TOKEN ? { 'X-Admin-Token': ADMIN_TOKEN } : {}),
      },
      body: JSON.stringify(body),
    })
    const text = await r.text().catch(()=>'')
    if (!r.ok) throw new Error(text || `HTTP ${r.status}`)
    try { return JSON.parse(text) } catch { return null }
  }

  async function callPhp(path: string, body: any) {
    // Absolute root /api so it works from both / and /media/
    const url = `/api${path}.php`
    // WAFに弾かれにくい x-www-form-urlencoded で送信
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(body || {})) {
      if (v && typeof v === 'object') {
        params.append(k, JSON.stringify(v))
      } else if (v !== undefined && v !== null) {
        params.append(k, String(v))
      }
    }
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const text = await r.text().catch(()=>'')
    if (!r.ok) throw new Error(text || `HTTP ${r.status}`)
    try { return JSON.parse(text) } catch { return null }
  }

  const provider = modelProvider === 'gemini' ? 'gemini' : 'openai'

  async function onGenerateOutline() {
    setError(''); setArticleHtml(''); setOutline(null)
    // ステップ1: 参照サイト未取得なら検索して一覧表示
    if (!sources.length) {
      setLoading(true)
      try {
        let res: any = null
        // Try GET first (WAFに弾かれにくい)
        try {
          const r = await fetch(`/api/search-top.php?keyword=${encodeURIComponent(keyword)}`)
          const txt = await r.text().catch(()=> '')
          try { res = JSON.parse(txt) } catch { res = null }
        } catch { /* ignore */ }
        // Fallback: POST (urlencoded)
        if (!res?.results || !Array.isArray(res.results) || res.results.length === 0) {
          try {
            res = await callPhp('/search-top', { keyword })
          } catch {
            res = await callCms('/search-top', { keyword })
          }
        }
        const list: SourceResult[] = res?.results || []
        if (!Array.isArray(list) || list.length === 0) throw new Error('検索結果が取得できませんでした')
        setSources(list)
        const initSel: Record<string, boolean> = {}
        for (const it of list) initSel[it.url] = true
        setSelected(initSel)
      } catch (e:any) {
        setError(e?.message || '検索に失敗しました')
      } finally { setLoading(false) }
      return
    }
    // ステップ2: 選択済みサイトを使って構成案生成
    setLoading(true)
    try {
      const chosen = sources.filter(s => selected[s.url])
      const payload = { provider, model: modelId, keyword, sources: chosen }
      let res: any = null
      try { res = await callPhp('/generate-outline', payload) } catch { res = await callCms('/generate-outline', payload) }
      if (!res?.ok || !res?.outline) throw new Error('Invalid response')
      setOutline(res.outline as Outline)
    } catch (e:any) {
      setError(e?.message || 'アウトライン生成に失敗しました')
    } finally { setLoading(false) }
  }

  async function onGenerateArticle() {
    if (!outline) return
    setError(''); setLoading(true); setArticleHtml('')
    try {
      const payload = {
        provider,
        model: modelId,
        outline,
      }
      let res: any = null
      try {
        res = await callPhp('/generate-article', payload)
      } catch {
        res = await callCms('/generate-article', payload)
      }
      if (!res?.ok || !res?.article) throw new Error('Invalid response')
      setArticleTitle(res.article.title)
      setArticleExcerpt(res.article.excerpt || '')
      setArticleHtml(res.article.body || '')
    } catch (e:any) {
      setError(e?.message || '本文生成に失敗しました')
    } finally { setLoading(false) }
  }

  function download(name: string, data: string, type: string) {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">AI記事生成（シンプル）</h1>
        {!canCall && (
          <div className="mb-4 p-3 border rounded text-sm text-destructive">
            管理トークン（VITE_ADMIN_TOKEN）が未設定のためAPIに接続できません。
          </div>
        )}
        <div className="grid gap-3 mb-6">
          <label className="grid gap-1">
            <span className="text-sm">モデル</span>
            <div className="flex gap-2">
              <select className="border rounded px-2 py-1" value={modelProvider} onChange={(e)=>{
                const v = e.target.value as 'openai'|'gemini'
                setModelProvider(v)
                const id = v==='gemini' ? 'gemini-2.5-pro' : 'gpt-5'
                setModelId(id)
                try { window.localStorage.setItem('aima-tools-model-provider', v); window.localStorage.setItem('aima-tools-model-id', id) } catch {}
              }}>
                <option value="openai">GPT-5（OpenAI）</option>
                <option value="gemini">Gemini 2.5 Pro（Google）</option>
              </select>
              <input className="border rounded px-2 py-1 flex-1" value={modelId} onChange={(e)=>{ setModelId(e.target.value); try { window.localStorage.setItem('aima-tools-model-id', e.target.value) } catch {} }} />
            </div>
          </label>
          <label className="grid gap-1">
            <span className="text-sm">タイトル/キーワード</span>
            <input className="border rounded px-2 py-2" value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="例：SEO内部対策チェックリスト" />
          </label>
          
          <div className="flex gap-2">
            <button disabled={loading||!keyword||!canCall} onClick={onGenerateOutline} className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">アウトライン作成</button>
            <button disabled={loading||!outline||!canCall} onClick={onGenerateArticle} className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">本文生成</button>
          </div>
        </div>

        {/* 参照サイト一覧（ステップ1） */}
        {/* 手動入力モード */}
        {manualMode && !outline && (
          <div className="mb-6 p-4 border rounded bg-card">
            <div className="font-semibold mb-2">参照サイトを手動で入力</div>
            <textarea className="w-full border rounded p-2 h-28" placeholder="1行に1URLを入力 (最大10件)" value={manualUrls} onChange={(e)=>setManualUrls(e.target.value)} />
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={async()=>{
                setError(''); setLoading(true)
                try {
                  const urls = manualUrls.split(/\n+/).map(s=>s.trim()).filter(Boolean).slice(0,10)
                  const out: SourceResult[] = []
                  for (const u of urls) {
                    try {
                      // GET first
                      let r = await fetch(`/api/extract-headings.php?url=${encodeURIComponent(u)}`)
                      let txt = await r.text().catch(()=> '')
                      let js:any = null; try { js = JSON.parse(txt) } catch { js = null }
                      if (!js?.result) {
                        // fallback to server CMS if available
                        const r2 = await fetch(`/cms-api/extract-headings?url=${encodeURIComponent(u)}`)
                        const js2 = await r2.json().catch(()=>null)
                        js = js2
                      }
                      if (js?.result) out.push(js.result as SourceResult)
                    } catch {}
                  }
                  if (!out.length) throw new Error('見出しの抽出に失敗しました')
                  setSources(out)
                  const initSel: Record<string, boolean> = {}
                  for (const it of out) initSel[it.url] = true
                  setSelected(initSel)
                  setManualMode(false)
                } catch (e:any) {
                  setError(e?.message || '抽出に失敗しました')
                } finally { setLoading(false) }
              }}>見出しを取得</button>
              <button className="px-3 py-1 border rounded" onClick={()=>{ setManualMode(false); }}>キャンセル</button>
            </div>
          </div>
        )}

        {!!sources.length && !outline && (
          <div className="mb-6 p-4 border rounded bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">検索結果（参考にするサイトを選択）</div>
              <div className="text-xs text-muted-foreground">{sources.length}件</div>
            </div>
            <ul className="space-y-3">
              {sources.map((s, i) => (
                <li key={s.url} className="border rounded p-3 bg-background">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={!!selected[s.url]} onChange={(e)=> setSelected(prev=>({...prev, [s.url]: e.target.checked}))} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{i+1}. {s.title || s.url}</div>
                      <a className="text-xs text-blue-700 break-all" href={s.url} target="_blank" rel="noreferrer">{s.url}</a>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="font-semibold">H2</div>
                          <ul className="list-disc pl-4">{(s.headings?.h2||[]).slice(0,8).map((h,idx)=>(<li key={idx}>{h}</li>))}</ul>
                        </div>
                        <div>
                          <div className="font-semibold">H3</div>
                          <ul className="list-disc pl-4">{(s.headings?.h3||[]).slice(0,6).map((h,idx)=>(<li key={idx}>{h}</li>))}</ul>
                        </div>
                        <div>
                          <div className="font-semibold">H4</div>
                          <ul className="list-disc pl-4">{(s.headings?.h4||[]).slice(0,4).map((h,idx)=>(<li key={idx}>{h}</li>))}</ul>
                        </div>
                      </div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button disabled={loading||!canCall} onClick={()=>{ setSources([]); setSelected({}); setOutline(null); }} className="px-3 py-1 border rounded">検索をやり直す</button>
              <button disabled={loading||!keyword||!canCall} onClick={onGenerateOutline} className="px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-50">選んだサイトを参考に構成案を作成</button>
              <button disabled={loading} onClick={()=> setManualMode(true)} className="px-3 py-1 border rounded">URLを手動入力</button>
            </div>
          </div>
        )}

        {error && <div className="mb-4 p-3 border rounded text-sm text-destructive">{error}</div>}

        {outline && (
          <div className="mb-6 p-4 border rounded bg-card">
            <div className="font-semibold mb-2">アウトライン</div>
            <div className="text-sm text-muted-foreground mb-2">{outline.title}</div>
            <ul className="list-disc pl-5 text-sm">
              {outline.h2.map((s,i)=> (
                <li key={i} className="mb-1">
                  <span className="font-medium">{s.title}</span>
                  {s.h3 && s.h3.length>0 && (
                    <ul className="list-[circle] pl-5">
                      {s.h3.map((h,idx)=>(<li key={idx}>{h}</li>))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {articleHtml && (
          <div className="mb-4 p-4 border rounded bg-card">
            <div className="font-semibold mb-1">出力</div>
            <div className="text-lg font-bold mb-1">{articleTitle}</div>
            {articleExcerpt && <p className="text-sm text-muted-foreground mb-2">{articleExcerpt}</p>}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: articleHtml }} />
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={()=>download(`${outline?.slug||'article'}.html`, articleHtml, 'text/html')}>HTML保存</button>
              <button className="px-3 py-1 border rounded" onClick={()=>{
                const md = `# ${articleTitle}\n\n${articleExcerpt ? articleExcerpt+'\n\n' : ''}` +
                  articleHtml
                    .replace(/<h2>/g, '\n\n## ').replace(/<\/h2>/g, '\n\n')
                    .replace(/<h3>/g, '\n\n### ').replace(/<\/h3>/g, '\n\n')
                    .replace(/<p>/g, '').replace(/<\/p>/g, '\n\n')
                    .replace(/<ul>/g, '\n').replace(/<\/ul>/g, '\n')
                    .replace(/<li>/g, '- ').replace(/<\/li>/g, '\n')
                    .replace(/<[^>]+>/g, '')
                download(`${outline?.slug||'article'}.md`, md, 'text/markdown')
              }}>Markdown保存</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
