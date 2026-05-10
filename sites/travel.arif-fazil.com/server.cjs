/**
 * Travel LWM — API Proxy Server
 * Hides Google API keys from the browser.
 * Reads GOOGLE_PLACES_API_KEY from /root/.env
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Load key from /root/.env
let GOOGLE_KEY = '';
const envPath = path.join(__dirname, '..', '..', '..', '.env');
const altEnvPath = '/root/.env';
const targetEnv = fs.existsSync(envPath) ? envPath : altEnvPath;

try {
  const envContent = fs.readFileSync(targetEnv, 'utf-8');
  const match = envContent.match(/GOOGLE_PLACES_API_KEY=(.+)/);
  if (match) GOOGLE_KEY = match[1].trim();
} catch (e) {
  console.warn('Could not read .env, using empty key');
}

if (!GOOGLE_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY not found in .env');
  process.exit(1);
}

console.log('🔑 Google API key loaded (length:', GOOGLE_KEY.length, ')');

// Proxy: Places Text Search
app.get('/api/places/search', async (req, res) => {
  const { query, location, radius = 5000 } = req.query;
  if (!query) return res.status(400).json({ error: 'query required' });

  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', String(query));
  url.searchParams.set('key', GOOGLE_KEY);
  url.searchParams.set('language', 'en');
  if (location) url.searchParams.set('location', String(location));
  if (radius) url.searchParams.set('radius', String(radius));

  try {
    const resp = await fetch(url.toString());
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Places API failed', detail: String(err) });
  }
});

// Proxy: Place Details
app.get('/api/places/details', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: 'place_id required' });

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', String(place_id));
  url.searchParams.set('key', GOOGLE_KEY);
  url.searchParams.set('fields', 'name,formatted_address,geometry,rating,photos,types,opening_hours,reviews,website,formatted_phone_number');

  try {
    const resp = await fetch(url.toString());
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Place Details API failed', detail: String(err) });
  }
});

// Proxy: Directions
app.get('/api/directions', async (req, res) => {
  const { origin, destination, mode = 'driving' } = req.query;
  if (!origin || !destination) return res.status(400).json({ error: 'origin and destination required' });

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.set('origin', String(origin));
  url.searchParams.set('destination', String(destination));
  url.searchParams.set('mode', String(mode));
  url.searchParams.set('key', GOOGLE_KEY);

  try {
    const resp = await fetch(url.toString());
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Directions API failed', detail: String(err) });
  }
});

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', key_loaded: !!GOOGLE_KEY });
});

const PORT = 3456;
app.listen(PORT, () => {
  console.log(`🌍 Travel LWM proxy running on http://localhost:${PORT}`);
});
