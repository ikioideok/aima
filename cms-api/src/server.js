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

