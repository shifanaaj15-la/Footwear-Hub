const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'women_imgs');
const files = fs.readdirSync(dir);

console.log(`Checking ${files.length} downloaded files...`);

files.forEach(file => {
  const filePath = path.join(dir, file);
  const stats = fs.statSync(filePath);
  
  // Read first 20 bytes
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(20);
  fs.readSync(fd, buffer, 0, 20, 0);
  fs.closeSync(fd);
  
  const header = buffer.toString('utf8');
  const isHtml = header.includes('<!DOCTYPE') || header.includes('<html') || header.includes('<!--');
  
  if (isHtml || stats.size < 5000) {
    console.log(`[INVALID/HTML] File: ${file}, Size: ${stats.size} bytes, Header: ${buffer.toString('hex')}`);
  } else {
    // Check if it's a valid JPEG (usually starts with FF D8 FF)
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (!isJpeg) {
      console.log(`[NOT-JPEG] File: ${file}, Size: ${stats.size} bytes, Magic: ${buffer.slice(0, 4).toString('hex')}`);
    }
  }
});
console.log('Verification done.');
