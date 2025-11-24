<?php
// media.php
// Serve HTML with dynamic OGP tags for articles, then let React take over.

$request_uri = $_SERVER['REQUEST_URI'];
// Extract ID from URL: /media/article-id -> article-id
$parts = explode('/', trim($request_uri, '/'));
// Assuming URL structure is /media/{id}
$articleId = end($parts);

// Load articles
$articlesFile = 'articles.json';
$article = null;

if (file_exists($articlesFile)) {
    $articles = json_decode(file_get_contents($articlesFile), true);
    foreach ($articles as $a) {
        if ($a['id'] === $articleId) {
            $article = $a;
            break;
        }
    }
}

// Default OGP values
$title = "AIMA Inc.｜AIマーケティングとLLM活用コンサルティング";
$description = "AIMA Inc.は大阪拠点のAIコンサルティングファーム。AIマーケティング、LLM活用（RAG構築・ナレッジ活用）、データ分析で意思決定を支援します。";
$image = "https://ai-and-marketing.jp/ogp.png";
$url = "https://ai-and-marketing.jp" . $request_uri;
$type = "website";

// Override if article found
if ($article) {
    $title = htmlspecialchars($article['title']) . " | AIMA Inc.";
    $description = htmlspecialchars($article['excerpt'] ?? $article['subtitle']);
    $image = htmlspecialchars($article['image']);
    $type = "article";
}

// Read index.html template
$html = file_get_contents('index.html');

// Replace OGP meta tags
// Note: This simple replacement assumes standard meta tag format in index.html.
// A more robust way is to use DOMDocument or regex, but string replace is faster for this specific template.

// Helper to replace meta content
function replaceMeta($html, $property, $content) {
    // Regex to match <meta property="og:title" content="..." /> or name="..."
    $pattern = '/(<meta\s+(?:property|name)=["\']' . preg_quote($property, '/') . '["\']\s+content=["\'])([^"\']*)(["\']\s*\/?>)/i';
    return preg_replace($pattern, '$1' . $content . '$3', $html);
}

$html = replaceMeta($html, 'og:title', $title);
$html = replaceMeta($html, 'twitter:title', $title);
$html = replaceMeta($html, 'description', $description);
$html = replaceMeta($html, 'og:description', $description);
$html = replaceMeta($html, 'twitter:description', $description);
$html = replaceMeta($html, 'og:image', $image);
$html = replaceMeta($html, 'twitter:image', $image);
$html = replaceMeta($html, 'og:url', $url);
$html = replaceMeta($html, 'og:type', $type);

// Update <title>
$html = preg_replace('/<title>.*?<\/title>/i', "<title>{$title}</title>", $html);

// Inject Content for SEO (Server-Side Content Injection)
// We inject the content into a hidden div or noscript so crawlers can see it immediately.
// React will ignore this or we can place it outside #root.
if ($article) {
    // Inject content directly into #root.
    // Crawlers will see this immediately.
    // React will wipe this content when it mounts (client-side rendering), which is exactly what we want.
    $seoContent = '<div id="root">';
    $seoContent .= '<h1>' . htmlspecialchars($article['title']) . '</h1>';
    $seoContent .= '<div>' . $article['content'] . '</div>'; 
    $seoContent .= '</div>';
    
    // Replace empty <div id="root"></div> with populated one
    $html = str_replace('<div id="root"></div>', $seoContent, $html);

    // Canonical URL
    $articleUrl = 'https://ai-and-marketing.jp/media/' . $articleId;
    $html = str_replace('<link rel="canonical" href="https://ai-and-marketing.jp/" />', '<link rel="canonical" href="' . $articleUrl . '" />', $html);
    
    // OG Image (Use article image or default)
    $ogImage = !empty($article['image']) ? $article['image'] : 'https://ai-and-marketing.jp/ogp.png';
    // If image path is relative, make it absolute
    if (strpos($ogImage, 'http') !== 0) {
        $ogImage = 'https://ai-and-marketing.jp' . $ogImage;
    }

    // Structured Data (Article)
    $structuredData = [
        "@context" => "https://schema.org",
        "@type" => "Article",
        "headline" => $article['title'],
        "image" => $ogImage,
        "author" => [
            "@type" => "Organization",
            "name" => "株式会社AIMA"
        ],
        "datePublished" => str_replace('.', '-', $article['date']), // Convert YYYY.MM.DD to YYYY-MM-DD if needed, or keep as is if valid
        "dateModified" => str_replace('.', '-', $article['date']),
        "description" => $article['excerpt']
    ];
    
    // Inject Structured Data before </head>
    $jsonLd = '<script type="application/ld+json">' . json_encode($structuredData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>';
    $html = str_replace('</head>', $jsonLd . '</head>', $html);
}

echo $html;
?>
