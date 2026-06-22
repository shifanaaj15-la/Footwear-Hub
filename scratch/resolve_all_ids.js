const fs = require('fs');
const https = require('https');
const path = require('path');

// Read products.js contents
const productsJsContent = fs.readFileSync('products.js', 'utf8');

// Evaluate products.js, making PRODUCTS global
try {
  const modifiedCode = productsJsContent.replace('const PRODUCTS =', 'global.PRODUCTS =');
  eval(modifiedCode);
} catch (e) {
  console.error("Eval error:", e);
  process.exit(1);
}

// Check if PRODUCTS is defined
if (typeof global.PRODUCTS === 'undefined') {
  console.error("PRODUCTS is undefined.");
  process.exit(1);
}

const PRODUCTS = global.PRODUCTS;

// Extract all unique short IDs from PRODUCTS
const shortIds = new Set();
PRODUCTS.forEach(p => {
  // Extract ID from URL e.g. https://images.unsplash.com/photo-inEofFg2Vwg?w=600...
  const match = p.image.match(/images\.unsplash\.com\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const id = match[1];
    // If it doesn't start with photo- followed by a digit, it's a short ID
    if (!id.startsWith('photo-1') && !id.startsWith('photo-2') && !id.startsWith('photo-3') && !id.startsWith('photo-4') && !id.startsWith('photo-5') && !id.startsWith('photo-6') && !id.startsWith('photo-7') && !id.startsWith('photo-8') && !id.startsWith('photo-9') && !id.startsWith('photo-0')) {
      const cleanId = id.replace(/^photo-/, '');
      shortIds.add(cleanId);
    }
  }
});

const idList = Array.from(shortIds);
console.log(`Found ${idList.length} unique short IDs to resolve.`);

const resolvedMap = {};
const cacheFile = 'scratch/resolved_ids_map.json';
if (fs.existsSync(cacheFile)) {
  Object.assign(resolvedMap, JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
}

function resolveId(id, callback) {
  if (resolvedMap[id]) {
    callback(null, resolvedMap[id]);
    return;
  }
  
  const url = `https://unsplash.com/photos/${id}`;
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let redirectUrl = res.headers.location;
      if (redirectUrl.startsWith('/')) {
        redirectUrl = 'https://unsplash.com' + redirectUrl;
      }
      resolveByUrl(redirectUrl, callback);
    } else {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.includes('images.unsplash.com/photo-')) {
          res.destroy();
        }
      });
      res.on('close', () => {
        const match = data.match(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
        if (match) {
          callback(null, 'photo-' + match[1]);
        } else {
          callback(new Error(`Not found in HTML (Status: ${res.statusCode})`));
        }
      });
    }
  }).on('error', callback);
}

function resolveByUrl(url, callback) {
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
      if (data.includes('images.unsplash.com/photo-')) {
        res.destroy();
      }
    });
    res.on('close', () => {
      const match = data.match(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
      if (match) {
        callback(null, 'photo-' + match[1]);
      } else {
        callback(new Error(`Not found in HTML (Status: ${res.statusCode})`));
      }
    });
  }).on('error', callback);
}

let completed = 0;
const errors = [];

function runNext() {
  if (completed >= idList.length) {
    console.log('\nAll IDs processed!');
    fs.writeFileSync(cacheFile, JSON.stringify(resolvedMap, null, 2));
    console.log(`Resolved: ${Object.keys(resolvedMap).length}/${idList.length}`);
    if (errors.length > 0) {
      console.log(`Errors encountered: ${errors.length}`);
      console.log(errors.slice(0, 10));
    }
    return;
  }
  
  const id = idList[completed];
  console.log(`Resolving [${completed + 1}/${idList.length}] ${id}...`);
  
  resolveId(id, (err, longId) => {
    if (err) {
      console.log(`❌ Failed for ${id}: ${err.message}`);
      errors.push({ id, error: err.message });
    } else {
      console.log(`✅ ${id} -> ${longId}`);
      resolvedMap[id] = longId;
    }
    
    completed++;
    // Write cache periodically
    if (completed % 10 === 0) {
      fs.writeFileSync(cacheFile, JSON.stringify(resolvedMap, null, 2));
    }
    setTimeout(runNext, 200); // 200ms delay
  });
}

runNext();
