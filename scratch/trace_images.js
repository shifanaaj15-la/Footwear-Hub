const fs = require('fs');

// We will read products_v2.js and inject tracing
let code = fs.readFileSync('products_v2.js', 'utf8');

// Modify generateProducts to save trace info
code = code.replace(
  'function generateProducts() {',
  'function generateProducts() {\n  const trace = {};\n  global.trace = trace;'
);

code = code.replace(
  'products.push({',
  'trace[brand + " " + styleName] = { subCat, image: imageUrl };\n        products.push({'
);

eval(code + '\ngenerateProducts();');

const targets = [
  'Skechers Luxe Foam Sandals',
  'Nike Vista Slide Sandals',
  'Puma Softride Comfort Slides',
  'Woodland Mountain Walk Sandals',
  'Skechers Reggae Strap Sandals',
  'Skechers Beverly Slingback Heels',
  'Puma Suede Platform Sandals'
];

targets.forEach(t => {
  console.log(`${t} =>`, global.trace[t]);
});
