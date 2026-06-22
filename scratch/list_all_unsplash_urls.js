const fs = require('fs');

const files = [
  'c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\products.js',
  'c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\app.js',
  'c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\index.html'
];

const urls = new Set();

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-\?&=\._%]+/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.add(match[0]);
    }
  }
});

console.log(`Found ${urls.size} unique Unsplash URLs in codebase:`);
Array.from(urls).sort().forEach(url => {
  console.log(url);
});
