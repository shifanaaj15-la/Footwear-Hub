const fs = require('fs');
const vm = require('vm');

const productsContent = fs.readFileSync('products_v2.js', 'utf8');
const codeToRun = productsContent + "\nthis.PRODUCTS = PRODUCTS;";
const context = {};
vm.createContext(context);
vm.runInContext(codeToRun, context);
const products = context.PRODUCTS;

console.log("=== ACTUAL CURRENT KIDS IMAGES ===");
products.filter(p => p.category === 'kids').forEach(p => {
  console.log(`${p.id} | ${p.name} | ${p.subCategory} | ${p.image}`);
});
