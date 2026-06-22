const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

const postData = querystring.stringify({ q: 'site:unsplash.com/photos "mens sneaker"' });

const req = https.request({
  hostname: 'lite.duckduckgo.com',
  port: 443,
  path: '/lite/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('scratch/ddg_lite_result.html', data);
    console.log('Saved to scratch/ddg_lite_result.html. Length:', data.length);
  });
});

req.write(postData);
req.end();
