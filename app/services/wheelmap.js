// app/services/wheelmap.js
const BASE = 'https://wheelmap.org/api';

export async function fetchNearbyPlaces({ lat, lon, radius = 1000, perPage = 50 }) {
  const url = `${BASE}/nodes?lat=${lat}&lon=${lon}&radius=${radius}&per_page=${perPage}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wheelmap HTTP ${res.status}`);
  const data = await res.json();
  // 统一成 RN Map 可用的坐标格式
  const items = (data?.nodes || []).map(n => ({
    id: String(n.id),
    name: n.name || 'Unnamed place',
    wheelchair: n.wheelchair,             // yes / limited / no / unknown
    lat: n.lat ?? n?.coordinates?.lat,
    lon: n.lon ?? n?.coordinates?.lon,
    category: n?.category,
    raw: n
  })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon));
  return items;
}
