const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\shein\\bhumiamartya.my.id\\bhumiamartya-homepage\\index.html', 'utf8');

// Find all script tags or fetch calls
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('api/articles') || line.includes('articles') && line.includes('fetch')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
