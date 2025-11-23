import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'api-middleware',
        configureServer(server) {
          // Fetch articles
          server.middlewares.use('/api/articles', async (req, res, next) => {
            if (req.method !== 'GET') return next();
            try {
              const fs = await import('fs');
              const path = await import('path');
              const { pathToFileURL } = await import('url');
              const dataDir = path.resolve(__dirname, 'data');
              const jsonPath = path.join(dataDir, 'articles.json');
              const tsPath = path.join(dataDir, 'articles.ts');

              let articles = [];

              if (fs.existsSync(jsonPath)) {
                articles = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
              } else {
                // seed from static TS if JSON does not exist
                const staticModule = await import(pathToFileURL(tsPath).href);
                articles = staticModule.articles || [];
                fs.mkdirSync(dataDir, { recursive: true });
                fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 4));
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(articles));
            } catch (error) {
              console.error('Error reading articles:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to load articles' }));
            }
          });

          server.middlewares.use('/api/save-article', async (req, res, next) => {
            if (req.method === 'POST') {
              const fs = await import('fs');
              const path = await import('path');
              const { pathToFileURL } = await import('url');
              const { exec } = await import('child_process');

              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', async () => {
                try {
                  const newArticle = JSON.parse(body);
                  const dataDir = path.resolve(__dirname, 'data');
                  const jsonPath = path.join(dataDir, 'articles.json');
                  const tsPath = path.join(dataDir, 'articles.ts');
                  const publicJsonPath = path.resolve(__dirname, 'public', 'articles.json');

                  // 1. Update JSON
                  let articles = [];
                  if (fs.existsSync(jsonPath)) {
                    articles = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                  } else {
                    const staticModule = await import(pathToFileURL(tsPath).href);
                    articles = staticModule.articles || [];
                  }
                  articles.unshift(newArticle);
                  fs.mkdirSync(dataDir, { recursive: true });
                  fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 4));
                  // Also output to public so it can be fetched statically if served
                  fs.mkdirSync(path.dirname(publicJsonPath), { recursive: true });
                  fs.writeFileSync(publicJsonPath, JSON.stringify(articles, null, 4));

                  // 2. Generate TS
                  const tsContent = `import { Article } from '../types';\n\nexport const articles: Article[] = ${JSON.stringify(articles, null, 4)};\n`;
                  fs.writeFileSync(tsPath, tsContent);

                  // 3. Git Operations
                  const commitMsg = `Add article: ${newArticle.title}`;
                  exec(`git add "${jsonPath}" "${tsPath}" && git commit -m "${commitMsg}" && git push origin main`, (error, stdout, stderr) => {
                    if (error) {
                      console.error('Git error:', error);
                      // We still return success for the file save, but log the git error
                      // Ideally we might want to warn the user, but for now let's just log it
                    } else {
                      console.log('Git success:', stdout);
                    }
                  });

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(articles));
                } catch (error) {
                  console.error('Error saving article:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to save article' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
