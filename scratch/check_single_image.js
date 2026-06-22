const fs = require('fs');
const https = require('https');

const url = 'https://images.unsplash.com/photo-ft2UhxkefwE?w=300&auto=format&fit=crop';
https.get(url, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const body = Buffer.concat(chunks);
    console.log('Body length:', body.length);
    console.log('First 100 bytes:', body.slice(0, 100).toString('utf8'));
    if (res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
    }
  });
});
