const fs = require('fs');
const vm = require('vm');
const https = require('https');
const path = require('path');

// Read products_v2.js
const productsContent = fs.readFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\products_v2.js', 'utf8');

// Append code to export PRODUCTS
const codeToRun = productsContent + "\nthis.PRODUCTS = PRODUCTS;";

const context = {};
vm.createContext(context);
vm.runInContext(codeToRun, context);

const products = context.PRODUCTS;
console.log(`Loaded ${products.length} products from catalog.`);

// Get unique image URLs
const urls = new Set();
products.forEach(p => {
  urls.add(p.image);
});

console.log(`Found ${urls.size} unique dynamically generated image URLs. Starting HEAD checks...`);

const results = [];
let pending = urls.size;

if (pending === 0) {
  console.log("No URLs to check.");
  process.exit(0);
}

for (const url of urls) {
  if (!url.startsWith('http')) {
    const localPath = path.join('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3', url);
    const exists = fs.existsSync(localPath);
    results.push({ url, status: exists ? 200 : 404 });
    if (--pending === 0) {
      report();
    }
  } else {
    https.request(url, { method: 'HEAD' }, (res) => {
      results.push({ url, status: res.statusCode });
      if (--pending === 0) {
        report();
      }
    }).on('error', (err) => {
      results.push({ url, status: 'ERROR: ' + err.message });
      if (--pending === 0) {
        report();
      }
    }).end();
  }
}

function report() {
  console.log("\n=== RUNTIME IMAGE VERIFICATION REPORT ===");
  let failures = 0;
  for (const r of results) {
    if (r.status !== 200) {
      console.log(`❌ FAIL [Status ${r.status}]: ${r.url}`);
      failures++;
    } else {
      console.log(`✅ OK   [Status ${r.status}]: ${r.url}`);
    }
  }
  console.log(`\nVerification complete. ${failures} failures found out of ${results.length} unique URLs.`);
  if (failures > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
