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
    console.log("Fetching Unsplash men sandals/slides pages...");
    const sandalsHtml = await fetchUrl('https://unsplash.com/s/photos/men-sandals');
    const slidesHtml = await fetchUrl('https://unsplash.com/s/photos/men-slides');
    const flipflopsHtml = await fetchUrl('https://unsplash.com/s/photos/flip-flops');

    const regex = /photo-([0-9]{10,}-[0-9a-f]{10,})/g;
    const ids = new Set();

    [sandalsHtml, slidesHtml, flipflopsHtml].forEach((html, i) => {
      let match;
      while ((match = regex.exec(html)) !== null) {
        ids.add(match[1]);
      }
    });

    const photoIds = Array.from(ids);
    console.log(`Found ${photoIds.length} unique photo IDs.`);
    console.log(JSON.stringify(photoIds.slice(0, 40), null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
