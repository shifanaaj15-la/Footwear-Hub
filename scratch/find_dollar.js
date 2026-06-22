const fs = require('fs');

const files = ['index.html', 'app_v2.js'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`\n=== SEARCHING ${file} ===`);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      // Find literal '$' (not template literal variable like ${var})
      // A literal '$' is a '$' not followed by '{'
      // Or in HTML it's just '$'
      if (line.includes('$')) {
        // Let's print the line if it has currency pattern like $10, $0.00, $${val}, etc.
        if (/\$[0-9]|\$\$\{/.test(line) || (!line.includes('${') && line.includes('$'))) {
          console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
      }
    });
  }
});
