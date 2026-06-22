const https = require('https');
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
        const id = match[1];
        // Short IDs are usually 11 characters (like Am855HvqYWQ) or slug-shortId
        const parts = id.split('-');
        const shortId = parts[parts.length - 1];
        if (shortId.length >= 8 && shortId.length <= 12 && !['download', 'premium', 'license'].includes(shortId)) {
          ids.add(shortId);
        }
      }
      callback(null, Array.from(ids));
    });
  }).on('error', (err) => {
    callback(err);
  });
}

function resolveShortId(shortId, callback) {
  const url = `https://unsplash.com/photos/${shortId}`;
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let redirectUrl = res.headers.location;
      if (redirectUrl.startsWith('/')) {
        redirectUrl = 'https://unsplash.com' + redirectUrl;
      }
      resolveShortIdByUrl(redirectUrl, callback);
    } else {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const match = data.match(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
        if (match) {
          callback(null, 'photo-' + match[1]);
        } else {
          callback(new Error(`Not found in HTML (status ${res.statusCode})`));
        }
      });
    }
  }).on('error', (err) => {
    callback(err);
  });
}

function resolveShortIdByUrl(url, callback) {
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      const match = data.match(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
      if (match) {
        callback(null, 'photo-' + match[1]);
      } else {
        callback(new Error(`Not found in HTML (status ${res.statusCode})`));
      }
    });
  }).on('error', (err) => {
    callback(err);
  });
}

// Let's run searches for heels, flats, sandals
console.log("Searching for heels...");
searchDDG('site:unsplash.com/photos heels', (err, heels) => {
  console.log(`Found heels short IDs:`, heels);
  
  console.log("\nSearching for flats...");
  searchDDG('site:unsplash.com/photos flats', (err, flats) => {
    console.log(`Found flats short IDs:`, flats);
    
    console.log("\nSearching for sandals...");
    searchDDG('site:unsplash.com/photos sandals', (err, sandals) => {
      console.log(`Found sandals short IDs:`, sandals);
      
      // Let's resolve them
      const all = { heels: heels || [], flats: flats || [], sandals: sandals || [] };
      const resolved = { heels: [], flats: [], sandals: [] };
      
      let totalToResolve = all.heels.length + all.flats.length + all.sandals.length;
      if (totalToResolve === 0) {
        console.log("No IDs found to resolve.");
        return;
      }
      
      console.log(`\nResolving ${totalToResolve} short IDs to long photo- IDs...`);
      
      function checkFinish() {
        if (--totalToResolve === 0) {
          console.log("\n=== RESOLVED DATABASE ===");
          console.log(JSON.stringify(resolved, null, 2));
          fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\resolved_unsplash_footwear.json', JSON.stringify(resolved, null, 2));
        }
      }
      
      for (const [key, list] of Object.entries(all)) {
        list.forEach(shortId => {
          resolveShortId(shortId, (err, longId) => {
            if (err) {
              console.log(`❌ Failed to resolve ${shortId}: ${err.message}`);
            } else {
              console.log(`✅ Resolved ${shortId} -> ${longId}`);
              // Check if valid
              const testUrl = `https://images.unsplash.com/${longId}?w=600&auto=format&fit=crop`;
              https.request(testUrl, { method: 'HEAD' }, (res) => {
                if (res.statusCode === 200) {
                  resolved[key].push(longId);
                  console.log(`   Verified ${longId} is 200 OK`);
                } else {
                  console.log(`   ❌ Verified ${longId} is status ${res.statusCode}`);
                }
                checkFinish();
              }).on('error', (e) => {
                console.log(`   ❌ Verified ${longId} failed request: ${e.message}`);
                checkFinish();
              }).end();
            }
          });
        });
      }
    });
  });
});
