const https = require('https');

const candidates = [
  // Heels candidates
  'photo-1535043934128-cf0b28d52f95', // oxfords
  'photo-1543163521-1bf539c55dd2', // yellow heels
  'photo-1596702994230-a8848d4002d0', // red heels (failing)
  'photo-1515347648999-09f2d937a06b', // black stiletto heel
  'photo-1582966772680-860e372bb558', // stiletto heel
  'photo-1506898667547-42e22a46b827', // yellow crocs?
  'photo-1629210081708-9df21d234be1', // crocs (failing)
  'photo-1595341888016-a392ef81b7de', // sandals
  'photo-1603808033192-082d6919d3e1', // sandals
  'photo-1560343090-f0409e92791a', // slippers
  'photo-1621259182978-f09e5ece6794', // brogue (failing)
  'photo-1614252235316-8c857d38b5f4', // monk strap
  'photo-1614495088870-87722fe1659a', // oxford (failing)
  'photo-1535043934128-cf0b28d52f95', // dress shoe
  'photo-1607522370275-f14206abe5d3', // red shoe
  'photo-1491553895911-0055eca6402d', // black runner
  'photo-1604902396830-aca29e19b067', // pink runner
  'photo-1595950653106-6c9ebd614d3a', // pink sneaker
  'photo-1549298916-b41d501d3772', // beige trainer
  'photo-1552346154-21d32810aba3', // zoom runner
  'photo-1539185441755-769473a23570', // retro trainer
  'photo-1597045566677-8cf032ed6634', // black suede
  'photo-1514989940723-e8e51635b782', // mesh walker
  'photo-1608256246200-53e635b5b65f', // school shoes
  'photo-1518104593124-ac2e82a5eb9d', // kids wellies
  'photo-1605348532760-6753d2c43329', // black trainer
  'photo-1575537302964-96cd47c06b1b', // boot
  'photo-1562273138-f46be4ebdf33', // flats
  'photo-1582588678413-dbf45f4823e9', // red runner
  'photo-1516478177764-9fe5bd7e9717', // high-top kid
  'photo-1503642551022-c011aafb3c88', // red sneaker kid
  'photo-1515621061946-eff1c2a352bd', // orange runner kid
  'photo-1560343090-f0409e92791a', // slippers kid
  'photo-1604902396830-aca29e19b067', // pink runner kid
  // More candidates for stilettos
  'photo-1596702994230-a8848d4002d0', // Red stiletto (failing)
  'photo-1515347648999-09f2d937a06b', // Black stiletto candidate
  'photo-1582966772680-860e372bb558', // Stiletto candidate
  'photo-1531310197839-ccf54634509e', // High heel stiletto
  'photo-1509281373149-e957c6296406', // Colorful shoe
  'photo-1490168195860-53a5987d61a4', // Black stiletto
  'photo-1549298916-b41d501d3772', // Beige shoe
  'photo-1608256246200-53e635b5b65f', // Black shoe
];

const results = [];
let pending = candidates.length;

for (const id of candidates) {
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
  console.log("\n=== CANDIDATE STATUS REPORT ===");
  for (const r of results) {
    console.log(`${r.status === 200 ? '✅' : '❌'} ${r.id} -> Status ${r.status}`);
  }
}
