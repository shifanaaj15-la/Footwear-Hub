const { execSync } = require('child_process');

try {
  const url = 'https://unsplash.com/s/photos/women-heels';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const cmd = `curl -i -s -L -H "User-Agent: ${userAgent}" "${url}"`;
  const response = execSync(cmd, { maxBuffer: 1024 * 1024 * 10 }).toString();
  
  console.log("=== Response Snippet ===");
  console.log(response.substring(0, 1500));
} catch (err) {
  console.error("Error running curl:", err.message);
}
