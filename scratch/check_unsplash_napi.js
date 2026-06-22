const fs = require('fs');
const https = require('https');
const vm = require('vm');

const productsContent = fs.readFileSync('products.js', 'utf8');
const codeToRun = productsContent + "\nthis.PRODUCTS = PRODUCTS;";
const context = {};
vm.createContext(context);
vm.runInContext(codeToRun, context);
const products = context.PRODUCTS;

const unsplashIds = new Set();
products.forEach(p => {
  if (p.image.startsWith('https://images.unsplash.com/')) {
    const parts = p.image.split('/');
    const lastPart = parts[parts.length - 1];
    const match = lastPart.match(/^(photo-[a-zA-Z0-9\-]+)/);
    if (match) {
      unsplashIds.add(match[1]);
    }
  }
});

const ids = Array.from(unsplashIds);
console.log(`Found ${ids.length} unique Unsplash photo IDs. Fetching metadata via NAPI...`);

function fetchPhotoMetadata(id, callback) {
  // Extract the trailing alphanumeric ID from the photo ID (e.g. photo-1542291026-7eec264c27ff -> 7eec264c27ff)
  const idParts = id.split('-');
  const shortId = idParts[idParts.length - 1];

  const url = `https://unsplash.com/napi/photos/${shortId}`;
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  }, (res) => {
    if (res.statusCode !== 200) {
      callback(null, `HTTP Status ${res.statusCode}`);
      return;
    }
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const title = json.alt_description || json.description || 'No description';
        callback({
          id: id,
          title: title,
          tags: json.tags ? json.tags.map(t => t.title) : []
        });
      } catch (e) {
        callback(null, `JSON Parse Error: ${e.message}`);
      }
    });
  }).on('error', (err) => {
    callback(null, err.message);
  });
}

let completed = 0;
const results = [];

function runNext() {
  if (completed >= ids.length) {
    console.log("\n=== NAPI METADATA COMPLETED ===");
    fs.writeFileSync('scratch/unsplash_napi_metadata.json', JSON.stringify(results, null, 2), 'utf8');
    results.forEach(r => {
      if (r.error) {
        console.log(`❌ ID: ${r.id} | Error: ${r.error}`);
      } else {
        console.log(`✅ ID: ${r.id} | Title: ${r.title} | Tags: ${r.tags.slice(0, 5).join(', ')}`);
      }
    });
    return;
  }
  const id = ids[completed];
  fetchPhotoMetadata(id, (res, err) => {
    if (res) {
      results.push(res);
    } else {
      results.push({ id, error: err });
    }
    completed++;
    setTimeout(runNext, 250); // 250ms rate limit
  });
}

runNext();
