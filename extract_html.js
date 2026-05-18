const fs = require('fs');
const path = require('path');

const files = [
  'about.html', 'services.html', 'contact.html', 'projects.html',
  'privacy-policy.html', 'terms-conditions.html', 'index.html'
];

let allText = '';

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    // Basic HTML tag stripping
    const text = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
    allText += `\n--- CONTENT FROM ${file} ---\n${text}\n`;
  }
});

fs.writeFileSync('extracted_html_text.txt', allText);
console.log('Extracted text to extracted_html_text.txt');
