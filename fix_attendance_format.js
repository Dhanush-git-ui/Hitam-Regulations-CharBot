const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'documents/active/Attendance_policy.txt');
const content = fs.readFileSync(filePath, 'utf-8');

// Join lines that look like they belong together
const lines = content.split('\n');
let improved = '';
let currentParagraph = '';

for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
        if (currentParagraph) {
            improved += currentParagraph.trim() + '\n\n';
            currentParagraph = '';
        }
        continue;
    }
    
    // If the line is short or doesn't end with a sentence-ending punctuation, join it
    currentParagraph += trimmed + ' ';
    
    // If it looks like a heading or ends a sentence, maybe break?
    // Actually, for this specific "one word per line" case, we just want to join everything.
}

if (currentParagraph) {
    improved += currentParagraph.trim();
}

// Clean up some common artifacts
improved = improved.replace(/\s{2,}/g, ' ');
improved = improved.replace(/ \. /g, '. ');

fs.writeFileSync(filePath, improved);
console.log("Improved Attendance_policy.txt formatting.");
