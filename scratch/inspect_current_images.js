const fs = require('fs');

const productsJsContent = fs.readFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/products.js', 'utf8');
let mockEnv = { PRODUCTS: null };
eval(productsJsContent + `\nmockEnv.PRODUCTS = PRODUCTS;`);

const products = mockEnv.PRODUCTS;
const imageToProducts = {};

products.forEach(p => {
  if (!imageToProducts[p.image]) {
    imageToProducts[p.image] = [];
  }
  imageToProducts[p.image].push(`${p.category} | ${p.brand} | ${p.name} (${p.subCategory})`);
});

console.log('=== UNIQUE IMAGES AND PRODUCTS USING THEM ===');
for (const [img, prods] of Object.entries(imageToProducts)) {
  console.log(`\nImage: ${img}`);
  prods.forEach(pr => console.log(`  - ${pr}`));
}
