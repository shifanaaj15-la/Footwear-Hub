const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  women_standing: "https://images.unsplash.com/photo-1524553879936-2ff074ae5816?w=300",
  socks: "https://images.unsplash.com/photo-1551489186-ccb95a1ea6a3?w=300",
  kids_face: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=300",
  kids_nail: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=300",
  kids_unknown: "https://images.unsplash.com/photo-1699205017793-f69fb69502d2?w=300"
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        download(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const name in images) {
    const dest = path.join(__dirname, `${name}.jpg`);
    console.log(`Downloading ${name} to ${dest}...`);
    try {
      await download(images[name], dest);
      console.log(`Successfully downloaded ${name}`);
    } catch (e) {
      console.error(`Failed to download ${name}: ${e.message}`);
    }
  }
}

main();
