const fs = require('fs');
const path = require('path');

const logsPhotos = JSON.parse(fs.readFileSync('scratch/logs_photos.json', 'utf8'));
const validPhotos = JSON.parse(fs.readFileSync('scratch/valid_photos.json', 'utf8'));

// Read products.js kids photo IDs
const productsJsContent = fs.readFileSync('products.js', 'utf8');
const kidsIds = [];
const regex = /photo-[0-9a-zA-Z\-]+/g;
let match;
while ((match = regex.exec(productsJsContent)) !== null) {
  if (!kidsIds.includes(match[0])) {
    kidsIds.push(match[0]);
  }
}

console.log('Logs Photos count:', logsPhotos.length);
console.log('Valid Photos count:', validPhotos.length);
console.log('Kids Photos count:', kidsIds.length);

const allIds = new Set();
logsPhotos.forEach(id => allIds.add(id));
validPhotos.forEach(id => allIds.add(id));
kidsIds.forEach(id => allIds.add(id));

console.log('Total unique IDs combined:', allIds.size);
console.log(Array.from(allIds).slice(0, 20));
