const https = require('https');

function get(url) {
  console.log('Fetching:', url);
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  }, (res) => {
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirect location:', res.headers.location);
      let nextUrl = res.headers.location;
      if (nextUrl.startsWith('/')) {
        nextUrl = 'https://unsplash.com' + nextUrl;
      }
      get(nextUrl);
      return;
    }
    
    let data = '';
    res.on('data', chunk => {
      data += chunk;
      if (data.length > 500000) {
        res.destroy();
      }
    });
    
    res.on('close', () => {
      console.log('Data length:', data.length);
      const regex = /https:\/\/images\.unsplash\.com\/(photo-[a-zA-Z0-9\-]+)/g;
      const matches = new Set();
      let match;
      while ((match = regex.exec(data)) !== null) {
        matches.add(match[1]);
      }
      console.log(`Found ${matches.size} photo IDs:`);
      console.log(Array.from(matches).slice(0, 10));
    });
  }).on('error', err => {
    console.error('Error:', err.message);
  });
}

get('https://unsplash.com/s/photos/mens-sneakers');
