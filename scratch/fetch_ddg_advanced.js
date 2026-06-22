const https = require('https');
const fs = require('fs');

function searchDDG(query) {
  return new Promise((resolve) => {
    const url = `https://html.duckduckgo.com/html/?q=site:images.unsplash.com+${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      resolve('ERROR: ' + err.message);
    });
  });
}

async function run() {
  const queries = [
    "loafers",
    "ballerina-shoes",
    "clog",
    "rain-boots",
    "hiking-boots",
    "slippers",
    "stilettos",
    "derby-shoes"
  ];
  const results = {};
  
  for (const q of queries) {
    console.log(`Searching DDG for ${q}...`);
    const html = await searchDDG(q);
    const regex = /photo-\d+-[a-zA-Z0-9]+/g;
    const matches = html.match(regex) || [];
    const uniqueMatches = [...new Set(matches)];
    console.log(`Found ${uniqueMatches.length} IDs for ${q}`);
    results[q] = uniqueMatches;
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync('scratch/ddg_unsplash_advanced_ids.json', JSON.stringify(results, null, 2));
  console.log("Saved to scratch/ddg_unsplash_advanced_ids.json");
}

run();
