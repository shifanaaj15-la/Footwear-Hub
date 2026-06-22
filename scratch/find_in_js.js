const fs = require('fs');
const content = fs.readFileSync('products_v2.js', 'utf8');
console.log("Includes face ID (photo-1515621061946-eff1c2a352bd):", content.includes('photo-1515621061946-eff1c2a352bd'));
console.log("Includes socks ID (photo-1551489186-ccb95a1ea6a3):", content.includes('photo-1551489186-ccb95a1ea6a3'));
console.log("Includes standing woman ID (photo-1524553879936-2ff074ae5816):", content.includes('photo-1524553879936-2ff074ae5816'));
console.log("Includes standing woman kids ID (photo-1491897554428-130a60dd4757):", content.includes('photo-1491897554428-130a60dd4757'));
