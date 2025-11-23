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
    // Use noscript for SEO content. This ensures crawlers see it even if they don't execute JS,
    // and it doesn't interfere with the React app's visual layout for users with JS enabled.
    $seoContent = '<noscript>';
    $seoContent .= '<h1>' . htmlspecialchars($article['title']) . '</h1>';
    $seoContent .= '<div>' . $article['content'] . '</div>'; 
    $seoContent .= '</noscript>';
    
    // Insert before </body>
    $html = str_replace('</body>', $seoContent . '</body>', $html);
}

echo $html;
?>
