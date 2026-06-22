const fs = require('fs');
const path = require('path');
const https = require('https');

// Women image pools from products.js
const womenImagePools = {
  Nike: [
    "inEofFg2Vwg", "E-0ON3VGrBc", "jMlig2nx1-Y", "ndpX28miBtE", "AlX5260JnmI",
    "qAyOt0aGsCo", "9urrzNhb3PU", "rwPgd0xV6OI", "be4eoee4who", "Az3yuE3out0"
  ],
  Adidas: [
    "Plg3KC7cV0o", "vdwjtE9CPbg", "6mf2k5D9BXM", "wSct4rrBPWc", "kq_u6MiZn1Q",
    "VKtBDgIEA6o", "s7TceQs70xs", "LyJAczPSwo0", "nTu4n0fpRho", "I7GHd8PlZqc"
  ],
  Puma: [
    "BI9NjChWn6s", "i8kU0JVChYQ", "sl963NLr3bI", "NepvJNg0iXU", "pEzLon__DfM",
    "rWxwWWPw18w", "ZFbjnFi_OGY", "mScK9E98YlU", "u8bTCVoJCP8", "xioSQGPadkM"
  ],
  Bata: [
    "k4ompjyinaw", "3wyBsFMwiK0", "NK8IXWUCJzA", "OfvV-jkgrfQ", "NySU2CFS9Eo",
    "mr6ZCUrbVLA", "k4brty7aG3Y", "_OHt-yZsbkw", "E5ICkuVsOeA", "YaGradww2RI"
  ],
  Woodland: [
    "62GjTkG9_dM", "E0OeYD_iMA4", "RqN9cHrbpFo", "b3b1UfKGIBQ", "vuJT_ZnOKhc",
    "EGaajAjP59M", "UR-0lB0sDTA", "OoHQlF--Y98", "W0HLndqm5yo", "MxKdjnvUAyg"
  ],
  Skechers: [
    "rtHNDn_K9VE", "doWWh6i5t_o", "1Ge9sFmTT3w", "aCR_KE3vg7U", "ktC55rClFAs",
    "yQY7fyckKk8", "hhZoxX2mnno", "fQ63HUDGgQ0", "cIbBEIhSnLY", "28d3E6aUE4Y"
  ],
  Crocs: [
    "Npfc_s9Uisc", "hiEy8kd4RPk", "fXMSxZKSj64", "PSqDpQoeD14", "NS4WNA5d1M0",
    "mxI4vrblBPI", "DyUDs65NmBk", "UYfROytezSo", "_iLzYaOnUTI", "ZnKNLpZR3Bs"
  ]
};

const outputDir = path.join(__dirname, 'women_imgs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function downloadImage(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Follow redirect
      downloadImage(response.headers.location, dest, callback);
      return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading ${url}:`, err.message);
    callback(err);
  });
}

const downloadTasks = [];
for (const brand in womenImagePools) {
  womenImagePools[brand].forEach((id, idx) => {
    const prefix = id.startsWith('photo-') ? '' : 'photo-';
    const url = `https://images.unsplash.com/${prefix}${id}?w=300&auto=format&fit=crop`;
    const dest = path.join(outputDir, `${brand}_${idx + 1}_${id}.jpg`);
    downloadTasks.push({ url, dest, name: `${brand} #${idx + 1} (${id})` });
  });
}

console.log(`Starting download of ${downloadTasks.length} images...`);

let completed = 0;
function runNext() {
  if (completed >= downloadTasks.length) {
    console.log('All downloads completed!');
    return;
  }
  const task = downloadTasks[completed];
  console.log(`Downloading [${completed + 1}/${downloadTasks.length}] ${task.name}...`);
  downloadImage(task.url, task.dest, () => {
    completed++;
    runNext();
  });
}

runNext();
