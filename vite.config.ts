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
          server.middlewares.use('/api/save-article', async (req, res, next) => {
            if (req.method === 'POST') {
              const fs = await import('fs');
              const path = await import('path');

              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const newArticle = JSON.parse(body);
                  const filePath = path.resolve(__dirname, 'src/data/articles.json');

                  // Read existing articles
                  let articles = [];
                  if (fs.existsSync(filePath)) {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    articles = JSON.parse(fileContent);
                  }

                  // Add new article (prepend)
                  articles.unshift(newArticle);

                  // Write back to file
                  fs.writeFileSync(filePath, JSON.stringify(articles, null, 4));

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
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
