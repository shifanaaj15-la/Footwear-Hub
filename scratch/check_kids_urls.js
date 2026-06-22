const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/all_products_verify.json', 'utf8'));

const kidsUrls = new Set();
data.filter(p => p.category === 'kids').forEach(p => {
  if (p.url.includes('unsplash.com')) {
    kidsUrls.add(p.url);
  }
});

console.log("=== KIDS URLS IN VERIFY JSON ===");
kidsUrls.forEach(url => console.log(url));
