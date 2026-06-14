const pdfParse = require('pdf-parse');
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('Usage: node test-pdf.js <path-to-pdf>'); process.exit(1); }
pdfParse(fs.readFileSync(file)).then(function(d) {
  const t = (d.text || '').trim();
  console.log('=== TOTAL LENGTH:', t.length, 'chars ===');
  console.log('=== FIRST 2000 CHARS ===');
  console.log(t.slice(0, 2000));
  console.log('\n=== LAST 2000 CHARS ===');
  console.log(t.slice(-2000));
}).catch(function(e) { console.error('Error:', e.message); });
