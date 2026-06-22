const fs = require('fs');

try {
  // Mock browser global environment if needed
  const productsJsContent = fs.readFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/products_v2.js', 'utf8');
  
  // Set up mock window and global PRODUCTS
  let mockEnv = { PRODUCTS: null };
  const evalCode = productsJsContent + `\nmockEnv.PRODUCTS = PRODUCTS;`;
  
  eval(evalCode);
  
  const products = mockEnv.PRODUCTS;
  console.log(`\n✅ products.js loaded successfully!`);
  console.log(`✅ Total products generated: ${products.length}`);
  
  if (products.length !== 30) {
    console.error(`❌ Expected 30 products, but found ${products.length}`);
    process.exit(1);
  }
  
  // Check women and kids collections for duplicates
  const categories = ['women', 'kids'];
  
  categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat);
    console.log(`\n=== Checking Category: ${cat} (${catProducts.length} products) ===`);
    
    // 1. Group by image and count occurrences
    const imgCounts = {};
    catProducts.forEach(p => {
      imgCounts[p.image] = (imgCounts[p.image] || 0) + 1;
    });
    
    console.log(`Unique images count: ${Object.keys(imgCounts).length}`);
    
    // Find any image appearing more than twice
    const duplicatedMoreThanTwice = Object.entries(imgCounts).filter(([img, count]) => count > 3);
    if (duplicatedMoreThanTwice.length > 0) {
      console.log(`⚠️ Warning: Some images appear more than 3 times in ${cat}:`);
      duplicatedMoreThanTwice.forEach(([img, count]) => {
        console.log(`  - Image: ${img} -> Count: ${count}`);
      });
    } else {
      console.log(`✅ No image appears more than 3 times in ${cat}!`);
    }
    
    // 2. Check if the same image repeats inside the same brand
    const brandImages = {};
    let brandDuplicates = 0;
    
    catProducts.forEach(p => {
      if (!brandImages[p.brand]) {
        brandImages[p.brand] = new Set();
      }
      if (brandImages[p.brand].has(p.image)) {
        console.error(`❌ Duplicate image inside brand "${p.brand}" for product "${p.name}" (${p.image})`);
        brandDuplicates++;
      }
      brandImages[p.brand].add(p.image);
    });
    
    if (brandDuplicates === 0) {
      console.log(`✅ No brand has duplicate images in ${cat}! All brands have unique product images.`);
    } else {
      console.log(`❌ Found ${brandDuplicates} brand duplicates in ${cat}!`);
    }
  });

} catch (err) {
  console.error('❌ Error evaluating products.js:', err);
  process.exit(1);
}
