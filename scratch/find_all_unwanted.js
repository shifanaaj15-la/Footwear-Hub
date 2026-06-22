const fs = require('fs');
const content = fs.readFileSync('products_v2.js', 'utf8');

const unwanted = {
  socks: 'photo-1551489186-ccb95a1ea6a3',
  standing_woman_heels: 'photo-1524553879936-2ff074ae5816',
  standing_woman_suit: 'photo-1562273138-f46be4ebdf33',
  city_building: 'photo-1515621061946-eff1c2a352bd',
  couples: 'photo-1491897554428-130a60dd4757'
};

console.log("=== UNWANTED PHOTOS IN products_v2.js ===");
for (const name in unwanted) {
  const id = unwanted[name];
  const count = (content.match(new RegExp(id, 'g')) || []).length;
  console.log(`${name} (${id}): found ${count} times`);
}
