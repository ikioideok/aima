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

export default function ToolsArticle() {
  const CMS_BASE = useCMSBase()
  const ADMIN_TOKEN = (import.meta as any).env?.VITE_ADMIN_TOKEN || ''
  // 初期表示は常に Gemini を既定にする（保存値は無視して起動）
  const [modelProvider, setModelProvider] = React.useState<'openai'|'gemini'>('gemini')
  const [modelId, setModelId] = React.useState<string>('gemini-2.5-pro')
  const [keyword, setKeyword] = React.useState('')
  const [audience, setAudience] = React.useState('マーケ担当者')
  const [tone, setTone] = React.useState<'ですます'|'常体'>('ですます')
  const [wordTarget, setWordTarget] = React.useState<number>(1800)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string>('')
  const [outline, setOutline] = React.useState<Outline|null>(null)
  const [articleHtml, setArticleHtml] = React.useState<string>('')
  const [articleTitle, setArticleTitle] = React.useState<string>('')
  const [articleExcerpt, setArticleExcerpt] = React.useState<string>('')

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
    setError(''); setLoading(true); setOutline(null); setArticleHtml('');
    try {
      // Prefer PHP API on Sakura; fallback to cms-api if configured
      const payload = {
        provider,
        model: modelId,
        keyword,
        tone: tone === 'ですます' ? 'です・ます調で、実務的に明快' : '常体で、実務的に明快',
        target_audience: audience,
        word_count_target: Number(wordTarget)||1800,
      }
      let res: any = null
      try {
        res = await callPhp('/generate-outline', payload)
      } catch {
        res = await callCms('/generate-outline', payload)
      }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">想定読者</span>
              <input className="border rounded px-2 py-2" value={audience} onChange={(e)=>setAudience(e.target.value)} />
            </label>
          </div>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-1">
              <input type="radio" name="tone" checked={tone==='ですます'} onChange={()=>setTone('ですます')} /> です・ます
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="tone" checked={tone==='常体'} onChange={()=>setTone('常体')} /> 常体
            </label>
            <label className="flex items-center gap-1">
              <span className="text-sm">目標文字数</span>
              <input type="number" className="border rounded px-2 py-1 w-28" value={wordTarget} onChange={(e)=>setWordTarget(Number(e.target.value)||1800)} />
            </label>
          </div>
          <div className="flex gap-2">
            <button disabled={loading||!keyword||!canCall} onClick={onGenerateOutline} className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">アウトライン生成</button>
            <button disabled={loading||!outline||!canCall} onClick={onGenerateArticle} className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">本文生成</button>
          </div>
        </div>

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
