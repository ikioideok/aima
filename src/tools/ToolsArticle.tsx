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

type IntentLabel = 'Do' | 'Know' | 'Buy' | 'Go'

type SerpAnalysis = {
  intent_label: IntentLabel
  intent_summary: string
  persona: string
  article_direction: string
  user_needs: string[]
  solution: string
  notes?: string
}

type GenerateArticlePayload = {
  provider: 'gemini' | 'openai'
  model: string
  outline: Outline
  analysis?: SerpAnalysis
}

type JsonBody = Record<string, unknown>

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
  const [analysis, setAnalysis] = React.useState<SerpAnalysis|null>(null)
  const [analysisLoading, setAnalysisLoading] = React.useState(false)

  // Sakura 直下の /api を優先して呼ぶため、管理トークン前提のブロックは外す
  const canCall = true

  async function callCms(path: string, body: JsonBody) {
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

  async function callPhp(path: string, body: JsonBody) {
    // Absolute root /api so it works from both / and /media/
    const url = `/api${path}.php`
    // WAFに弾かれにくい x-www-form-urlencoded で送信
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(body)) {
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

  const selectedSources = React.useMemo(() => sources.filter((s) => selected[s.url]), [sources, selected])

  const sanitizeAnalysis = React.useCallback((data: any): SerpAnalysis => {
    const allowed: IntentLabel[] = ['Do', 'Know', 'Buy', 'Go']
    const clamp = (value: any, max: number) => {
      const str = typeof value === 'string' ? value.trim() : ''
      if (!str) return ''
      return str.length > max ? str.slice(0, max) : str
    }
    const intentLabelRaw = typeof data?.intent_label === 'string' ? data.intent_label.trim() : ''
    const intent_label = (allowed.includes(intentLabelRaw as IntentLabel) ? intentLabelRaw : 'Know') as IntentLabel
    const needs = Array.isArray(data?.user_needs)
      ? data.user_needs.map((item: any) => clamp(item, 120)).filter(Boolean)
      : []
    const keywordText = keyword.trim()
    const defaultPersona = keywordText ? `${keywordText}に関心のある人` : 'このテーマに関心のある人'
    const defaultNeed = keywordText ? `${keywordText}の基本や活用方法を知りたい` : 'テーマの基本を理解したい'
    const defaultSolution = keywordText
      ? `${keywordText}に関する主要な疑問へ体系的に答えるコンテンツを用意する`
      : '主要な疑問に順番に答える構成にする'
    const defaultDirection = '検索ユーザーの疑問を序盤から順番に解消する構成にする'
    return {
      intent_label,
      intent_summary: clamp(data?.intent_summary, 200),
      persona: clamp(data?.persona, 120) || defaultPersona,
      article_direction: clamp(data?.article_direction, 200) || defaultDirection,
      user_needs: needs.length ? needs : [defaultNeed],
      solution: clamp(data?.solution, 220) || defaultSolution,
      notes: clamp(data?.notes, 220) || undefined,
    }
  }, [keyword])

  const runSerpAnalysis = React.useCallback(async (force = false) => {
    if (!canCall) return
    if (!keyword.trim()) return
    if (!selectedSources.length) return
    if (analysis && !force) return
    setAnalysisLoading(true)
    try {
      const payload = { provider, model: modelId, keyword, sources: selectedSources }
      let res: any = null
      try {
        res = await callPhp('/analyze-serp', payload)
      } catch (err) {
        res = await callCms('/analyze-serp', payload)
      }
      if (!res?.ok || !res?.analysis) throw new Error('AI分析の取得に失敗しました')
      setAnalysis(sanitizeAnalysis(res.analysis))
    } catch (e: any) {
      setError(e?.message || 'AI分析の生成に失敗しました')
    } finally {
      setAnalysisLoading(false)
    }
  }, [analysis, canCall, callCms, callPhp, keyword, modelId, provider, sanitizeAnalysis, selectedSources, setError])

  React.useEffect(() => {
    if (!sources.length) return
    if (!selectedSources.length) return
    if (analysis || analysisLoading) return
    if (!keyword.trim()) return
    runSerpAnalysis(false)
  }, [analysis, analysisLoading, keyword, runSerpAnalysis, selectedSources, sources.length])

  const sanitizeOutline = React.useCallback(
    (data: Outline): Outline => {
      const slugify = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '') || 'article'

      const title = (data.title || '').trim()
      const persona = typeof data.persona === 'string' ? data.persona.trim() : ''
      const targetAudience = typeof data.target_audience === 'string' ? data.target_audience.trim() : ''
      const tone = typeof data.tone === 'string' ? data.tone.trim() : ''
      const wcNumber = Number(data.word_count_target)
      const wordCount = Number.isFinite(wcNumber) && wcNumber > 0 ? Math.round(wcNumber) : undefined
      const cleanH2 = (data.h2 || []).reduce<Outline['h2']>((acc, section) => {
        const h2Title = (section.title || '').trim()
        if (!h2Title) return acc
        const h3List = (section.h3 || []).map((h) => h.trim()).filter(Boolean)
        acc.push({ title: h2Title, h3: h3List })
        return acc
      }, [])

      return {
        ...data,
        title: title || data.title || 'アウトライン',
        slug: (data.slug || slugify(title || data.slug || data.title || 'article')) as string,
        keyword: data.keyword || keyword,
        persona,
        target_audience: targetAudience,
        tone,
        word_count_target: wordCount,
        h2: cleanH2,
      }
    },
    [keyword]
  )

  const handleOutlineTitleChange = React.useCallback((value: string) => {
    setOutline(prev => prev ? { ...prev, title: value } : prev)
  }, [])

  const handleOutlineMetaChange = React.useCallback((key: 'persona' | 'target_audience' | 'tone', value: string) => {
    setOutline(prev => {
      if (!prev) return prev
      return { ...prev, [key]: value } as Outline
    })
  }, [])

  const handleOutlineWordCountChange = React.useCallback((value: string) => {
    setOutline(prev => {
      if (!prev) return prev
      const num = parseInt(value, 10)
      const next = Number.isFinite(num) && num > 0 ? num : undefined
      return { ...prev, word_count_target: next }
    })
  }, [])

  const handleH2TitleChange = React.useCallback((index: number, value: string) => {
    setOutline(prev => {
      if (!prev) return prev
      const next = [...prev.h2]
      next[index] = { ...next[index], title: value }
      return { ...prev, h2: next }
    })
  }, [])

  const handleH3Change = React.useCallback((index: number, value: string) => {
    const lines = value.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
    setOutline(prev => {
      if (!prev) return prev
      const next = [...prev.h2]
      next[index] = { ...next[index], h3: lines }
      return { ...prev, h2: next }
    })
  }, [])

  const addH2Block = React.useCallback(() => {
    setOutline(prev => {
      if (!prev) return prev
      return { ...prev, h2: [...prev.h2, { title: '', h3: [] }] }
    })
  }, [])

  const removeH2Block = React.useCallback((index: number) => {
    setOutline(prev => {
      if (!prev) return prev
      const next = prev.h2.filter((_, i) => i !== index)
      return { ...prev, h2: next }
    })
  }, [])

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
        setAnalysis(null)
      } catch (e:any) {
        setError(e?.message || '検索に失敗しました')
      } finally { setLoading(false) }
      return
    }
    // ステップ2: 選択済みサイトを使って構成案生成
    setLoading(true)
    try {
      const chosen = sources.filter(s => selected[s.url])
      const analysisPayload = analysis
        ? {
            intent_label: analysis.intent_label,
            intent_summary: analysis.intent_summary.trim(),
            persona: analysis.persona.trim(),
            article_direction: analysis.article_direction.trim(),
            user_needs: analysis.user_needs.map((item) => item.trim()).filter(Boolean),
            solution: analysis.solution.trim(),
            ...(analysis.notes ? { notes: analysis.notes.trim() } : {}),
          }
        : null
      const payload = { provider, model: modelId, keyword, sources: chosen, ...(analysisPayload ? { analysis: analysisPayload } : {}) }
      let res: any = null
      try { res = await callPhp('/generate-outline', payload) } catch { res = await callCms('/generate-outline', payload) }
      if (!res?.ok || !res?.outline) throw new Error('Invalid response')
      const result = res.outline as Outline
      const normalized: Outline = {
        ...result,
        h2: Array.isArray(result.h2)
          ? result.h2.map(section => ({
              title: section.title || '',
              h3: Array.isArray(section.h3) ? section.h3 : [],
            }))
          : [],
      }
      setOutline(sanitizeOutline(normalized))
    } catch (e:any) {
      setError(e?.message || 'アウトライン生成に失敗しました')
    } finally { setLoading(false) }
  }

  async function onGenerateArticle() {
    if (!outline) {
      setError('先にアウトラインを作成してください')
      return
    }
    const sanitizedOutline = sanitizeOutline(outline)
    if (!sanitizedOutline.h2 || sanitizedOutline.h2.length === 0) {
      setError('アウトラインに見出しがありません')
      return
    }
    setOutline(sanitizedOutline)
    setError(''); setLoading(true); setArticleHtml('')
    try {
      const sanitizedAnalysis = analysis ? sanitizeAnalysis(analysis) : null
      const payload: GenerateArticlePayload = sanitizedAnalysis
        ? { provider, model: modelId, outline: sanitizedOutline, analysis: sanitizedAnalysis }
        : { provider, model: modelId, outline: sanitizedOutline }
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
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">AI記事生成（シンプル）</h1>
        {!canCall && (
          <div className="mb-4 p-3 border rounded text-sm text-destructive">
            管理トークン（VITE_ADMIN_TOKEN）が未設定のためAPIに接続できません。
          </div>
        )}
        <div className="space-y-6">
            <div className="grid gap-3 p-4 border rounded bg-card">
              <label className="grid gap-1">
                <span className="text-sm">モデル</span>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                  <select
                  className="border rounded px-2 py-1 w-full sm:w-48 sm:max-w-xs"
                  value={modelProvider}
                  onChange={(e)=>{
                    const v = e.target.value as 'openai'|'gemini'
                    setModelProvider(v)
                    const id = v==='gemini' ? 'gemini-2.5-pro' : 'gpt-5'
                    setModelId(id)
                    try { window.localStorage.setItem('aima-tools-model-provider', v); window.localStorage.setItem('aima-tools-model-id', id) } catch {}
                  }}
                >
                  <option value="openai">GPT-5（OpenAI）</option>
                  <option value="gemini">Gemini 2.5 Pro（Google）</option>
                </select>
                <input
                  className="border rounded px-2 py-1 w-full sm:flex-1 min-w-0"
                  value={modelId}
                  onChange={(e)=>{ setModelId(e.target.value); try { window.localStorage.setItem('aima-tools-model-id', e.target.value) } catch {} }}
                />
              </div>
            </label>
            <label className="grid gap-1">
              <span className="text-sm">タイトル/キーワード</span>
              <input className="border rounded px-2 py-2 w-full" value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="例：SEO内部対策チェックリスト" />
            </label>

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              <button
                disabled={loading || !keyword.trim() || !canCall}
                onClick={onGenerateOutline}
                className="w-full px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
              >
                アウトライン作成
              </button>
            </div>
          </div>

          {/* 手動入力モード */}
          {manualMode && !outline && (
            <div className="p-4 border rounded bg-card">
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
                  setAnalysis(null)
                  setManualMode(false)
                } catch (e:any) {
                  setError(e?.message || '抽出に失敗しました')
                } finally { setLoading(false) }
              }}>見出しを取得</button>
                <button className="px-3 py-1 border rounded" onClick={()=>{ setManualMode(false); }}>キャンセル</button>
              </div>
            </div>
          )}

          {error && <div className="p-3 border rounded text-sm text-destructive">{error}</div>}

          {!!sources.length && !outline && (
            <div className="p-4 border rounded bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">検索結果（参考にするサイトを選択）</div>
                <div className="text-xs text-muted-foreground">{sources.length}件</div>
              </div>
              <div className="grid gap-3">
                {sources.map((s, i) => (
                  <div key={s.url} className="border rounded p-3 bg-background">
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={!!selected[s.url]} onChange={(e)=> setSelected(prev=>({...prev, [s.url]: e.target.checked}))} />
                      <div className="min-w-0 w-full">
                        <div className="text-sm font-medium truncate">{i+1}. {s.title || s.url}</div>
                        <a className="text-xs text-blue-700 break-all" href={s.url} target="_blank" rel="noreferrer">{s.url}</a>
                        <div className="mt-2 grid gap-2 text-xs">
                          <div>
                            <div className="font-semibold">H2</div>
                            <ul className="list-disc pl-4 max-h-32 overflow-y-auto pr-1">{(s.headings?.h2||[]).slice(0,8).map((h,idx)=>(<li key={idx}>{h}</li>))}</ul>
                          </div>
                          <div>
                            <div className="font-semibold">H3</div>
                            <ul className="list-disc pl-4 max-h-32 overflow-y-auto pr-1">{(s.headings?.h3||[]).slice(0,6).map((h,idx)=>(<li key={idx}>{h}</li>))}</ul>
                          </div>
                          <div>
                            <div className="font-semibold">H4</div>
                            <ul className="list-disc pl-4 max-h-32 overflow-y-auto pr-1">{(s.headings?.h4||[]).slice(0,4).map((h,idx)=>(<li key={idx}>{h}</li>))}</ul>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                  <button disabled={loading||!canCall} onClick={()=>{ setSources([]); setSelected({}); setOutline(null); setAnalysis(null); }} className="px-3 py-1 border rounded">検索をやり直す</button>
                  <button disabled={loading || !keyword.trim() || !canCall} onClick={onGenerateOutline} className="px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-50">選んだサイトを参考に構成案を作成</button>
                <button disabled={loading} onClick={()=> setManualMode(true)} className="px-3 py-1 border rounded">URLを手動入力</button>
              </div>
            </div>
          )}

          {(sources.length > 0 || analysis) && (
            <div className="p-4 border rounded bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-semibold">検索意図・ニーズ分析</div>
                  <p className="text-xs text-muted-foreground">検索結果をもとにAIが意図・ペルソナ・ニーズを整理します。必要に応じて編集してください。</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={analysisLoading || !selectedSources.length || loading}
                    onClick={()=>{ setAnalysis(null); runSerpAnalysis(true) }}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    {analysis ? 'AI分析を再生成' : 'AI分析を生成'}
                  </button>
                </div>
              </div>
              {analysisLoading && !analysis && (
                <div className="text-sm text-muted-foreground">AIが分析中です…</div>
              )}
              {analysis && (
                <div className="grid gap-3">
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">検索意図</label>
                    <div className="grid gap-2 sm:grid-cols-[140px,1fr] sm:items-center">
                      <select
                        className="border rounded px-2 py-1"
                        value={analysis.intent_label}
                        onChange={(e)=>{
                          const value = e.target.value as IntentLabel
                          setAnalysis(prev => prev ? { ...prev, intent_label: value } : prev)
                        }}
                      >
                        <option value="Know">Know（情報収集）</option>
                        <option value="Do">Do（課題解決・実行）</option>
                        <option value="Buy">Buy（比較・購入検討）</option>
                        <option value="Go">Go（場所・サービス指名）</option>
                      </select>
                      <textarea
                        className="border rounded px-2 py-1 w-full h-16 resize-y"
                        value={analysis.intent_summary}
                        onChange={(e)=> setAnalysis(prev => prev ? { ...prev, intent_summary: e.target.value } : prev)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">想定ペルソナ</label>
                    <input
                      className="border rounded px-2 py-1"
                      value={analysis.persona}
                      onChange={(e)=> setAnalysis(prev => prev ? { ...prev, persona: e.target.value } : prev)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">どのような方向性の記事にするか</label>
                    <textarea
                      className="border rounded px-2 py-1 h-20 resize-y"
                      value={analysis.article_direction}
                      onChange={(e)=> setAnalysis(prev => prev ? { ...prev, article_direction: e.target.value } : prev)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">ユーザーの抱えているニーズ（1行につき1つ）</label>
                    <textarea
                      className="border rounded px-2 py-1 h-24 resize-y"
                      value={analysis.user_needs.join('\n')}
                      onChange={(e)=>{
                        const lines = e.target.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
                        setAnalysis(prev => prev ? { ...prev, user_needs: lines } : prev)
                      }}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">ニーズを解決するには</label>
                    <textarea
                      className="border rounded px-2 py-1 h-20 resize-y"
                      value={analysis.solution}
                      onChange={(e)=> setAnalysis(prev => prev ? { ...prev, solution: e.target.value } : prev)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">メモ（任意）</label>
                    <textarea
                      className="border rounded px-2 py-1 h-16 resize-y"
                      value={analysis.notes ?? ''}
                      placeholder="補足したいポイントや注意書きがあれば入力"
                      onChange={(e)=> setAnalysis(prev => prev ? { ...prev, notes: e.target.value } : prev)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {outline && (
            <div className="p-4 border rounded bg-card space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">アウトラインタイトル</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={outline.title || ''}
                  onChange={(e)=> handleOutlineTitleChange(e.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">ペルソナ</span>
                  <input
                    className="border rounded px-2 py-1"
                    value={outline.persona || ''}
                    onChange={(e)=> handleOutlineMetaChange('persona', e.target.value)}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">想定読者</span>
                  <input
                    className="border rounded px-2 py-1"
                    value={outline.target_audience || ''}
                    onChange={(e)=> handleOutlineMetaChange('target_audience', e.target.value)}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">トーン</span>
                  <input
                    className="border rounded px-2 py-1"
                    value={outline.tone || ''}
                    onChange={(e)=> handleOutlineMetaChange('tone', e.target.value)}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">目標文字数</span>
                  <input
                    type="number"
                    min={0}
                    className="border rounded px-2 py-1"
                    value={outline.word_count_target ?? ''}
                    onChange={(e)=> handleOutlineWordCountChange(e.target.value)}
                    placeholder="例：1800"
                  />
                </label>
              </div>
              <div className="space-y-3">
                {outline.h2.map((section, index) => (
                  <div key={index} className="border rounded bg-background p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>H2 #{index + 1}</span>
                      <button type="button" className="text-xs text-red-500" onClick={()=> removeH2Block(index)}>削除</button>
                    </div>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={section.title || ''}
                      onChange={(e)=> handleH2TitleChange(index, e.target.value)}
                    />
                    <label className="block text-xs text-muted-foreground">H3（各行1件）</label>
                    <textarea
                      className="border rounded px-2 py-1 w-full h-32 resize-y"
                      value={(section.h3 || []).join('\n')}
                      onChange={(e)=> handleH3Change(index, e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" className="px-3 py-1 border rounded" onClick={addH2Block}>H2を追加</button>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={loading || !(outline.h2 && outline.h2.length > 0)}
                  onClick={onGenerateArticle}
                  className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
                >
                  本文を作成
                </button>
              </div>
            </div>
          )}

          {articleHtml && (
            <div className="p-4 border rounded bg-card">
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
        </div>
      </main>
    </div>
  )
}
