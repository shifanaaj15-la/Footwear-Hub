const fs = require('fs');

const html = fs.readFileSync('scratch/bing_result.html', 'utf8');

// Find all indices of 'unsplash'
const query = 'unsplash';
let index = html.toLowerCase().indexOf(query);
let count = 0;

if (index === -1) {
  console.log("No occurrences of 'unsplash' found in HTML.");
} else {
  while (index !== -1 && count < 10) {
    console.log(`\nOccurrence ${count + 1} at index ${index}:`);
    const start = Math.max(0, index - 50);
    const end = Math.min(html.length, index + 100);
    console.log(html.substring(start, end));
    
    index = html.toLowerCase().indexOf(query, index + 1);
    count++;
  }
}
