const fs = require('fs');

const html = fs.readFileSync('scratch/bing_result_2.html', 'utf8');

// Match href="http..." or href="https..."
const regex = /href="https?:\/\/([^"]+)"/gi;
const hosts = new Set();
let match;
let count = 0;
while ((match = regex.exec(html)) !== null && count < 50) {
  const url = match[1];
  try {
    const host = new URL('http://' + url).hostname;
    hosts.add(host);
  } catch (e) {}
  count++;
}

console.log('Found hosts:');
console.log(Array.from(hosts));
