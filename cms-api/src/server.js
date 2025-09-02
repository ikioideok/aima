import express from 'express'
import cors from 'cors'
import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'

dotenv.config()

const {
  GITHUB_TOKEN,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
  GITHUB_BRANCH = 'main',
  ADMIN_TOKEN,
  OPENAI_API_KEY,
  OPENAI_MODEL = 'gpt-5',
  OPENAI_API_BASE = 'https://api.openai.com/v1',
  GEMINI_API_KEY,
  GEMINI_MODEL = 'gemini-2.5-pro',
  GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta',
} = process.env

if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
  console.error('Missing required env vars: GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME')
  process.exit(1)
}

const octokit = new Octokit({ auth: GITHUB_TOKEN })
const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) return res.status(500).json({ error: 'ADMIN_TOKEN is not set on server' })
  const token = req.header('X-Admin-Token')
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

async function getFile(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path,
      ref: GITHUB_BRANCH,
    })
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    return { sha: data.sha, content }
  } catch (e) {
    if (e.status === 404) return { sha: null, content: null }
    throw e
  }
}

async function putFile(path, content, sha, message) {
  const encoded = Buffer.from(content, 'utf-8').toString('base64')
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path,
    message,
    content: encoded,
    branch: GITHUB_BRANCH,
    sha: sha || undefined,
  })
}

// Put a file whose content is already base64-encoded (binary safe)
async function putFileBase64(path, base64Content, sha, message) {
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path,
    message,
    content: base64Content,
    branch: GITHUB_BRANCH,
    sha: sha || undefined,
  })
}

// Get only sha (binary-safe)
async function getFileShaOnly(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path,
      ref: GITHUB_BRANCH,
    })
    return data.sha
  } catch (e) {
    if (e.status === 404) return null
    throw e
  }
}

function sanitizeFilename(name) {
  const base = String(name || '').split('\\').pop().split('/').pop()
  const parts = base.split('.')
  let ext = parts.length > 1 ? parts.pop() : ''
  let stem = parts.join('.')
  stem = stem.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-_.]+/g, '-').replace(/^-+|-+$/g, '') || 'upload'
  ext = (ext || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return { stem, ext }
}

function extFromContentType(ct) {
  const map = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }
  return map[String(ct || '').toLowerCase()] || ''
}

function bytesFromBase64Len(len) {
  // approximate bytes from base64 length
  return Math.floor(len * 3 / 4)
}

// Upload image (base64 or data URL), store under public/media/uploads/YYYY/MM/
app.post('/upload-image-base64', requireAdmin, async (req, res) => {
  try {
    const { filename = 'upload', contentType = '', dataBase64 = '' } = req.body || {}
    if (!dataBase64) return res.status(400).json({ error: 'dataBase64 is required' })
    // strip data URL prefix if present
    const m = String(dataBase64).match(/^data:([^;]+);base64,(.*)$/)
    const ct = (m ? m[1] : contentType) || ''
    const b64 = m ? m[2] : String(dataBase64)
    const allowed = ['image/png','image/jpeg','image/jpg','image/webp','image/gif']
    if (!allowed.includes(ct.toLowerCase())) return res.status(400).json({ error: 'unsupported contentType' })
    const maxBytes = 5 * 1024 * 1024 // 5MB
    if (bytesFromBase64Len(b64.length) > maxBytes) return res.status(413).json({ error: 'file too large (max 5MB)' })

    const { stem, ext: extFromName } = sanitizeFilename(filename)
    const ext = extFromName || extFromContentType(ct) || 'png'
    const now = new Date()
    const yyyy = String(now.getFullYear())
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const rand = Math.random().toString(36).slice(2, 8)
    const outName = `${stem}-${now.getTime()}-${rand}.${ext}`
    const rel = `media/uploads/${yyyy}/${mm}/${outName}`
    const path = `public/${rel}`
    const sha = await getFileShaOnly(path)
    await putFileBase64(path, b64, sha, `chore(cms): upload image ${rel}`)
    const url = `/${rel}`
    res.json({ ok: true, url })
  } catch (e) {
    console.error('upload-image-base64 error:', e?.message || e)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

function validateArticle(a) {
  const required = ['slug', 'title', 'excerpt', 'author', 'publishDate', 'readTime', 'category', 'imageUrl']
  for (const k of required) {
    if (!a?.[k]) return `${k} is required`
  }
  return null
}

app.get('/health', (req, res) => res.json({ ok: true }))

// --- LLM helpers ---
function ensureOpenAI(res) {
  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    return false
  }
  return true
}

function ensureGemini(res) {
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not set on server' })
    return false
  }
  return true
}

async function openaiChatJSON({ system, user, schema, temperature = 0.7, max_tokens = 2048, model }) {
  const url = `${OPENAI_API_BASE}/chat/completions`

  async function call(body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const text = await r.text().catch(() => '')
    if (!r.ok) {
      const msg = `OpenAI error ${r.status}: ${text}`
      const err = new Error(msg)
      // @ts-ignore
      err.status = r.status
      // @ts-ignore
      err.body = text
      throw err
    }
    // parse json from text (already fetched)
    let data
    try { data = JSON.parse(text) } catch { data = null }
    let content = data?.choices?.[0]?.message?.content || '{}'
    // Tolerate code fences or stray text around JSON
    const stripFences = (s) => s.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim()
    const tryParse = (s) => { try { return JSON.parse(s) } catch { return null } }
    let parsed = tryParse(content)
    if (!parsed) {
      parsed = tryParse(stripFences(content))
    }
    if (!parsed) {
      // naive extraction of first JSON object
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      if (start !== -1 && end !== -1 && end > start) {
        parsed = tryParse(content.slice(start, end + 1))
      }
    }
    if (!parsed) {
      throw new Error('Model did not return valid JSON content')
    }
    return parsed
  }

  const modelId = model || OPENAI_MODEL
  const isGpt5 = /gpt-5/i.test(modelId || '')
  const base = {
    model: modelId,
    messages: [
      system ? { role: 'system', content: system } : null,
      { role: 'user', content: user },
    ].filter(Boolean),
    // gpt-5: temperature はデフォルト(1)以外未サポート → 送信しない
    ...(isGpt5 ? {} : { temperature }),
  }

  const preferMaxCompletion = isGpt5

  function buildBody(useSchema, useMaxCompletion) {
    const tokenField = useMaxCompletion
      ? { max_completion_tokens: max_tokens }
      : { max_tokens }
    const rf = schema && useSchema
      ? { type: 'json_schema', json_schema: { name: 'response', schema, strict: true } }
      : { type: 'json_object' }
    return { ...base, ...tokenField, response_format: rf }
  }

  // Try schema + preferred token param first, then fallbacks
  try {
    return await call(buildBody(true, preferMaxCompletion))
  } catch (e) {
    const msg = String(e?.message || '')
    // Fallback for unsupported token field
    if (msg.includes('max_tokens')) {
      try { return await call(buildBody(true, true)) } catch (_) {}
    }
    if (msg.includes('max_completion_tokens')) {
      try { return await call(buildBody(true, false)) } catch (_) {}
    }
    // Fallback for response_format/json_schema issues
    if (msg.includes('response_format') || msg.includes('json_schema') || e?.status === 400) {
      try {
        return await call(buildBody(false, preferMaxCompletion))
      } catch (e2) {
        const msg2 = String(e2?.message || '')
        if (msg2.includes('max_tokens')) {
          return await call(buildBody(false, true))
        }
        if (msg2.includes('max_completion_tokens')) {
          return await call(buildBody(false, false))
        }
        throw e2
      }
    }
    throw e
  }
}

async function geminiChatJSON({ system, user, schema, temperature = 1, max_tokens = 2048, model }) {
  const modelId = model || GEMINI_MODEL
  const url = `${GEMINI_API_BASE}/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`
  const body = {
    contents: [
      { role: 'user', parts: [{ text: String(user || '') }] }
    ],
    ...(system ? { systemInstruction: { role: 'system', parts: [{ text: String(system) }] } } : {}),
    generationConfig: {
      // JSON-only response enforcement
      responseMimeType: 'application/json',
      // Do not send responseSchema because Gemini Schema differs from JSON Schema
      // and causes 400 for common JSON Schema features (e.g., additionalProperties)
      maxOutputTokens: max_tokens,
      temperature,
    }
  }
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const raw = await r.text().catch(() => '')
  if (!r.ok) {
    throw new Error(`Gemini error ${r.status}: ${raw}`)
  }
  let data
  try { data = JSON.parse(raw) } catch { data = null }
  const candidates = data?.candidates || []
  const parts = candidates?.[0]?.content?.parts || []
  const texts = parts.map((p) => p?.text).filter(Boolean)
  const contentText = texts.join('\n').trim()
  const stripFences = (s) => s.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim()
  const tryParse = (s) => { try { return JSON.parse(s) } catch { return null } }
  let parsed = tryParse(contentText) || tryParse(stripFences(contentText))
  if (!parsed) {
    const start = contentText.indexOf('{')
    const end = contentText.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) parsed = tryParse(contentText.slice(start, end + 1))
  }
  if (!parsed) {
    const reason = data?.promptFeedback?.blockReason || candidates?.[0]?.finishReason || 'unknown'
    throw new Error(`Model did not return valid JSON content (reason: ${reason})`)
  }
  return parsed
}

async function llmChatJSON({ provider = 'openai', ...opts }) {
  if (provider === 'gemini') {
    return await geminiChatJSON(opts)
  }
  return await openaiChatJSON(opts)
}

// Shared helpers
// slugify is defined above (shared helpers)

function normalizeOutlineData(input, { keyword, category, tone, target_audience, word_count_target }) {
  const title = String(input?.title || keyword || '').slice(0, 160) || `${keyword}のガイド`
  const slug = slugify(input?.slug || title)
  const persona = input?.persona || 'マーケター'
  const seo = input?.seo && typeof input.seo === 'object' ? input.seo : {}
  const ta = input?.target_audience || target_audience
  const tn = input?.tone || tone
  const wc = Number(input?.word_count_target || word_count_target)

  let rawSections = input?.h2
  if (!Array.isArray(rawSections) || rawSections.length === 0) {
    rawSections = input?.sections || input?.headings || input?.outline || []
  }
  let h2 = []
  if (Array.isArray(rawSections)) {
    h2 = rawSections.map((s) => {
      if (!s) return null
      if (typeof s === 'string') return { title: s, h3: [] }
      if (typeof s === 'object') {
        const t = s.title || s.heading || s.name || ''
        let h3 = []
        const rawH3 = s.h3 || s.children || s.subheadings || []
        if (Array.isArray(rawH3)) {
          h3 = rawH3.map((x) => (typeof x === 'string' ? x : (x?.title || x?.heading || ''))).filter(Boolean)
        }
        return t ? { title: t, h3 } : null
      }
      return null
    }).filter(Boolean)
  }

  if (!h2 || h2.length === 0) {
    h2 = [
      { title: 'イントロダクション', h3: [] },
      { title: `${keyword}の基礎`, h3: ['定義', '重要性', '適用領域'] },
      { title: `${keyword}の実務活用`, h3: ['手順', 'テンプレート', 'チェックリスト'] },
      { title: '成功事例とベストプラクティス', h3: [] },
      { title: '計測とKPI設定', h3: ['指標', 'レポート例'] },
      { title: 'よくある落とし穴と対策', h3: [] },
      { title: 'まとめ・次のアクション', h3: [] },
    ]
  }

  return {
    title,
    slug,
    persona,
    target_audience: ta,
    tone: tn,
    word_count_target: wc,
    seo,
    h2,
    category,
    keyword,
  }
}

// --- AI: Generate Outline ---
app.post('/generate-outline', requireAdmin, async (req, res) => {
  try {
    const { provider = 'gemini', model } = req.body || {}
    if (provider === 'gemini') { if (!ensureGemini(res)) return } else { if (!ensureOpenAI(res)) return }
    const {
      keyword,
      category = 'SEO',
      tone = '実務的で明快',
      target_audience = 'マーケ担当者・事業責任者',
      word_count_target = 1800,
    } = req.body || {}
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'keyword is required' })
    }

    const schema = {
      type: 'object',
      required: ['title', 'slug', 'persona', 'target_audience', 'tone', 'word_count_target', 'h2'],
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        slug: { type: 'string' },
        persona: { type: 'string' },
        target_audience: { type: 'string' },
        tone: { type: 'string' },
        word_count_target: { type: 'integer' },
        seo: {
          type: 'object',
          additionalProperties: false,
          properties: {
            keywords: { type: 'array', items: { type: 'string' } },
            meta_description: { type: 'string' },
            cta: { type: 'string' }
          }
        },
        h2: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title'],
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              h3: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    }

    const system = 'あなたは日本語のコンテンツストラテジストです。AIMAのマーケティング記事の構成を、MECEで実務的に作成します。冗長・重複は避け、見出しは検索意図を網羅し、具体的な価値提案を含めます。'
    const userOpenAI = `前提\n- キーワード: ${keyword}\n- カテゴリ: ${category}\n- トーン: ${tone}\n- 想定読者: ${target_audience}\n- 目標文字数: ${word_count_target}\n\n出力形式（JSONのみ）：\n{"title":string,"slug":string,"persona":string,"target_audience":string,"tone":string,"word_count_target":number,"seo":{"keywords":string[],"meta_description":string,"cta":string},"h2":[{"title":string,"h3":string[]}] }\n\n注意:\n- JSON以外のテキスト（説明、注釈、コードフェンスなど）は絶対に出力しないでください。`
    const userGemini = `前提\n- キーワード: ${keyword}\n- カテゴリ: ${category}\n- トーン: ${tone}\n- 想定読者: ${target_audience}\n- 目標文字数: ${word_count_target}\n\n出力形式（JSONのみ）：\n{"title":string,"slug":string,"persona":string,"target_audience":string,"tone":string,"word_count_target":number,"seo":{"keywords":string[],"meta_description":string,"cta":string},"h2":[{"title":string,"h3":string[]}] }\n注意:\n- 説明文やコードフェンスは禁止。JSON以外の出力は禁止。`
    const user = provider === 'gemini' ? userGemini : userOpenAI

    let json
    try {
      const firstMax = provider === 'gemini' ? 4096 : 4096
      json = await llmChatJSON({ provider, system, user, schema, temperature: 0.6, max_tokens: firstMax, model })
    } catch (e) {
      const msg = String(e?.message || '')
      if (provider === 'gemini' && (msg.includes('MAX_TOKENS') || msg.includes('valid JSON'))) {
        const compact = `前提\n- キーワード: ${keyword}\n- カテゴリ: ${category}\n\nJSONのみ返す（短く簡潔に）。キー: title, slug, h2[{title,h3(<=1)}]。h2は最大4個。各文字列は20文字以内。説明やフェンスは禁止。`
        try {
          json = await llmChatJSON({ provider, system, user: compact, schema: undefined, temperature: 1, max_tokens: 2048, model })
        } catch (e2) {
          const msg2 = String(e2?.message || '')
          if (msg2.includes('MAX_TOKENS') || msg2.includes('valid JSON')) {
            const ultra = `JSONのみ返す。キー: title, slug, h2[{title}]。h2は3個。各文字列は16文字以内。説明・余計な文字・フェンス禁止。キーワード:${keyword}`
            json = await llmChatJSON({ provider, system, user: ultra, schema: undefined, temperature: 1, max_tokens: 1024, model })
          } else {
            throw e2
          }
        }
      } else {
        throw e
      }
    }
    const outline = normalizeOutlineData(json, { keyword, category, tone, target_audience, word_count_target })
    res.json({ ok: true, outline })
  } catch (e) {
    console.error('generate-outline error:', e?.message || e)
    res.status(500).json({ error: 'Failed to generate outline', detail: String(e?.message || '') })
  }
})

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// --- AI: Generate Full Article from outline ---
app.post('/generate-article', requireAdmin, async (req, res) => {
  try {
    const { provider = 'gemini', model } = req.body || {}
    if (provider === 'gemini') { if (!ensureGemini(res)) return } else { if (!ensureOpenAI(res)) return }
    const { outline, author = 'AIMA編集部', imageUrl = '', category } = req.body || {}
    if (!outline?.title || !Array.isArray(outline?.h2)) {
      return res.status(400).json({ error: 'outline with title and h2[] is required' })
    }

    const publishDate = new Date().toISOString().slice(0, 10)
    const slug = slugify(outline.slug || outline.title)
    const targetWords = Number(outline.word_count_target || 1800)
    const readTimeMin = Math.max(3, Math.ceil(targetWords / 600))

    const schema = {
      type: 'object',
      required: ['title', 'excerpt', 'body'],
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        excerpt: { type: 'string' },
        body: { type: 'string' }
      }
    }

    const outlineText = outline.h2.map((sec, i) => {
      const h3 = (sec.h3 || []).map(s => `    - ${s}`).join('\n')
      return `${i + 1}. ${sec.title}${h3 ? `\n${h3}` : ''}`
    }).join('\n')

    const system = 'あなたは日本語のプロ編集者・ライターです。専門的で実務に役立つ記事を、検証可能な情報と具体例で執筆します。冗長・誇張を避け、段落中心で読みやすいHTML構造に整えます。'
    const exampleArticle = {
      title: 'B2BのSEOで成果を出すコンテンツ戦略ガイド',
      excerpt: 'B2B企業がパイプラインを伸ばすためのSEO/コンテンツ戦略。検索意図、トピッククラスター、E-E-A-T、計測まで実務視点で解説。',
      body: '<p>本稿では、B2Bで成果に直結するSEOの考え方と実装手順を解説します。まず全体像を掴み、次に実務で使える型へ落とし込みます。</p>\n<h2>検索意図の分解と優先順位付け</h2>\n<p>まず重要なのは、見込み顧客の文脈に沿って検索意図を分解することです。単語ではなく課題の表現として捉え、業界・職種・熟達度で粒度を合わせます。</p>\n<p>意図ごとに必要なコンテンツの役割は異なります。情報収集段階では用語の定義や判断基準、比較検討では差異化ポイントや導入条件が響きます。</p>\n<h3>意図分類の実務メモ</h3>\n<p>現場では、検索クエリの原文をそのままグルーピングするより、営業やCSの会話ログと突き合わせて課題表現に変換すると精度が上がります。</p>\n<ul><li>情報（課題理解）：定義、背景、判断軸</li><li>比較（解決策検討）：差異化、適用条件</li><li>取引（意思決定）：要件、導入プロセス</li></ul>\n<h2>まとめ・次のアクション</h2>\n<p>小さく検証し、勝ち筋の型をテンプレート化して横展開します。効果測定はリードの質と商談化率で確認します。</p>'
    }
    const user = `前提:\n- サイト: AIMA（AIマーケティング）\n- カテゴリ: ${category || outline.category || 'SEO'}\n- トーン: ${outline.tone || '実務的で明快'}\n- 想定読者: ${outline.target_audience || 'マーケ担当者'}\n- 目標文字数: 約${targetWords}文字\n- 見出し構成:\n${outlineText}\n\n出力要件:\n- JSONのみ返す（title, excerpt, body）。前後の説明やコードフェンスは不要。\n- bodyはHTMLで、<h2>/<h3>/<p>/<ul>/<li>のみ使用。<p>を主体に、各セクションは段落から始める。\n- 箇条書きは必要な場合のみ。各<h2>セクションで<ul>は最大1回、3〜5項目まで。連続した<ul>は禁止。\n- 各<h2>は少なくとも2つの<p>を含む。各<h3>も少なくとも1つの<p>を含む。\n- 導入で期待値を提示し、各見出しでは段落で解説→必要なら要点を<ul>で補足。最後はまとめの段落で締める。\n- 根拠のない断定や最新情報の言い切りは避ける。`

    let json = await llmChatJSON({ provider, system, user, schema, temperature: 0.7, max_tokens: 16384, model })

    // Normalize article fields (handle nesting/aliases)
    let candidate = json?.article || json?.data || json?.result || json
    let title = candidate?.title || outline.title
    let body = candidate?.body || candidate?.html || candidate?.content || ''
    let excerpt = candidate?.excerpt || ''

    // Retry once with stricter instruction and no schema if essential fields missing
    if (!title || !body) {
      const strictUser = `以下の見出し構成に基づき、JSONのみを返してください。\n- 返すキーは title, excerpt, body の3つのみ。\n- bodyは有効なHTML文字列で、<h2>/<h3>/<p>/<ul>/<li>のみ使用。\n- コードフェンスや追加の説明は禁止。\n\n見出し構成:\n${outlineText}`
      try {
        json = await llmChatJSON({ provider, system, user: strictUser, schema: undefined, temperature: 0.7, max_tokens: 16384, model })
        candidate = json?.article || json?.data || json?.result || json
        title = candidate?.title || title
        body = candidate?.body || candidate?.html || candidate?.content || body
        excerpt = candidate?.excerpt || excerpt
      } catch (e) {
        // fall through to error handling below
      }
    }
    if (!title || !body) {
      const keys = Object.keys(candidate || {})
      return res.status(502).json({ error: 'Invalid article response from model', detail: `Missing title/body. keys: ${keys.join(', ')}` })
    }

    const out = {
      slug,
      title,
      excerpt,
      author,
      publishDate,
      readTime: `${readTimeMin}分`,
      category: category || outline.category || 'SEO',
      imageUrl,
      body,
    }

    res.json({ ok: true, article: out })
  } catch (e) {
    console.error('generate-article error:', e?.message || e)
    res.status(500).json({ error: 'Failed to generate article', detail: String(e?.message || '') })
  }
})

// Set featured article (overwrite)
app.post('/set-featured', requireAdmin, async (req, res) => {
  try {
    const article = req.body
    const err = validateArticle(article)
    if (err) return res.status(400).json({ error: err })
    article.featured = true
    const path = 'media/src/data/featuredArticle.json'
    const { sha } = await getFile(path)
    const content = JSON.stringify(article, null, 2) + '\n'
    await putFile(path, content, sha, `chore(cms): set featured: ${article.slug}`)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to set featured' })
  }
})

// Add to a list (recent or special)
app.post('/add-to/:list', requireAdmin, async (req, res) => {
  try {
    const list = req.params.list
    if (!['recent', 'special'].includes(list)) return res.status(400).json({ error: 'list must be recent or special' })
    const article = req.body
    const err = validateArticle(article)
    if (err) return res.status(400).json({ error: err })
    const path = list === 'recent' ? 'media/src/data/recentArticles.json' : 'media/src/data/specialArticles.json'
    const { sha, content } = await getFile(path)
    const arr = content ? JSON.parse(content) : []
    const exists = arr.some((a) => a.slug === article.slug)
    if (exists) return res.status(409).json({ error: 'Article with same slug already exists' })
    arr.unshift(article)
    const out = JSON.stringify(arr, null, 2) + '\n'
    await putFile(path, out, sha, `chore(cms): add ${article.slug} to ${list}`)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to add article' })
  }
})

// --- Simple Keyword Planner ---
// Generate related keywords and basic attributes via LLM (no real volume API)
app.post('/keyword-planner', requireAdmin, async (req, res) => {
  try {
    const { provider = 'gemini', model } = req.body || {}
    if (provider === 'gemini') { if (!ensureGemini(res)) return } else { if (!ensureOpenAI(res)) return }
    const { seed, language = 'ja', count = 20, theme = '', keywords_only = false } = req.body || {}
    if (!seed || typeof seed !== 'string') return res.status(400).json({ error: 'seed is required' })

    const schemaKeywordsOnly = {
      type: 'object',
      required: ['seed', 'suggestions'],
      additionalProperties: false,
      properties: {
        seed: { type: 'string' },
        suggestions: { type: 'array', items: { type: 'string' } }
      }
    }
    const schemaFull = {
      type: 'object',
      required: ['seed', 'suggestions'],
      additionalProperties: false,
      properties: {
        seed: { type: 'string' },
        suggestions: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['keyword', 'intent'],
            properties: {
              keyword: { type: 'string' },
              intent: { type: 'string', enum: ['Informational','Commercial','Transactional','Navigational'] },
              volume: { type: 'string' },
              difficulty: { type: 'integer' },
              variations: { type: 'array', items: { type: 'string' } },
              questions: { type: 'array', items: { type: 'string' } },
              title_idea: { type: 'string' },
              notes: { type: 'string' }
            }
          }
        }
      }
    }

    const system = keywords_only
      ? 'あなたは日本語のSEOアナリストです。重複を避け、実務的なキーワード候補のみを短く返します。'
      : 'あなたは日本語のSEOアナリストです。検索意図を分類し、重複を避けて実務的なキーワード候補を出します。'
    const user = keywords_only
      ? `前提\n- 言語: ${language}\n- 種キーワード: ${seed}\n- テーマ補足: ${theme || 'なし'}\n- 件数目安: ${count}\n\n要件\n- JSONのみ返す（seed, suggestions[]）。\n- suggestions[] は文字列（キーワード）のみ。\n- 重複・冗長・長すぎるフレーズは避け、ビジネスで使える粒度に。`
      : `前提\n- 言語: ${language}\n- 種キーワード: ${seed}\n- テーマ補足: ${theme || 'なし'}\n- 件数目安: ${count}\n\n要件\n- JSONのみ返す（seed, suggestions[]）。\n- suggestions[].intent は Informational / Commercial / Transactional / Navigational のいずれか。\n- volume は相対評価（low/medium/high）。difficulty は1-5（相対難易度）。\n- variations は同義/言い換え、questions はよくある質問（2-4件）。\n- title_idea は記事タイトル案（1つ）。\n- 重複・冗長を避け、ビジネスで使える粒度に。`

    const firstMax = provider === 'gemini' ? 8192 : 4096
    let json
    try {
      json = await llmChatJSON({ provider, system, user, schema: keywords_only ? schemaKeywordsOnly : schemaFull, temperature: 0.7, max_tokens: firstMax, model })
    } catch (e) {
      const msg = String(e?.message || '')
      if (provider === 'gemini' && (msg.includes('MAX_TOKENS') || msg.includes('valid JSON'))) {
        // Compact fallback: reduce fields and count, relax schema
        const compact = keywords_only
          ? `前提\n- 種キーワード: ${seed}\n- 件数: ${Math.min(Number(count)||20, 12)}\n\n出力（JSONのみ）：{"seed":string,"suggestions":string[]}\n制約:\n- suggestionsの各文字列は短く簡潔に（<=20）。説明・フェンス禁止。`
          : `前提\n- 種キーワード: ${seed}\n- 件数: ${Math.min(Number(count)||20, 12)}\n\n出力（JSONのみ）：{"seed":string,"suggestions":[{"keyword":string,"intent":"Informational"|"Commercial"|"Transactional"|"Navigational","volume":string,"difficulty":integer,"title_idea":string}] }\n制約:\n- suggestionsは短く簡潔に（各文字列<=32）。\n- variations/questionsは省略可。説明・フェンス禁止。`
        try {
          json = await llmChatJSON({ provider, system, user: compact, schema: undefined, temperature: 0.7, max_tokens: 2048, model })
        } catch (e2) {
          const msg2 = String(e2?.message || '')
          if (msg2.includes('MAX_TOKENS') || msg2.includes('valid JSON')) {
            const ultra = keywords_only
              ? `JSONのみ返す。キー: seed, suggestions[string](~8件)。説明・余計な文字・フェンス禁止。seed:${seed}`
              : `JSONのみ返す。キー: seed, suggestions[{keyword,intent}](~8件)。説明・余計な文字・フェンス禁止。seed:${seed}`
            json = await llmChatJSON({ provider, system, user: ultra, schema: undefined, temperature: 0.7, max_tokens: 1024, model })
          } else {
            throw e2
          }
        }
      } else {
        throw e
      }
    }

    let suggestions = Array.isArray(json?.suggestions) ? json.suggestions.slice(0, Number(count)||20) : []
    if (keywords_only) {
      suggestions = suggestions.map((s) => typeof s === 'string' ? s : (s?.keyword || '')).filter(Boolean)
    }
    const out = { seed, suggestions }
    res.json({ ok: true, plan: out })
  } catch (e) {
    console.error('keyword-planner error:', e?.message || e)
    res.status(500).json({ error: 'Failed to generate keyword plan', detail: String(e?.message || '') })
  }
})

// List articles (recent or special)
app.get('/list/:list', requireAdmin, async (req, res) => {
  try {
    const list = req.params.list
    if (!['recent', 'special'].includes(list)) return res.status(400).json({ error: 'list must be recent or special' })
    const path = list === 'recent' ? 'media/src/data/recentArticles.json' : 'media/src/data/specialArticles.json'
    const { content } = await getFile(path)
    const arr = content ? JSON.parse(content) : []
    res.json({ ok: true, list: arr })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to get list' })
  }
})

// Get featured article
app.get('/get-featured', requireAdmin, async (req, res) => {
  try {
    const path = 'media/src/data/featuredArticle.json'
    const { content } = await getFile(path)
    const obj = content ? JSON.parse(content) : null
    res.json({ ok: true, article: obj })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to get featured' })
  }
})

// Update article in a list (match by slug or oldSlug)
app.put('/update-in/:list', requireAdmin, async (req, res) => {
  try {
    const list = req.params.list
    if (!['recent', 'special'].includes(list)) return res.status(400).json({ error: 'list must be recent or special' })
    const article = req.body || {}
    const err = validateArticle(article)
    if (err) return res.status(400).json({ error: err })
    const oldSlug = req.query.slug || article.oldSlug || article.slug
    const path = list === 'recent' ? 'media/src/data/recentArticles.json' : 'media/src/data/specialArticles.json'
    const { sha, content } = await getFile(path)
    const arr = content ? JSON.parse(content) : []
    const idx = arr.findIndex((a) => a.slug === oldSlug)
    if (idx === -1) return res.status(404).json({ error: 'Article not found' })
    arr[idx] = article
    const out = JSON.stringify(arr, null, 2) + '\n'
    await putFile(path, out, sha, `chore(cms): update ${oldSlug} in ${list}`)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update article' })
  }
})

// Remove article from a list
app.delete('/remove-from/:list/:slug', requireAdmin, async (req, res) => {
  try {
    const list = req.params.list
    const slug = req.params.slug
    if (!['recent', 'special'].includes(list)) return res.status(400).json({ error: 'list must be recent or special' })
    if (!slug) return res.status(400).json({ error: 'slug is required' })
    const path = list === 'recent' ? 'media/src/data/recentArticles.json' : 'media/src/data/specialArticles.json'
    const { sha, content } = await getFile(path)
    const arr = content ? JSON.parse(content) : []
    const next = arr.filter((a) => a.slug !== slug)
    if (next.length === arr.length) return res.status(404).json({ error: 'Article not found' })
    const out = JSON.stringify(next, null, 2) + '\n'
    await putFile(path, out, sha, `chore(cms): remove ${slug} from ${list}`)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to remove article' })
  }
})

// Clear featured by replacing with dummy
app.post('/clear-featured', requireAdmin, async (req, res) => {
  try {
    const dummyPath = 'media/src/data/dummyArticle.json'
    const { content: dummy } = await getFile(dummyPath)
    if (!dummy) return res.status(500).json({ error: 'dummyArticle.json not found' })
    const path = 'media/src/data/featuredArticle.json'
    const { sha } = await getFile(path)
    const out = JSON.stringify(JSON.parse(dummy), null, 2) + '\n'
    await putFile(path, out, sha, 'chore(cms): clear featured (replace with dummy)')
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to clear featured' })
  }
})

// --- Keyword Planner: Save/Load/Delete ---
const KEYWORD_PLANS_PATH = 'media/src/data/keywordPlans.json'

// Save a keyword plan
app.post('/save-keyword-plan', requireAdmin, async (req, res) => {
  try {
    const { plan, notes = '', provider, model } = req.body || {}
    if (!plan || typeof plan !== 'object' || !plan.seed) {
      return res.status(400).json({ error: 'plan with seed is required' })
    }
    const { sha, content } = await getFile(KEYWORD_PLANS_PATH)
    const arr = content ? JSON.parse(content) : []
    const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
    const rec = {
      id,
      seed: String(plan.seed || ''),
      suggestions: Array.isArray(plan.suggestions) ? plan.suggestions : [],
      notes: String(notes || ''),
      provider: provider || null,
      model: model || null,
      createdAt: new Date().toISOString(),
    }
    arr.unshift(rec)
    // keep latest 50 entries
    const next = arr.slice(0, 50)
    const out = JSON.stringify(next, null, 2) + '\n'
    await putFile(KEYWORD_PLANS_PATH, out, sha, `chore(cms): save keyword plan for ${rec.seed}`)
    res.json({ ok: true, id: rec.id })
  } catch (e) {
    console.error('save-keyword-plan error:', e?.message || e)
    res.status(500).json({ error: 'Failed to save keyword plan' })
  }
})

// List keyword plans
app.get('/keyword-plans', requireAdmin, async (req, res) => {
  try {
    const { content } = await getFile(KEYWORD_PLANS_PATH)
    const arr = content ? JSON.parse(content) : []
    res.json({ ok: true, plans: arr })
  } catch (e) {
    console.error('get keyword-plans error:', e?.message || e)
    res.status(500).json({ error: 'Failed to get keyword plans' })
  }
})

// Delete keyword plan by id
app.delete('/keyword-plans/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: 'id is required' })
    const { sha, content } = await getFile(KEYWORD_PLANS_PATH)
    const arr = content ? JSON.parse(content) : []
    const next = arr.filter((r) => r.id !== id)
    if (next.length === arr.length) return res.status(404).json({ error: 'Plan not found' })
    const out = JSON.stringify(next, null, 2) + '\n'
    await putFile(KEYWORD_PLANS_PATH, out, sha, `chore(cms): delete keyword plan ${id}`)
    res.json({ ok: true })
  } catch (e) {
    console.error('delete keyword-plan error:', e?.message || e)
    res.status(500).json({ error: 'Failed to delete keyword plan' })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`CMS API listening on :${port}`))
