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
    const content = data?.choices?.[0]?.message?.content || '{}'
    return JSON.parse(content)
  }

  const base = {
    model: OPENAI_MODEL,
    messages: [
      system ? { role: 'system', content: system } : null,
      { role: 'user', content: user },
    ].filter(Boolean),
    temperature,
    max_tokens,
  }

  // Try strict json_schema first, then gracefully fall back to json_object if unsupported
  if (schema) {
    try {
      return await call({
        ...base,
        response_format: { type: 'json_schema', json_schema: { name: 'response', schema, strict: true } },
      })
    } catch (e) {
      const msg = String(e?.message || '')
      if (msg.includes('response_format') || msg.includes('json_schema') || e?.status === 400) {
        // Fallback
        return await call({ ...base, response_format: { type: 'json_object' } })
      }
      throw e
    }
  }
  return await call({ ...base, response_format: { type: 'json_object' } })
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

    const system = 'あなたは日本語のコンテンツストラテジストです。AIMAのマーケティング記事の構成を作ります。'
    const user = `キーワード: ${keyword}\nカテゴリ: ${category}\nトーン: ${tone}\n想定読者: ${target_audience}\n目標文字数: ${word_count_target}\n\n出力要件:\n- JSONのみを出力。説明文は不要。\n- titleは魅力的に。slugは英小文字のケバブケース。\n- h2見出しは論理順で3-6本。各h2に必要ならh3を含める。\n- seo.keywordsは5-10個。meta_descriptionは120-160文字。ctaは短く。`

    const json = await openaiChatJSON({ system, user, schema, temperature: 0.6, max_tokens: 1200 })

    if (!json?.title || !json?.slug || !Array.isArray(json?.h2)) {
      return res.status(502).json({ error: 'Invalid outline response from model' })
    }

    res.json({ ok: true, outline: {
      title: json.title,
      slug: json.slug,
      persona: json.persona || 'マーケター',
      target_audience: json.target_audience || target_audience,
      tone: json.tone || tone,
      word_count_target: json.word_count_target || word_count_target,
      seo: json.seo || {},
      h2: json.h2,
      category,
      keyword,
    } })
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

    const system = 'あなたは日本語のプロ編集者・ライターです。専門的で実務に役立つ記事をHTMLで執筆します。'
    const user = `前提:\n- サイト: AIMA（AIマーケティング）\n- カテゴリ: ${category || outline.category || 'SEO'}\n- トーン: ${outline.tone || '実務的で明快'}\n- 想定読者: ${outline.target_audience || 'マーケ担当者'}\n- 目標文字数: 約${targetWords}文字\n- 見出し構成:\n${outlineText}\n\n執筆要件:\n- 出力はJSONのみ。bodyはHTML。\n- h2/h3を見出しとして使用し、論理的な段落で構成。\n- コードブロック不要。箇条書きは<ul><li>を用いる。\n- 導入で期待値を提示し、結論/CTAで締める。\n- 事実ベースで、誇張表現は避ける。`

    const json = await openaiChatJSON({ system, user, schema, temperature: 0.7, max_tokens: 4000 })
    if (!json?.title || !json?.body) {
      return res.status(502).json({ error: 'Invalid article response from model' })
    }

    const out = {
      slug,
      title: json.title,
      excerpt: json.excerpt || '',
      author,
      publishDate,
      readTime: `${readTimeMin}分`,
      category: category || outline.category || 'SEO',
      imageUrl,
      body: json.body,
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
