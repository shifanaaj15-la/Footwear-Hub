const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const keywords = [
    'sneakers', 'slippers', 'slides', 'sandals', 'clogs',
    'loafers', 'boots', 'hiker-shoes', 'oxford-shoes'
  ];
  const ids = new Set();

  for (const keyword of keywords) {
    console.log(`Searching DDG for unsplash.com ${keyword}...`);
    try {
      const query = `site:unsplash.com/photos ${keyword}`;
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const html = await fetchHTML(url);
      
      // Match both encoded and decoded Unsplash photo URLs
      const regex = /unsplash\.com(?:%2F|\/)photos(?:%2F|\/)([a-zA-Z0-9_-]+)/gi;
      let match;
      let count = 0;
      while ((match = regex.exec(html)) !== null) {
        // Decode the captured string in case it has URL encoding
        const id = decodeURIComponent(match[1]);
        if (id && id.length > 5 && !['license', 'privacy', 'terms', 'explore'].includes(id.toLowerCase())) {
          const parts = id.split('-');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart.length >= 8 && lastPart.length <= 15) {
            ids.add(lastPart);
            count++;
          } else {
            ids.add(id);
            count++;
          }
        }
      }
      console.log(`Found ${count} candidates for ${keyword}`);
    } catch (err) {
      console.error(`Error for ${keyword}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  const resultList = Array.from(ids);
  console.log(`Total unique photo IDs: ${resultList.length}`);
  console.log('Sample IDs:', resultList.slice(0, 20));

  fs.writeFileSync(
    path.join(__dirname, 'ddg_unsplash_ids.json'),
    JSON.stringify(resultList, null, 2)
  );
}

main();
