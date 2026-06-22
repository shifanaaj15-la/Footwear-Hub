const https = require('https');
const fs = require('fs');
const urlModule = require('url');

function fetchUrl(url, redirectCount = 0) {
  if (redirectCount > 5) {
    return Promise.reject(new Error("Too many redirects"));
  }
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = urlModule.resolve(url, res.headers.location);
        console.log(`Redirecting to: ${nextUrl}`);
        resolve(fetchUrl(nextUrl, redirectCount + 1));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status Code: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  try {
    console.log("Fetching Unsplash page with redirect support...");
    const shoeHtml = await fetchUrl('https://unsplash.com/s/photos/shoes');
    const sneakerHtml = await fetchUrl('https://unsplash.com/s/photos/sneakers');
    const bootHtml = await fetchUrl('https://unsplash.com/s/photos/boots');

    // Regex to match Unsplash photo ID strings
    const regex = /photo-([0-9]{10,}-[0-9a-f]{10,})/g;
    const ids = new Set();

    [shoeHtml, sneakerHtml, bootHtml].forEach((html, i) => {
      let match;
      let count = 0;
      while ((match = regex.exec(html)) !== null) {
        ids.add(match[1]);
        count++;
      }
      console.log(`Page ${i} matched ${count} times.`);
    });

    const photoIds = Array.from(ids);
    console.log(`Successfully fetched ${photoIds.length} unique shoe photo IDs.`);
    fs.writeFileSync('scratch/photo_ids.json', JSON.stringify(photoIds, null, 2));
    
    console.log("Sample IDs:", photoIds.slice(0, 50));
  } catch (error) {
    console.error('Error fetching shoe photo IDs:', error);
  }
}

main();
