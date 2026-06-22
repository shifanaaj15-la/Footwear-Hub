const https = require('https');
const fs = require('fs');

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
  try {
    const html = await fetchHTML('https://unsplash.com/s/photos/shoes');
    console.log(`Fetched HTML of length: ${html.length}`);
    
    // Find all occurrences of "images.unsplash.com/photo-"
    const regex = /images\.unsplash\.com\/photo-[a-zA-Z0-9-?&=_%]+/g;
    const matches = html.match(regex) || [];
    console.log(`Found ${matches.length} matches for images.unsplash.com/photo-`);
    
    // Print the first 5 matches to see format
    matches.slice(0, 5).forEach((m, idx) => {
      console.log(`${idx}: ${m}`);
    });

    // Also look for "/photos/" links
    const regex2 = /\/photos\/[a-zA-Z0-9-]+/g;
    const matches2 = html.match(regex2) || [];
    console.log(`Found ${matches2.length} matches for /photos/`);
    matches2.slice(0, 10).forEach((m, idx) => {
      console.log(`${idx}: ${m}`);
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
