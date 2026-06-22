const https = require('https');

const shortIds = [
  'vJ7yX4zO1_Y', // confetti heels
  'LQD3z0oWkWg', // woman wearing stiletto shoes
  'FXSyAke1cw6', // black high heels on floor
  'ERER0sBF080', // four women assorted heels
  'En73x4XxINf', // legs in black high heels
  'G61i59FQ_Ke', // Paola Aguilar red high heels bows
  '7Udyewc9ZmP', // Luis Quintero black stiletto heels
  'GrKf5ct3HP4', // Gold high heels with red rose
  'GAR3HX1Zgpf', // Viliman black-and-gray stiletto
  'HPsN5nIGQN0', // red stiletto sandals
  'G73431DwrGx'  // Eric Nopanen platform heels
];

function get(url, callback) {
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let redirectUrl = res.headers.location;
      if (redirectUrl.startsWith('/')) {
        redirectUrl = 'https://unsplash.com' + redirectUrl;
      }
      get(redirectUrl, callback);
    } else {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        callback(null, data, res.statusCode);
      });
    }
  }).on('error', (err) => {
    callback(err);
  });
}

console.log("Fetching long photo IDs with redirects...");
let pending = shortIds.length;

for (const shortId of shortIds) {
  get(`https://unsplash.com/photos/${shortId}`, (err, data, statusCode) => {
    if (err) {
      console.log(`❌ ${shortId} -> Error: ${err.message}`);
    } else {
      const match = data.match(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/);
      if (match) {
        console.log(`✅ ${shortId} -> photo-${match[1]}`);
      } else {
        console.log(`❌ ${shortId} -> Not found in HTML (status ${statusCode})`);
      }
    }
    if (--pending === 0) process.exit(0);
  });
}
