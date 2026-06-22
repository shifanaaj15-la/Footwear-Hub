const https = require('https');
const fs = require('fs');

const shortIds = [
  'LyJAczPSwo0', // Person wearing black leather sandals
  'O7VitJRFBvE'  // swimming-shoes-hanging-on-display-O7VitJRFBvE
];

let pending = shortIds.length;
const results = {};

function resolveId(id) {
  const url = `https://unsplash.com/photos/${id}`;
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const match = data.match(/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
      if (match) {
        results[id] = 'photo-' + match[1];
        console.log(`✅ ${id} -> photo-${match[1]}`);
      } else {
        console.log(`❌ Failed to resolve ${id}`);
      }
      if (--pending === 0) {
        fs.writeFileSync('scratch/resolved_target_ids.json', JSON.stringify(results, null, 2));
        console.log('Saved all resolved IDs!');
      }
    });
  }).on('error', (err) => {
    console.log(`❌ Error for ${id}: ${err.message}`);
    if (--pending === 0) {
      fs.writeFileSync('scratch/resolved_target_ids.json', JSON.stringify(results, null, 2));
      console.log('Saved all resolved IDs!');
    }
  });
}

shortIds.forEach(id => {
  resolveId(id);
});
