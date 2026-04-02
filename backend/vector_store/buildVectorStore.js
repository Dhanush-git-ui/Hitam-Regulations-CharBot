const fs   = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const extractText  = require("../utils/extractText");
const chunkText    = require("../utils/chunkText");
const getEmbedding = require("../utils/embeddings");

async function buildStore() {
  const docsFolder = path.join(__dirname, "../../documents/active");
  const files      = fs.readdirSync(docsFolder).filter(f => /\.(pdf|docx|txt)$/i.test(f));

  if (!files.length) {
    console.error("❌ No PDF/DOCX files found in documents/pdf/");
    process.exit(1);
  }

  // Use standardized chunks per best practices
  const chunkSize    = parseInt(process.env.CHUNK_SIZE)    || 800;
  const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 150;

  const vectorStore = [];

  console.log(`\n📚 Building vector store`);
  console.log(`   Files found : ${files.length}`);
  console.log(`   Chunk size  : ${chunkSize} chars`);
  console.log(`   Overlap     : ${chunkOverlap} chars\n`);

  for (const file of files) {
    const filePath = path.join(docsFolder, file);
    console.log(`📄 Processing: ${file}`);

    try {
      const text = await extractText(filePath);

      if (!text || text.trim().length === 0) {
        console.log(`   ⚠️  No text extracted — skipping\n`);
        continue;
      }

      console.log(`   Extracted : ${text.length} characters`);

      const chunks = chunkText(text, {
        size:    chunkSize,
        overlap: chunkOverlap,
        source:  file,
      });

      // Filter out garbage chunks
      const goodChunks = chunks.filter(c => c.text.length >= 60);
      console.log(`   Chunks    : ${goodChunks.length} (${chunks.length - goodChunks.length} garbage filtered)`);

      let success = 0;
      for (let i = 0; i < goodChunks.length; i++) {
        const chunk = goodChunks[i];
        try {
          const embedding = await getEmbedding(chunk.text);
          vectorStore.push({
            text:       chunk.text,
            source:     chunk.source,
            chunkIndex: chunk.chunkIndex,
            embedding,
          });
          success++;
          process.stdout.write(`\r   Embedded  : ${success}/${goodChunks.length}`);
        } catch (err) {
          console.error(`\n   ✗ Chunk ${i + 1} embedding failed:`, err.message);
        }
      }

      console.log(`\n   ✅ Done: ${success}/${goodChunks.length} chunks embedded\n`);
    } catch (err) {
      console.error(`   ✗ Error processing ${file}:`, err.message, "\n");
    }
  }

  const outputPath = process.env.VECTOR_STORE_PATH ||
    path.join(__dirname, "store.json");

  fs.writeFileSync(outputPath, JSON.stringify(vectorStore, null, 2));

  console.log(`\n✅ Vector store saved!`);
  console.log(`   Total vectors : ${vectorStore.length}`);
  console.log(`   Location      : ${outputPath}\n`);
}

buildStore().catch(err => {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
});