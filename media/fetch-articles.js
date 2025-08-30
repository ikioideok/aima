import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'https://ai-news-cms.onrender.com/api';
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const endpoints = {
  featured: '/articles?filter[isFeatured]=true&sort=featuredOrder:asc,publishedAt:desc&limit=1',
  special: '/articles?tag=special&sort=publishedAt:desc&limit=4', // UI shows 2x2 grid, so 4 articles
  recent: '/articles?sort=publishedAt:desc&limit=10',
};

async function fetchArticles(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    // The API returns data in a `contents` property.
    return data.contents;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function writeJsonFile(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Successfully wrote ${filename}`);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
}

async function main() {
  console.log('Fetching articles from CMS...');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const [featured, special, recent] = await Promise.all([
    fetchArticles(endpoints.featured),
    fetchArticles(endpoints.special),
    fetchArticles(endpoints.recent),
  ]);

  if (featured) {
    // The UI expects a single object for the featured article.
    writeJsonFile('featuredArticle.json', featured[0] || {});
  }

  if (special) {
    writeJsonFile('specialArticles.json', special);
  }

  if (recent) {
    writeJsonFile('recentArticles.json', recent);
  }

  console.log('Finished updating articles.');
}

main();
