const fs = require('fs');
const vm = require('vm');

const productsContent = fs.readFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\products.js', 'utf8');

// Append code to export PRODUCTS to a global object in the VM
const codeToRun = productsContent + "\nthis.PRODUCTS = PRODUCTS;";

const context = {};
vm.createContext(context);
vm.runInContext(codeToRun, context);

const products = context.PRODUCTS;
const womensProducts = products.filter(p => p.category === 'women');

console.log(`Total women products: ${womensProducts.length}`);
womensProducts.forEach((p, index) => {
  console.log(`${index + 1}. [${p.id}] ${p.name} - SubCategory: ${p.subCategory}`);
  console.log(`   Image: ${p.image}`);
});
