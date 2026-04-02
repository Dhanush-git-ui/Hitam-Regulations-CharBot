const fs = require("fs");
const mammoth = require("mammoth");
const { execFileSync } = require("child_process");
const path = require("path");

async function extractText(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    const scriptPath = path.join(__dirname, "pdfExtractor.py");
    try {
      return execFileSync("python", [scriptPath, filePath], { encoding: "utf8" });
    } catch (err) {
      if (err.code === "ENOENT") {
        try {
          return execFileSync("py", [scriptPath, filePath], { encoding: "utf8" });
        } catch (pyErr) {
          console.error(`❌ PDF Extraction failed for ${filePath}:`, pyErr.message);
          return "";
        }
      }
      console.error(`❌ PDF Extraction failed for ${filePath}:`, err.message);
      return "";
    }
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === "txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  return "";
}

module.exports = extractText;