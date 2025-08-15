// server/server.js
import express from 'express';
import cors from 'cors';
import os from 'os';

const app = express();
app.use(cors());
app.use(express.json());

// ---- mock stores
const placeRatings = []; // {placeId,name,wheelchair,lat,lon,score,ts}
const roadRatings  = []; // {lat,lon,score,ts}

// ---- health
app.get('/health', (_, res) => res.json({ ok: true }));

// ---- read overlays
app.get('/rate/place', (_, res) => res.json(placeRatings));
app.get('/rate/road',  (_, res) => res.json(roadRatings));

// ---- write overlays
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

// ---- single listen ONLY
const HOST = '0.0.0.0';                         // 允许手机访问
const PORT = Number(process.env.PORT) || 5050;  // 默认 5050，避开常见占用端口

// 打印本机局域网 IP
const ip = Object.values(os.networkInterfaces())
  .flat()
  .find(i => i && i.family === 'IPv4' && !i.internal)?.address;

app.listen(PORT, HOST, () => {
  console.log(`Mock API:   http://localhost:${PORT}`);
  if (ip) console.log(`LAN (phone): http://${ip}:${PORT}`);
});
