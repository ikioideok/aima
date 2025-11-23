<?php
// Server-side render for article pages to expose full HTML to crawlers.
// Reads articles.json (same folder) and injects content into the built index.html template.

$articlesPath = __DIR__ . '/articles.json';
$indexPath = __DIR__ . '/index.html';

$id = $_GET['id'] ?? '';

if ($id === '') {
    http_response_code(404);
    echo 'Not found';
    exit;
}

if (!file_exists($articlesPath) || !file_exists($indexPath)) {
    http_response_code(500);
    echo 'Articles or index not found';
    exit;
}

$articles = json_decode(file_get_contents($articlesPath), true);
$article = null;

if (is_array($articles)) {
    foreach ($articles as $a) {
        if (isset($a['id']) && $a['id'] === $id) {
            $article = $a;
            break;
        }
    }
}

if (!$article) {
    http_response_code(404);
    echo 'Article not found';
    exit;
}

// Helpers
$esc = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$contentHtml = isset($article['content']) ? (string)$article['content'] : '';
$title = $esc($article['title'] ?? 'Article');
$description = $esc($article['subtitle'] ?? $article['excerpt'] ?? '');
$image = $esc($article['image'] ?? '');

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$url = $esc($protocol . $host . '/media/' . $id);

$indexHtml = file_get_contents($indexPath);

// Meta overrides
$metaBlock = <<<HTML
<title>{$title}</title>
<meta name="description" content="{$description}">
<link rel="canonical" href="{$url}">
<meta property="og:title" content="{$title}">
<meta property="og:description" content="{$description}">
<meta property="og:image" content="{$image}">
<meta property="og:url" content="{$url}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{$title}">
<meta name="twitter:description" content="{$description}">
<meta name="twitter:image" content="{$image}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{$title}",
  "description": "{$description}",
  "image": "{$image}",
  "datePublished": "{$esc($article['date'] ?? '')}",
  "author": {
    "@type": "Organization",
    "name": "AIMA Inc."
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{$url}"
  }
}
</script>
HTML;

$articleBody = <<<HTML
<div id="ssr-article" style="max-width:960px;margin:80px auto;padding:24px;font-family:'Shippori Mincho','Zen Old Mincho',serif;line-height:1.7;color:#111;">
  <div style="font-size:12px;letter-spacing:0.08em;color:#555;margin-bottom:12px;display:flex;gap:12px;align-items:center;">
    <span>{$esc($article['category'] ?? '')}</span>
    <span>{$esc($article['date'] ?? '')}</span>
  </div>
  <h1 style="font-size:32px;font-weight:800;margin:0 0 24px;">{$title}</h1>
  <p style="color:#555;font-size:15px;margin:0 0 24px;">{$description}</p>
  <div style="margin:0 0 24px;overflow:hidden;border-radius:8px;">
    <img src="{$image}" alt="{$title}" style="width:100%;height:auto;display:block;object-fit:cover;">
  </div>
  <div style="font-size:16px;" aria-label="article-body">{$contentHtml}</div>
</div>
HTML;

// Insert meta overrides before </head>
if (strpos($indexHtml, '</head>') !== false) {
    $indexHtml = str_replace('</head>', $metaBlock . "\n</head>", $indexHtml);
}

// Insert SSR article into root (will be replaced by React after hydration, but crawlers get full HTML)
$indexHtml = str_replace('<div id="root"></div>', '<div id="root">' . $articleBody . '</div>', $indexHtml);

header('Content-Type: text/html; charset=utf-8');
echo $indexHtml;
