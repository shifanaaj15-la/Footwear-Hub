const { execSync } = require('child_process');
const fs = require('fs');

const url = 'https://unsplash.com/s/photos/women-heels';
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

try {
  console.log("Fetching search page...");
  const cmd = `curl -s -L -H "User-Agent: ${userAgent}" "${url}"`;
  const html = execSync(cmd, { maxBuffer: 1024 * 1024 * 15 }).toString();
  
  console.log("HTML length:", html.length);
  
  // Let's search for script tags containing JSON or state data
  const match = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/);
  if (match) {
    console.log("Found window.__INITIAL_STATE__!");
    fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\initial_state.json', match[1]);
  } else {
    const matchNext = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    if (matchNext) {
      console.log("Found __NEXT_DATA__!");
      fs.writeFileSync('c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\next_data.json', matchNext[1]);
    } else {
      console.log("No INITIAL_STATE or NEXT_DATA script found. Searching for any script with JSON...");
      // Let's write the first 5000 chars of script tags to see what's there
      const scripts = [];
      const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      let m;
      while ((m = regex.exec(html)) !== null) {
        if (m[1].includes('{') && m[1].includes('}')) {
          scripts.push(m[1].substring(0, 500));
        }
      }
      console.log(`Found ${scripts.length} scripts with JSON-like structure. Examples:`);
      console.log(scripts.slice(0, 3));
    }
  }
} catch (err) {
  console.error("Error:", err.message);
}
