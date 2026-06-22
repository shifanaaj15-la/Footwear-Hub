const fs = require('fs');

try {
  const logPath = 'C:\\Users\\sifan\\.gemini\\antigravity-ide\\brain\\eedaae6d-8395-4f5d-b121-9cf23451ad32\\.system_generated\\logs\\transcript.jsonl';
  const data = fs.readFileSync(logPath, 'utf8');
  
  const regex = /photo-([a-zA-Z0-9\-]{10,})/g;
  const ids = new Set();
  let match;
  while ((match = regex.exec(data)) !== null) {
    ids.add('photo-' + match[1]);
  }
  
  console.log(`Found ${ids.size} unique photo IDs in logs!`);
  const idsArray = Array.from(ids);
  console.log("Listing some of them:");
  console.log(idsArray.slice(0, 50));
  
  fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\logs_photos.json', JSON.stringify(idsArray, null, 2));
} catch (err) {
  console.error("Error reading logs:", err.message);
}
