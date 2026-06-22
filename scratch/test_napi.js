const https = require('https');

function fetchPhotos(query, callback) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=30`;
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        callback(null, json);
      } catch (e) {
        callback(new Error(`Failed to parse JSON: ${e.message}. Status: ${res.statusCode}. Body preview: ${data.substring(0, 200)}`));
      }
    });
  }).on('error', (err) => {
    callback(err);
  });
}

console.log("Testing napi query for 'women heels'...");
fetchPhotos('women heels', (err, result) => {
  if (err) {
    console.error("❌ Error:", err.message);
  } else {
    console.log("✅ Success!");
    console.log(`Total photos returned: ${result.results ? result.results.length : 0}`);
    if (result.results && result.results.length > 0) {
      console.log("Sample photo ID:", result.results[0].id);
      console.log("Sample photo description:", result.results[0].description || result.results[0].alt_description);
    }
  }
});
