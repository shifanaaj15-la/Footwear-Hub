const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

function searchDDGLite(query, callback) {
  const postData = querystring.stringify({ q: query });
  
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
      // Extract links of the form unsplash.com/photos/... or /photos/...
      const regex = /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/g;
      const ids = new Set();
      let match;
      while ((match = regex.exec(data)) !== null) {
        const id = match[1];
        if (id && id.length > 5 && !['license', 'privacy', 'terms', 'explore', 'download'].includes(id.toLowerCase())) {
          ids.add(id);
        }
      }
      callback(null, Array.from(ids));
    });
  });
  
  req.on('error', callback);
  req.write(postData);
  req.end();
}

console.log("Searching DDG Lite for 'mens sneaker'...");
searchDDGLite('site:unsplash.com/photos "mens sneaker"', (err, ids) => {
  if (err) {
    console.error("Error:", err.message);
  } else {
    console.log(`Success! Found ${ids.length} photo IDs:`);
    console.log(ids);
  }
});
