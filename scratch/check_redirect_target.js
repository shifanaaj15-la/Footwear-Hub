const https = require('https');
https.get('https://unsplash.com/napi/photos/c011aafb3c88', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Location:', res.headers.location);
});
