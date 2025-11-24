<?php
// save_article.php
// Receive JSON payload and update articles.json

// CORS headers
$allowedOrigins = [
    'https://ai-and-marketing.jp',
    'https://www.ai-and-marketing.jp',
    'http://localhost:5173', // Vite default
    'http://localhost:3000'  // Common React port
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    // Fallback or strict denial. For now, we don't send ACAO if not matched, which blocks it.
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-KEY');
header('Content-Type: application/json');

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
$apiKey = null;
if (isset($_SERVER['HTTP_X_API_KEY'])) {
    $apiKey = $_SERVER['HTTP_X_API_KEY'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    $apiKey = isset($headers['X-Api-Key']) ? $headers['X-Api-Key'] : (isset($headers['X-API-KEY']) ? $headers['X-API-KEY'] : null);
}

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

// Helper to save Base64 image
function saveBase64Image($base64String, $prefix) {
    if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
        $data = substr($base64String, strpos($base64String, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, etc.
        
        if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            return $base64String; // Invalid type, return original
        }

        $data = base64_decode($data);
        if ($data === false) {
            return $base64String; // Decode failed
        }

        $uploadDir = 'uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = $prefix . '_' . uniqid() . '.' . $type;
        file_put_contents($uploadDir . $filename, $data);
        
        return '/' . $uploadDir . $filename;
    }
    return $base64String; // Not a base64 string
}

// Process images
if (isset($newArticle['image'])) {
    $newArticle['image'] = saveBase64Image($newArticle['image'], 'article');
}
if (isset($newArticle['heroImage'])) {
    $newArticle['heroImage'] = saveBase64Image($newArticle['heroImage'], 'hero');
}
if (isset($newArticle['supervisor']['image'])) {
    $newArticle['supervisor']['image'] = saveBase64Image($newArticle['supervisor']['image'], 'supervisor');
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

// Handle Delete
if (isset($newArticle['delete']) && $newArticle['delete'] === true) {
    $idToDelete = $newArticle['id'];
    $articles = array_filter($articles, function($a) use ($idToDelete) {
        return $a['id'] !== $idToDelete;
    });
    // Re-index array
    $articles = array_values($articles);
} else {
    // Handle Save (Update or Create)
    $id = $newArticle['id'];
    $exists = false;
    
    foreach ($articles as $key => $article) {
        if ($article['id'] === $id) {
            // Update existing
            $articles[$key] = $newArticle;
            $exists = true;
            break;
        }
    }
    
    if (!$exists) {
        // Create new (prepend)
        array_unshift($articles, $newArticle);
    }
}

// Save back to file
if (file_put_contents($file, json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode($articles);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write file']);
}
?>
