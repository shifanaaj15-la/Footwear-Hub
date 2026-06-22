const https = require('https');

function searchUnsplash(query, callback) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`;
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        callback(null, json.results);
      } catch (e) {
        callback(e);
      }
    });
  }).on('error', callback);
}

searchUnsplash('kids rain boots', (err, results) => {
  if (err) {
    console.error("Error searching:", err.message);
    return;
  }
  console.log("=== KIDS RAIN BOOTS SEARCH RESULTS ===");
  results.forEach((r, idx) => {
    console.log(`[${idx+1}] ID: photo-${r.id} | Description: ${r.description || r.alt_description}`);
  });
});
