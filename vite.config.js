import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handler as hazardHandler } from './netlify/functions/analyze-hazard.js'

function netlifyFunctionsDevPlugin() {
  return {
    name: 'netlify-functions-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api/analyze-hazard') || url.startsWith('/.netlify/functions/analyze-hazard')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            const event = {
              httpMethod: req.method,
              headers: req.headers,
              body: body
            };
            try {
              const result = await hazardHandler(event, {});
              res.statusCode = result.statusCode || 200;
              for (const [key, val] of Object.entries(result.headers || {})) {
                res.setHeader(key, val);
              }
              res.end(result.body);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionsDevPlugin()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'recharts-vendor': ['recharts'],
          'lucide-vendor': ['lucide-react']
        }
      }
    }
  }
})
