const https = require('https');

const heelsIds = [
  'photo-1522056683100-34f2f60f0094',
  'photo-1524553879936-2ff074ae5816',
  'photo-1515347619252-60a4bf4fff4f',
  'photo-1718312267162-df826f8ce45f',
  'photo-1551489186-ccb95a1ea6a3',
  'photo-1637003833874-971d4da7eea6',
  'photo-1562687848-c1664eff566d',
  'photo-1573100925118-870b8efc799d',
  'photo-1559669615-c03ba52afc37',
  'photo-1457972899686-77aec5e247ce',
  'premium_photo-1671028365111-cec8e5a95a87'
];

let pending = heelsIds.length;
const results = [];

for (const id of heelsIds) {
  const url = `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop`;
  https.request(url, { method: 'HEAD' }, (res) => {
    results.push({ id, status: res.statusCode });
    if (--pending === 0) {
      report();
    }
  }).on('error', (err) => {
    results.push({ id, status: 'ERROR: ' + err.message });
    if (--pending === 0) {
      report();
    }
  }).end();
}

function report() {
  console.log("\n=== HEELS STATUS REPORT ===");
  for (const r of results) {
    console.log(`${r.status === 200 ? '✅' : '❌'} ${r.id} -> Status ${r.status}`);
  }
}
