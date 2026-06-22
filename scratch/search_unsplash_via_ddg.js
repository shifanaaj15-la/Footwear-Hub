const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');

function searchDDG(query, callback) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      const regex = /unsplash\.com\/photos\/([a-zA-Z0-9\-]+)/g;
      const ids = new Set();
      let match;
      while ((match = regex.exec(data)) !== null) {
        // Skip common landing pages or words
        const id = match[1];
        if (id.length > 5 && !['download', 'premium', 'license', 'heels', 'flats', 'sandals'].includes(id)) {
          ids.add(id);
        }
      }
      callback(null, Array.from(ids));
    });
  }).on('error', (err) => {
    callback(err);
  });
}

console.log("Searching DuckDuckGo for heels...");
searchDDG('site:unsplash.com/photos heels', (err, heels) => {
  if (err) console.error("Error heels:", err.message);
  else {
    console.log(`Found ${heels.length} heels candidates:`, heels);
    
    console.log("\nSearching DuckDuckGo for flats...");
    searchDDG('site:unsplash.com/photos flat shoes OR ballet flats', (err, flats) => {
      if (err) console.error("Error flats:", err.message);
      else {
        console.log(`Found ${flats.length} flats candidates:`, flats);
        
        console.log("\nSearching DuckDuckGo for sandals...");
        searchDDG('site:unsplash.com/photos women sandals', (err, sandals) => {
          if (err) console.error("Error sandals:", err.message);
          else {
            console.log(`Found ${sandals.length} sandals candidates:`, sandals);
            
            // Save candidates
            fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\ddg_candidates.json', JSON.stringify({ heels, flats, sandals }, null, 2));
          }
        });
      }
    });
  }
});
