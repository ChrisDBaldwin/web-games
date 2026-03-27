#!/usr/bin/env node
// Ultra-lightweight leaderboard API — single file, no dependencies beyond Node.js
// Usage: node leaderboard-server.js [port]
// Stores scores in a JSON file. ~2MB RSS. No frameworks.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2]) || 3777;
const DB_PATH = path.join(__dirname, '.leaderboard-data.json');
const MAX_SCORES = 50;
const RATE_LIMIT_MS = 2000; // min ms between POSTs per IP
const ipTimestamps = {};

// prune rate limit map every 5 min so it doesn't grow
setInterval(() => { const now = Date.now(); for (const ip in ipTimestamps) if (now - ipTimestamps[ip] > 60000) delete ipTimestamps[ip]; }, 300000);

function readScores() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return []; }
}
function writeScores(scores) {
  fs.writeFileSync(DB_PATH, JSON.stringify(scores));
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (!url.pathname.endsWith('/scores')) { res.writeHead(404); res.end('{"error":"not found"}'); return; }

  if (req.method === 'GET') {
    res.end(JSON.stringify(readScores()));
    return;
  }

  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    if (ipTimestamps[ip] && now - ipTimestamps[ip] < RATE_LIMIT_MS) {
      res.writeHead(429); res.end('{"error":"slow down"}'); return;
    }
    ipTimestamps[ip] = now;

    let body = '';
    req.on('data', c => { body += c; if (body.length > 512) req.destroy(); });
    req.on('end', () => {
      try {
        const { ini, stars, nights, mems } = JSON.parse(body);
        if (!ini || typeof stars !== 'number') { res.writeHead(400); res.end('{"error":"invalid"}'); return; }
        const scores = readScores();
        scores.push({
          ini: String(ini).replace(/[^A-Z]/g, '').slice(0, 3),
          stars: Math.max(0, stars | 0),
          nights: Math.max(1, nights | 0),
          mems: Math.max(0, mems | 0),
          date: now,
        });
        scores.sort((a, b) => b.stars - a.stars || b.nights - a.nights);
        if (scores.length > MAX_SCORES) scores.length = MAX_SCORES;
        writeScores(scores);
        res.end(JSON.stringify(scores));
      } catch { res.writeHead(400); res.end('{"error":"bad json"}'); }
    });
    return;
  }

  res.writeHead(405); res.end('{"error":"method not allowed"}');
});

server.listen(PORT, () => console.log(`Leaderboard API on :${PORT}/scores`));
