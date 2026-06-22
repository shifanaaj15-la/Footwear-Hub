const fs = require('fs');
const path = require('path');
const https = require('https');

// Read products_v2.js contents
const productsJsContent = fs.readFileSync('products_v2.js', 'utf8');

// We can evaluate or parse PRODUCTS. Since generateProducts is a function, let's extract PRODUCTS array by running it.
// We can use eval or run it in a VM, or just require it if we mock the environment.
// Let's mock a simple browser-like environment and eval products.js to get PRODUCTS.
const mockEnv = {
  PRODUCTS: null,
  console: console
};

const scriptCode = productsJsContent + `
; mockEnv.PRODUCTS = PRODUCTS;
`;

try {
  eval(scriptCode);
} catch (e) {
  console.error("Eval error:", e);
}

const products = mockEnv.PRODUCTS;
console.log(`Found ${products.length} products generated.`);

const results = [];
const outputDir = path.join(__dirname, 'product_images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function checkImage(prod, callback) {
  const url = prod.image;
  if (!url.startsWith('http')) {
    const localPath = path.join('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3', url);
    const exists = fs.existsSync(localPath);
    results.push({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      subCategory: prod.subCategory,
      url: url,
      status: exists ? 200 : 404,
      isHtml: false,
      filename: url
    });
    callback();
  } else {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const isHtml = body.slice(0, 50).toString().includes('<html') || body.slice(0, 50).toString().includes('<!DOCTYPE');
        const ext = isHtml ? 'html' : 'jpg';
        const filename = `${prod.id}_${prod.category}_${prod.subCategory.replace(/\s+/g, '_')}_${prod.brand}.${ext}`;
        const dest = path.join(outputDir, filename);
        fs.writeFileSync(dest, body);
        
        results.push({
          id: prod.id,
          name: prod.name,
          category: prod.category,
          subCategory: prod.subCategory,
          url: url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          size: body.length,
          isHtml: isHtml,
          filename: filename
        });
        callback();
      });
    }).on('error', (err) => {
      results.push({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        subCategory: prod.subCategory,
        url: url,
        status: 'ERROR',
        error: err.message
      });
      callback();
    });
  }
}

let completed = 0;
function runNext() {
  if (completed >= products.length) {
    fs.writeFileSync('scratch/all_products_verify.json', JSON.stringify(results, null, 2));
    console.log('Done checking all products!');
    
    // Log details of non-html, valid images that might be of interest
    const validImages = results.filter(r => !r.isHtml && r.status === 200);
    console.log(`Found ${validImages.length} valid images.`);
    validImages.forEach(vi => {
      console.log(`Valid: ID=${vi.id}, Name=${vi.name}, Category=${vi.category}, Sub=${vi.subCategory}, Size=${vi.size} bytes`);
    });
    return;
  }
  
  const prod = products[completed];
  checkImage(prod, () => {
    completed++;
    if (completed % 10 === 0) {
      console.log(`Progress: ${completed}/${products.length}...`);
    }
    setTimeout(runNext, 50); // 50ms delay
  });
}

runNext();
