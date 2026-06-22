const https = require('https');
const urlModule = require('url');

function fetchUrl(url, redirectCount = 0) {
  if (redirectCount > 5) {
    return Promise.reject(new Error("Too many redirects"));
  }
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

function verifyPhoto(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=600&auto=format&fit=crop`;
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => {
      resolve({ id, status: 'ERROR' });
    }).end();
  });
}

async function main() {
  try {
    console.log("Fetching Unsplash women-sandals and women-slides pages...");
    const html1 = await fetchUrl('https://unsplash.com/s/photos/women-sandals');
    const html2 = await fetchUrl('https://unsplash.com/s/photos/women-slides');

    const regex = /photo-([0-9]{10,}-[0-9a-f]{10,})/g;
    const ids = new Set();

    [html1, html2].forEach((html) => {
      let match;
      while ((match = regex.exec(html)) !== null) {
        ids.add(match[1]);
      }
    });

    const foundIds = Array.from(ids);
    console.log(`Found ${foundIds.length} candidate photo IDs. Verifying them...`);

    const verifications = [];
    for (const id of foundIds.slice(0, 30)) {
      verifications.push(verifyPhoto(id));
    }

    const results = await Promise.all(verifications);
    const valid = results.filter(r => r.status === 200).map(r => 'photo-' + r.id);
    console.log("Verified working photo IDs:");
    console.log(JSON.stringify(valid, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
