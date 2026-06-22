const fs = require('fs');

let content = fs.readFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/products.js', 'utf8');

// Replace the womenHeelsImages array
const newWomenHeels = `  const womenHeelsImages = [
    "images/heels_yellow.jpg",
    "images/heels_black.jpg",
    "images/heels_blue.jpg",
    "images/heels_gold.jpg",
    "images/heels_beige.jpg"
  ];`;

// Replace the womenFlatsImages array
const newWomenFlats = `  const womenFlatsImages = [
    "photo-1543163521-1bf539c55dd2", // Blue flats
    "photo-1514989940723-e8e51635b782", // Casual canvas flats
    "photo-1556906781-9a412961c28c", // White leather flats
    "photo-1535043934128-cf0b28d52f95", // Oxfords
    "photo-1614252235316-8c857d38b5f4", // Monk strap flats
    "photo-1575537302964-96cd47c06b1b", // Leather flat boots
    "photo-1608256246200-53e635b5b65f", // Black school shoes
    "photo-1533867617858-e7b97e060509"  // Derby flats
  ];`;

// Replace the womenSandalsImages array
const newWomenSandals = `  const womenSandalsImages = [
    "photo-1603487742131-4160ec999306", // Birkenstocks flat slide
    "photo-1603808033192-082d6919d3e1", // Leather slide sandals (replaced standing woman placeholder)
    "photo-1620045315169-771225b6b45c", // Skechers slide sandal (replaced standing woman placeholder)
    "photo-1525966222134-fcfa99b8ae77"  // Vans slide sandal
  ];`;

// Replace the kidsSlippersImages array
const newKidsSlippers = `  const kidsSlippersImages = [
    "photo-1518104593124-ac2e82a5eb9d", // Kids wellies/rain boots
    "images/kids_hightop.png", // Boot style high-top
    "images/kids_pink.png", // Cozy pink slipper style
    "images/kids_navy.png" // Cozy navy slipper style
  ];`;

// Find and replace the arrays in content
content = content.replace(/const womenHeelsImages = \[[^]*?\];/g, newWomenHeels);
content = content.replace(/const womenFlatsImages = \[[^]*?\];/g, newWomenFlats);
content = content.replace(/const womenSandalsImages = \[[^]*?\];/g, newWomenSandals);
content = content.replace(/const kidsSlippersImages = \[[^]*?\];/g, newKidsSlippers);

fs.writeFileSync('c:/Users/sifan/OneDrive/Desktop/footwear hub 3/products_v2.js', content, 'utf8');
console.log('✅ products_v2.js built successfully!');
