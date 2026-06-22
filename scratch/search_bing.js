const https = require('https');
const fs = require('fs');

function searchBing(query, callback) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      // Find all unsplash photo URLs
      // E.g., unsplash.com/photos/xxx
      const regex = /unsplash\.com\/photos\/([a-zA-Z0-9\-]+)/g;
      const ids = new Set();
      let match;
      while ((match = regex.exec(data)) !== null) {
        const id = match[1];
        if (id.length > 5 && !['download', 'premium', 'license'].includes(id)) {
          ids.add(id);
        }
      }
      callback(null, Array.from(ids));
    });
  }).on('error', (err) => {
    callback(err);
  });
}

console.log("Searching Bing for flats...");
searchBing('site:unsplash.com/photos "flat shoes" OR "ballet flats" OR "loafers" OR "mules"', (err, flats) => {
  if (err) console.error("Error flats:", err.message);
  else {
    console.log(`Found ${flats.length} flats short IDs:`, flats);
    
    console.log("\nSearching Bing for sandals...");
    searchBing('site:unsplash.com/photos "sandals" OR "slides" OR "flip flops"', (err, sandals) => {
      if (err) console.error("Error sandals:", err.message);
      else {
        console.log(`Found ${sandals.length} sandals short IDs:`, sandals);
        fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\bing_candidates.json', JSON.stringify({ flats, sandals }, null, 2));
      }
    });
  }
});
