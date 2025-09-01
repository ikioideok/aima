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
} = process.env

if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
  console.error('Missing required env vars: GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME')
  process.exit(1)
}

const octokit = new Octokit({ auth: GITHUB_TOKEN })
const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

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

function validateArticle(a) {
  const required = ['slug', 'title', 'excerpt', 'author', 'publishDate', 'readTime', 'category', 'imageUrl']
  for (const k of required) {
    if (!a?.[k]) return `${k} is required`
  }
  return null
}

app.get('/health', (req, res) => res.json({ ok: true }))

// --- OpenAI helpers ---
function ensureOpenAI(res) {
  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    return false
  }
  return true
}

async function openaiChatJSON({ system, user, schema, temperature = 0.7, max_tokens = 2048 }) {
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

  const isGpt5 = /gpt-5/i.test(OPENAI_MODEL || '')
  const base = {
    model: OPENAI_MODEL,
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
    if (!ensureOpenAI(res)) return
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
    const example = {
      title: 'B2BのSEOで成果を出すコンテンツ戦略ガイド',
      slug: 'b2b-seo-content-strategy-guide',
      persona: 'デマンドジェン担当マネージャー',
      target_audience: 'B2Bのマーケティング担当者/事業責任者',
      tone: '実務的・検証済みの示唆',
      word_count_target: 2200,
      seo: {
        keywords: ['B2B SEO', 'コンテンツ戦略', 'E-E-A-T', '検索意図', 'トピッククラスター'],
        meta_description: 'B2Bでパイプラインを伸ばすためのSEO/コンテンツ戦略。検索意図の分解、トピッククラスター、E-E-A-T強化、計測までを網羅。',
        cta: '無料の戦略チェックリストをダウンロード'
      },
      h2: [
        { title: '検索意図の分解と優先順位付け', h3: ['情報/比較/取引の意図', 'ビジネスインパクト評価'] },
        { title: 'トピッククラスターと内部リンク設計', h3: ['ハブ/スポーク設計', '重複回避'] },
        { title: 'E-E-A-Tを満たす執筆要件', h3: ['一次情報と引用', '専門家監修'] },
        { title: '制作プロセスとレビューフロー', h3: ['ブリーフ作成', '査読と更新'] },
        { title: '計測設計と継続改善', h3: ['KPI/指標', '更新の優先度付け'] },
        { title: '成功事例と落とし穴', h3: [] }
      ]
    }
    const user = `前提\n- キーワード: ${keyword}\n- カテゴリ: ${category}\n- トーン: ${tone}\n- 想定読者: ${target_audience}\n- 目標文字数: ${word_count_target}\n\n要件\n- 出力はJSONのみ。説明や注釈は不要。\n- 見出しは重複禁止、MECE、実務に役立つ順序。\n- h2は5〜7個、各h2に0〜4個のh3を付与。\n- slugは英小文字のケバブケース。\n- seo.meta_descriptionは120〜160文字。\n\n良い例（参考。内容は上記前提に合わせて再生成すること）:\n${JSON.stringify(example, null, 2)}`

    const json = await openaiChatJSON({ system, user, schema, temperature: 0.6, max_tokens: 1200 })
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
    if (!ensureOpenAI(res)) return
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

    const system = 'あなたは日本語のプロ編集者・ライターです。専門的で実務に役立つ記事を、検証可能な情報と具体例で執筆します。冗長・誇張を避け、読みやすいHTML構造で書きます。'
    const exampleArticle = {
      title: 'B2BのSEOで成果を出すコンテンツ戦略ガイド',
      excerpt: 'B2B企業がパイプラインを伸ばすためのSEO/コンテンツ戦略。検索意図、トピッククラスター、E-E-A-T、計測まで実務視点で解説。',
      body: '<p>導入...</p>\n<h2>検索意図の分解と優先順位付け</h2>\n<p>...</p>\n<h3>情報/比較/取引の意図</h3>\n<ul><li>...</li></ul>\n<h2>まとめ・次のアクション</h2>\n<p>...</p>'
    }
    const user = `前提:\n- サイト: AIMA（AIマーケティング）\n- カテゴリ: ${category || outline.category || 'SEO'}\n- トーン: ${outline.tone || '実務的で明快'}\n- 想定読者: ${outline.target_audience || 'マーケ担当者'}\n- 目標文字数: 約${targetWords}文字\n- 見出し構成:\n${outlineText}\n\n出力要件:\n- JSONのみ返す（title, excerpt, body）。前後の説明やコードフェンスは不要。\n- bodyはHTMLで、<h2>/<h3>/<p>/<ul>/<li>を適切に使用。\n- 導入で期待値を提示し、各見出しに具体例/手順/チェックリストを含める。結論/CTAで締める。\n- 根拠のない断定や最新情報の言い切りは避ける。\n\n形式の例（参考。内容は上記前提に合わせて再生成）:\n${JSON.stringify(exampleArticle, null, 2)}`

    const json = await openaiChatJSON({ system, user, schema, temperature: 0.7, max_tokens: 4000 })

    // Normalize article fields
    const title = json?.title || outline.title
    const body = json?.body || json?.html || json?.content || ''
    const excerpt = json?.excerpt || ''
    if (!title || !body) {
      return res.status(502).json({ error: 'Invalid article response from model', detail: 'Missing title/body' })
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

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`CMS API listening on :${port}`))
