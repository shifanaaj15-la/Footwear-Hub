const https = require('https');
const fs = require('fs');

function searchDDG(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  };
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log("Searching DDG for sandal photo URLs...");
    const html = await searchDDG('site:images.unsplash.com/photo- sandals');
    
    const regex = /photo-([a-zA-Z0-9\-]+)/g;
    const ids = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes('-')) {
        ids.add('photo-' + match[1].split('&')[0].split('?')[0]);
      }
    }
    
    console.log("Found IDs:", Array.from(ids).slice(0, 30));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
