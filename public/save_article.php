<?php
// save_article.php
// Receive JSON payload and update articles.json

// CORS headers (adjust for production security if needed)
header('Access-Control-Allow-Origin: https://ai-and-marketing.jp');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-KEY');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Basic Authentication
$headers = getallheaders();
$apiKey = isset($headers['X-Api-Key']) ? $headers['X-Api-Key'] : (isset($headers['X-API-KEY']) ? $headers['X-API-KEY'] : null);

// HARDCODED SECRET KEY (Change this!)
$validKey = 'aima-secret-key-2024';

if ($apiKey !== $validKey) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden: Invalid API Key']);
    exit;
}

$input = file_get_contents('php://input');
$newArticle = json_decode($input, true);

if (!$newArticle) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$file = 'articles.json';
$articles = [];

if (file_exists($file)) {
    $content = file_get_contents($file);
    $articles = json_decode($content, true);
    if (!is_array($articles)) {
        $articles = [];
    }
}

// Prepend new article
array_unshift($articles, $newArticle);

// Save back to file
if (file_put_contents($file, json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode($articles);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write file']);
}
?>
