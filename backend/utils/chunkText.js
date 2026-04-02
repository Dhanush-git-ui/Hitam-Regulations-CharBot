/**
 * chunkText.js - Regulation Decision Engine Chunker
 */

function cleanText(text) {
  return text
    .replace(/[^\x20-\x7E\n\t]/g, " ") 
    .replace(/\s{2,}/g, " ")           
    .replace(/\n{2,}/g, "\n\n")        
    .trim();
}

function chunkText(text, options = {}) {
  const {
    size = 800, 
    overlap = 150,
    source = "Unknown"
  } = options;

  const cleaned = cleanText(text);
  if (!cleaned) return [];

  const chunks = [];
  let startIndex = 0;

  while (startIndex < cleaned.length) {
    let endIndex = startIndex + size;

    if (endIndex < cleaned.length) {
      // Find a natural break in the overlap zone
      const windowStart = Math.max(startIndex, endIndex - overlap);
      const searchWindow = cleaned.slice(windowStart, endIndex + 50); // Look slightly ahead
      
      const lastStop = Math.max(
        searchWindow.lastIndexOf("."), 
        searchWindow.lastIndexOf("?"), 
        searchWindow.lastIndexOf("!"), 
        searchWindow.lastIndexOf("\n")
      );

      if (lastStop !== -1 && lastStop < overlap + 50) {
        endIndex = windowStart + lastStop + 1;
      }
    }

    const chunkContent = cleaned.slice(startIndex, endIndex).trim();
    if (chunkContent.length > 50) {
      chunks.push({
        text: chunkContent,
        source: source,
        chunkIndex: chunks.length
      });
    }

    startIndex = endIndex - overlap;
    if (startIndex >= cleaned.length) break;
  }

  return chunks;
}

module.exports = chunkText;