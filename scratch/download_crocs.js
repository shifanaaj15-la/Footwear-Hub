const fs = require('fs');
const https = require('https');

const url = 'https://images.unsplash.com/photo-1506898667547-42e22a46b827?w=300&auto=format&fit=crop';
const file = fs.createWriteStream('scratch/crocs_verify.jpg');
https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close(() => console.log('Downloaded!'));
  });
});
