const https = require('https');
const fs = require('fs');

const ids = JSON.parse(fs.readFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\logs_photos.json', 'utf8'));

console.log(`Starting verification of ${ids.length} photo IDs...`);

const results = [];
let pending = ids.length;

ids.forEach(id => {
  const url = `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop`;
  const req = https.request(url, { method: 'HEAD' }, (res) => {
    results.push({ id, status: res.statusCode });
    if (--pending === 0) {
      finish();
    }
  });
  
  req.on('error', (err) => {
    results.push({ id, status: 'ERROR: ' + err.message });
    if (--pending === 0) {
      finish();
    }
  });
  
  req.end();
});

function finish() {
  console.log("\n=== VERIFICATION RESULTS ===");
  const successIds = results.filter(r => r.status === 200).map(r => r.id);
  console.log(`Successful IDs (${successIds.length}):`);
  console.log(JSON.stringify(successIds, null, 2));
  
  fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\valid_photos.json', JSON.stringify(successIds, null, 2));
  console.log("\nSaved valid IDs to scratch/valid_photos.json");
}
