const { execSync } = require('child_process');
const fs = require('fs');

const categories = {
  heels: 'https://unsplash.com/s/photos/women-heels',
  flats: 'https://unsplash.com/s/photos/women-flat-shoes',
  sandals: 'https://unsplash.com/s/photos/women-sandals'
};

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

for (const [key, url] of Object.entries(categories)) {
  console.log(`Fetching ${key} from ${url}...`);
  try {
    const cmd = `curl -s -L -H "User-Agent: ${userAgent}" "${url}"`;
    const html = execSync(cmd, { maxBuffer: 1024 * 1024 * 10 }).toString();
    
    // Find all occurrences of photo IDs
    // Example: images.unsplash.com/photo-1543163521-1bf539c55dd2
    const regex = /images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/g;
    const matches = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
      // Photo IDs are usually photo- followed by a string like 1543163521-1bf539c55dd2
      // We want the whole photo-xxxxxx part
      matches.add('photo-' + match[1]);
    }
    
    console.log(`Found ${matches.size} unique photo IDs for ${key}:`);
    console.log(Array.from(matches).slice(0, 25));
    
    fs.writeFileSync(`c:\\Users\\sifan\\OneDrive\\Desktop\\footwear hub 3\\scratch\\extracted_${key}.json`, JSON.stringify(Array.from(matches), null, 2));
  } catch (err) {
    console.error(`Error fetching/parsing ${key}:`, err.message);
  }
}
