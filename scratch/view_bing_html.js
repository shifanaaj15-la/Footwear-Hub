const https = require('https');
const fs = require('fs');

const query = 'site:unsplash.com/photos "shoes"';
const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('scratch/bing_result.html', data);
    console.log('Saved to scratch/bing_result.html. Length:', data.length);
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
