const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/scratch/all_products_verify.json', 'utf8'));
const kids = data.filter(p => p.category === 'kids');
console.log('Number of kids products:', kids.length);
if (kids.length > 0) {
  console.log('First 5 kids products:');
  console.log(JSON.stringify(kids.slice(0, 5), null, 2));
}
const women = data.filter(p => p.category === 'women');
console.log('Number of women products:', women.length);
if (women.length > 0) {
  console.log('First 5 women products:');
  console.log(JSON.stringify(women.slice(0, 5), null, 2));
}
