const https = require('https');
const fs = require('fs');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    function get(currentUrl) {
      https.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`Redirecting to ${res.headers.location}...`);
          let nextUrl = res.headers.location;
          if (nextUrl.startsWith('/')) {
            const parsed = new URL(currentUrl);
            nextUrl = parsed.protocol + '//' + parsed.host + nextUrl;
          }
          get(nextUrl);
        } else if (res.statusCode === 200) {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(data));
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      }).on('error', reject);
    }
    get(url);
  });
}

async function main() {
  try {
    const html = await fetchHTML('https://unsplash.com/s/photos/shoes');
    console.log(`Fetched HTML of length: ${html.length}`);
    
    // Parse photo IDs from images.unsplash.com/photo- or /photos/
    const ids = new Set();
    const regex = /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const id = match[1];
      if (id && id.length > 5 && !['license', 'privacy', 'terms', 'explore'].includes(id.toLowerCase())) {
        // Unsplash slugs are sometimes like "shoes-in-different-colors-and-styles-are-stacked-bFKClfH-pzY"
        // We can split on "-" and get the last part if it looks like an ID, or just use the whole slug!
        ids.add(id);
      }
    }
    
    const idList = Array.from(ids);
    console.log(`Found ${idList.length} unique photo slugs/IDs:`);
    console.log(idList.slice(0, 30));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
