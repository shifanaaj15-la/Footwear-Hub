const fs = require('fs');
const https = require('https');

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

const ids = [];
for (const brand in womenImagePools) {
  womenImagePools[brand].forEach(id => {
    if (!ids.includes(id)) ids.push(id);
  });
}

console.log(`Fetching titles for ${ids.length} unique IDs...`);

function fetchTitle(id, callback) {
  const url = `https://unsplash.com/photos/${id}`;
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      callback(null, `HTTP Status ${res.statusCode}`);
      return;
    }
    let html = '';
    res.on('data', chunk => {
      html += chunk;
      // Truncate to save memory after title tag
      if (html.includes('</title>')) {
        res.destroy();
      }
    });
    res.on('close', () => {
      const match = html.match(/<title>([^<]+)<\/title>/i);
      if (match) {
        callback(match[1].trim());
      } else {
        callback(null, 'No title tag found');
      }
    });
  }).on('error', (err) => {
    callback(null, err.message);
  });
}

let completed = 0;
const results = [];

function runNext() {
  if (completed >= ids.length) {
    fs.writeFileSync('scratch/titles_results.json', JSON.stringify(results, null, 2));
    console.log('Done! Results written to scratch/titles_results.json');
    results.forEach(r => {
      if (r.title && (r.title.toLowerCase().includes('tv') || r.title.toLowerCase().includes('television') || r.title.toLowerCase().includes('monitor') || r.title.toLowerCase().includes('screen'))) {
        console.log(`Potential Match: ID: ${r.id}, Title: ${r.title}`);
      }
    });
    return;
  }
  const id = ids[completed];
  fetchTitle(id, (title, err) => {
    results.push({ id, title, error: err });
    completed++;
    // Sleep 100ms to be polite to Unsplash
    setTimeout(runNext, 100);
  });
}

runNext();
