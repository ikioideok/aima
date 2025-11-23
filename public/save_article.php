<?php
// Simple article saver for shared hosting (e.g., Sakura/Xserver).
// Uses articles.json alongside this file for persistence.
// Optional protection: set environment variable ADMIN_SECRET or hardcode below.
$ADMIN_SECRET = getenv('ADMIN_SECRET') ?: ''; // Set to strong string on the server.

$dataFile = __DIR__ . '/articles.json';

header('Content-Type: application/json; charset=utf-8');

// Auth check (optional)
if ($ADMIN_SECRET !== '') {
    $clientSecret = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
    if (hash_equals($ADMIN_SECRET, $clientSecret) === false) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// Helper to read current articles
$readArticles = function () use ($dataFile) {
    if (!file_exists($dataFile)) {
        return [];
    }
    $json = file_get_contents($dataFile);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
};

// GET: return articles.json
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $articles = $readArticles();
    echo json_encode($articles, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// POST: prepend new article
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $article = json_decode($raw, true);

    if (!is_array($article) || empty($article['id']) || empty($article['title'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid article payload']);
        exit;
    }

    $articles = $readArticles();

    // Deduplicate by id, keep newest first
    $filtered = array_filter($articles, function ($item) use ($article) {
        return isset($item['id']) && $item['id'] !== $article['id'];
    });

    array_unshift($filtered, $article);

    file_put_contents(
        $dataFile,
        json_encode($filtered, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
    );

    echo json_encode($filtered, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// Others: method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
