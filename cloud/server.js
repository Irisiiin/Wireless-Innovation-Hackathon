import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/iot/button-press', (req, res) => {
  console.log('Button event:', req.body); // { device_id, type, timestamp }
  res.json({ ok: true });
});

app.get('/', (_, res) => res.send('Cloud mock running'));
app.listen(4000, () => console.log('Mock API on http://localhost:4000'));
