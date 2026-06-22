const fs = require('fs');

const html = fs.readFileSync('scratch/bing_result_2.html', 'utf8');

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No title found');

console.log('\nFirst 1000 characters:');
console.log(html.substring(0, 1000));
