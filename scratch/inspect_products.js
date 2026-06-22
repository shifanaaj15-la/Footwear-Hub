const fs = require('fs');
const vm = require('vm');

const productsContent = fs.readFileSync('products.js', 'utf8');
const codeToRun = productsContent + "\nthis.PRODUCTS = PRODUCTS;";
const context = {};
vm.createContext(context);
vm.runInContext(codeToRun, context);
const products = context.PRODUCTS;

let output = "=== WOMEN COLLECTION PRODUCTS ===\n";
products.filter(p => p.category === 'women').forEach(p => {
  output += `${p.id} | ${p.name} | ${p.subCategory} | ${p.image}\n`;
});

output += "\n=== KIDS COLLECTION PRODUCTS ===\n";
products.filter(p => p.category === 'kids').forEach(p => {
  output += `${p.id} | ${p.name} | ${p.subCategory} | ${p.image}\n`;
});

fs.writeFileSync('scratch/products_inspect_output.txt', output, 'utf8');
console.log("Written output to scratch/products_inspect_output.txt");
