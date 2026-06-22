const fs = require('fs');

const productsJs = fs.readFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/products.js', 'utf8');
const validPhotos = JSON.parse(fs.readFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/scratch/valid_photos.json', 'utf8'));

// Extract all photo-xxx IDs from products.js
const usedIds = new Set(productsJs.match(/photo-[a-zA-Z0-9\-]+/g) || []);
console.log('Total used IDs in products.js:', usedIds.size);

const unusedIds = validPhotos.filter(id => !usedIds.has(id));
console.log('Unused IDs in valid_photos.json:', unusedIds.length);
console.log(JSON.stringify(unusedIds, null, 2));
