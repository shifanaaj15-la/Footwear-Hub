const https = require('https');

const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE8B2LICYw4QXdJSPS0eTfaIDI0ZlfQEivBcTzmB0ZpdR5mfJNUnEDsGF3jeDv6ynN2BbUaDEDbH1edoWLeUZrUtyfW69pXoUKskLnC4BkYldig3VXhboAkpMonfpybmrB84pWkBch748Ar12e968I1LM7BzSMW76mZCBig8axBYbGAIxLPumgNldW6acTjJXTYlldbToWx';

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  if (res.headers.location) {
    console.log('Redirecting to:', res.headers.location);
  }
}).on('error', err => {
  console.error('Error:', err.message);
});
