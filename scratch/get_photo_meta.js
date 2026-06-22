const https = require('https');

const photoIds = [
  // Women heels
  "photo-1522056683100-34f2f60f0094",
  "photo-1637003833874-971d4da7eea6",
  "photo-1551489186-ccb95a1ea6a3",
  "photo-1524553879936-2ff074ae5816",
  "photo-1718312267162-df826f8ce45f",
  "photo-1582966772680-860e372bb558",
  "photo-1515347619252-60a4bf4fff4f",
  "photo-1573100925118-870b8efc799d",
  "photo-1531310197839-ccf54634509e",
  "photo-1595341888016-a392ef81b7de",

  // Kids sports/slippers/sandals/casual
  "photo-1515621061946-eff1c2a352bd",
  "photo-1542291026-7eec264c27ff",
  "photo-1604902396830-aca29e19b067",
  "photo-1516478177764-9fe5bd7e9717",
  "photo-1608256246200-53e635b5b65f",
  "photo-1535043934128-cf0b28d52f95",
  "photo-1603487742131-4160ec999306",
  "photo-1491897554428-130a60dd4757",
  "photo-1603808033192-082d6919d3e1",
  "photo-1582588678413-dbf45f4823e9",
  "photo-1597045566677-8cf032ed6634",
  "photo-1699205017793-f69fb69502d2",
  "photo-1607522370275-f14206abe5d3"
];

function fetchMetadata(id) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/photos/${id}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Extract meta tag title
        const match = data.match(/<title>([^<]+)<\/title>/i);
        const title = match ? match[1] : 'Unknown';
        // Extract meta description
        const descMatch = data.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || data.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
        const desc = descMatch ? descMatch[1] : '';
        resolve({ id, title, desc });
      });
    }).on('error', (err) => {
      resolve({ id, error: err.message });
    });
  });
}

async function main() {
  console.log("Fetching Unsplash photo descriptions...");
  for (const id of photoIds) {
    const meta = await fetchMetadata(id);
    console.log(`\nID: ${meta.id}`);
    console.log(`Title: ${meta.title}`);
    console.log(`Desc: ${meta.desc || 'none'}`);
  }
}

main();
