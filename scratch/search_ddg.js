const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractPhotoIds(html) {
  const ids = new Set();
  // Look for links to unsplash.com/photos/some-id
  const regex = /unsplash\.com\/photos\/([a-zA-Z0-9-]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    // Exclude general search words or words like "shoes", "sandals", "license"
    if (id && id.length > 5 && !['license', 'privacy', 'terms', 'explore', 'photos', 'collections', 'backgrounds', 'wallpapers'].includes(id.toLowerCase())) {
      ids.add(id);
    }
  }
  return Array.from(ids);
}

async function main() {
  const keywords = ['shoes', 'sneakers', 'slippers', 'sandals', 'boots', 'clogs', 'slides', 'mens-shoes', 'womens-shoes', 'kids-shoes'];
  const allIds = new Set();

  for (const keyword of keywords) {
    console.log(`Searching DuckDuckGo for ${keyword}...`);
    try {
      // Use DuckDuckGo HTML version
      const html = await fetchHTML(`https://html.duckduckgo.com/html/?q=site%3Aunsplash.com%2Fphotos+${encodeURIComponent(keyword)}`);
      const ids = extractPhotoIds(html);
      console.log(`Found ${ids.length} photo IDs for ${keyword}`);
      ids.forEach(id => allIds.add(id));
    } catch (err) {
      console.error(`Error searching DDG for ${keyword}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  const resultList = Array.from(allIds);
  console.log(`Total unique photo IDs collected: ${resultList.length}`);

  const outputPath = path.join(__dirname, 'unsplash_ids.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultList, null, 2));
  console.log(`Saved photo IDs to ${outputPath}`);
}

main();
