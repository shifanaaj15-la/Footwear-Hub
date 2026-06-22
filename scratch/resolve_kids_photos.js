const https = require('https');
const fs = require('fs');

const shortIds = [
  '6y7p6C_33mY',
  '0Wz9K9bJd4Y',
  'E78j-Jg3O2Y',
  'F7_bH4-t_Zg',
  'r7T6vE-L_Yw'
];

let pending = shortIds.length;
const results = [];

shortIds.forEach(id => {
  const url = `https://unsplash.com/photos/${id}`;
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let redirectUrl = res.headers.location;
      if (redirectUrl.startsWith('/')) {
        redirectUrl = 'https://unsplash.com' + redirectUrl;
      }
      resolveUrl(redirectUrl, id);
    } else {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        parseHtml(data, id);
      });
    }
  }).on('error', (err) => {
    console.error(`Error requesting ${id}:`, err.message);
    decrement();
  });
});

function resolveUrl(url, id) {
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      parseHtml(data, id);
    });
  }).on('error', (err) => {
    console.error(`Error requesting resolved URL for ${id}:`, err.message);
    decrement();
  });
}

function parseHtml(html, id) {
  const match = html.match(/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
  if (match) {
    const longId = 'photo-' + match[1];
    console.log(`✅ Resolved ${id} -> ${longId}`);
    results.push({ id, longId });
  } else {
    console.log(`❌ Failed to find photo ID in HTML for ${id}`);
  }
  decrement();
}

function decrement() {
  if (--pending === 0) {
    console.log("\n=== RESOLVED KIDS PHOTOS ===");
    console.log(JSON.stringify(results, null, 2));
    fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\resolved_kids_photos.json', JSON.stringify(results, null, 2));
  }
}
