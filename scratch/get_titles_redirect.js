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
console.log(`Found ${ids.length} unique Unsplash photo IDs. Fetching titles (following redirects)...`);

function fetchTitle(urlOrId, callback, redirectCount = 0) {
  if (redirectCount > 5) {
    callback(null, 'Too many redirects');
    return;
  }

  const url = urlOrId.startsWith('http') ? urlOrId : `https://unsplash.com/photos/${urlOrId}`;
  
  const req = https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let nextUrl = res.headers.location;
      if (nextUrl.startsWith('/')) {
        nextUrl = 'https://unsplash.com' + nextUrl;
      }
      fetchTitle(nextUrl, callback, redirectCount + 1);
      return;
    }

    if (res.statusCode !== 200) {
      callback(null, `HTTP Status ${res.statusCode}`);
      return;
    }

    let html = '';
    res.on('data', chunk => {
      html += chunk;
      if (html.includes('</title>')) {
        res.destroy();
      }
    });
    res.on('close', () => {
      const match = html.match(/<title>([^<]+)<\/title>/i);
      if (match) {
        callback(match[1].trim());
      } else {
        callback(null, 'No title tag found');
      }
    });
  });

  req.on('error', (err) => {
    callback(null, err.message);
  });
}

let completed = 0;
const results = [];

function runNext() {
  if (completed >= ids.length) {
    console.log("\n=== UNSPLASH IMAGE TITLES REPORT ===");
    results.forEach(r => {
      console.log(`ID: ${r.id} | Title: ${r.title || 'ERROR: ' + r.error}`);
    });
    fs.writeFileSync('scratch/unsplash_used_titles.json', JSON.stringify(results, null, 2), 'utf8');
    return;
  }
  const id = ids[completed];
  fetchTitle(id, (title, err) => {
    results.push({ id, title, error: err });
    console.log(`[${completed + 1}/${ids.length}] ID: ${id} -> ${title || 'ERROR: ' + err}`);
    completed++;
    setTimeout(runNext, 200);
  });
}

runNext();
