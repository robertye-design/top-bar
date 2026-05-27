import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JsonStorage } from './storage/jsonStorage.js';
import { createCommentRoutes } from './routes/comments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Use /tmp on Vercel (serverless), local data directory otherwise
const dataDir = process.env.VERCEL ? '/tmp/prototype-data' : join(__dirname, '..', 'data');
const storage = new JsonStorage(dataDir);

app.use('/api', createCommentRoutes(storage));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
