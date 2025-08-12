// server/server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());            // dev 阶段开放跨域，方便前端本地调试
app.use(express.json());    // 解析 JSON body

// In-memory stores (dev only)
const placeRatings = []; // {placeId, name, wheelchair, lat, lon, score, ts}
const roadRatings  = []; // {lat, lon, score, ts}

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// --- READ (for your overlay layers)
app.get('/rate/place', (_, res) => res.json(placeRatings));
app.get('/rate/road',  (_, res) => res.json(roadRatings));

// --- WRITE (from your app buttons)
app.post('/rate/place', (req, res) => {
  const { placeId, name, wheelchair, lat, lon, score } = req.body || {};
  if (!placeId || typeof lat !== 'number' || typeof lon !== 'number' || ![1,-1].includes(score)) {
    return res.status(400).json({ ok: false, error: 'invalid payload' });
  }
  placeRatings.push({ placeId, name, wheelchair, lat, lon, score, ts: Date.now() });
  res.json({ ok: true, count: placeRatings.length });
});

app.post('/rate/road', (req, res) => {
  const { lat, lon, score } = req.body || {};
  if (typeof lat !== 'number' || typeof lon !== 'number' || ![1,-1].includes(score)) {
    return res.status(400).json({ ok: false, error: 'invalid payload' });
  }
  roadRatings.push({ lat, lon, score, ts: Date.now() });
  res.json({ ok: true, count: roadRatings.length });
});

// Debug stats
app.get('/debug/stats', (_, res) => {
  res.json({ places: placeRatings.length, roads: roadRatings.length });
});

app.listen(PORT, () => {
  console.log(`Mock API at http://localhost:${PORT}`);
});
