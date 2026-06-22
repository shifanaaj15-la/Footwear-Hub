const https = require('https');
const fs = require('fs');

const slugs = [
  'red-ballet-flats-with-bows-on-blue-tights',
  'lime-green-ballet-flats-with-sheer-socks',
  'red-polka-dot-tights-and-spotted-ballet-flats',
  'sparkling-ballet-flats-with-colorful-string-lights',
  'brown-and-white-flat-shoes-on-white-textile',
  'pair-of-beige-flat-shoes',
  'black-open-toe-ankle-strap-heeled-sandals',
  'feet-in-stylish-sandals',
  'silver-open-toe-ankle-strap-heeled-sandals',
  'pair-of-brown-leather-shoes-on-white-table-vJ7yX4zO1_Y',
  'womans-legs-wearing-yellow-tights-and-orange-shoes-0QKVmna7nx4'
];

const resolved = [];
let pending = slugs.length;

slugs.forEach(slug => {
  const url = `https://unsplash.com/photos/${slug}`;
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let redirectUrl = res.headers.location;
      if (redirectUrl.startsWith('/')) {
        redirectUrl = 'https://unsplash.com' + redirectUrl;
      }
      resolveUrl(redirectUrl, slug);
    } else {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        parseHtml(data, slug);
      });
    }
  }).on('error', (err) => {
    console.error(`Error requesting ${slug}:`, err.message);
    decrement();
  });
});

function resolveUrl(url, slug) {
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      parseHtml(data, slug);
    });
  }).on('error', (err) => {
    console.error(`Error requesting resolved URL for ${slug}:`, err.message);
    decrement();
  });
}

function parseHtml(html, slug) {
  const match = html.match(/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
  if (match) {
    const longId = 'photo-' + match[1];
    console.log(`✅ Resolved ${slug} -> ${longId}`);
    resolved.push({ slug, longId });
  } else {
    console.log(`❌ Failed to find photo ID in HTML for ${slug}`);
  }
  decrement();
}

function decrement() {
  if (--pending === 0) {
    console.log("\n=== RESOLVED SLUGS ===");
    console.log(JSON.stringify(resolved, null, 2));
    fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\resolved_slugs.json', JSON.stringify(resolved, null, 2));
  }
}
