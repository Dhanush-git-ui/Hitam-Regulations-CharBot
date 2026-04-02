const fs = require('fs');
const path = require('path');
const chunkText = require('./utils/chunkText');
const getEmbedding = require('./utils/embeddings');

async function updateStudentProgression() {
  console.log('='.repeat(70));
  console.log('UPDATING: Student Progression Framework in Vector Store');
  console.log('='.repeat(70));
  console.log();
  
  const cleanedTextPath = path.join(__dirname, '../documents/pdf/Student_progression_cleaned.txt');
  const storePath = path.join(__dirname, 'vector_store/store.json');
  
  // Load existing store
  let existingStore = [];
  if (fs.existsSync(storePath)) {
    const data = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    existingStore = data;
    console.log(`✓ Loaded existing vector store: ${existingStore.length} chunks`);
    console.log();
  }
  
  // Read cleaned text
  console.log('Reading cleaned Student Progression text...');
  let cleanedText = fs.readFileSync(cleanedTextPath, 'utf8');
  
  // Additional cleaning: fix spacing issues from PDF extraction
  cleanedText = cleanedText.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space before capitals
  cleanedText = cleanedText.replace(/(\d)([a-zA-Z])/g, '$1 $2'); // Add space between numbers and letters
  cleanedText = cleanedText.replace(/([a-zA-Z])(\d)/g, '$1 $2'); // Add space between letters and numbers
  
  console.log(`✓ Text length: ${cleanedText.length} characters`);
  const words = cleanedText.trim().split(/\s+/).filter(w => w.length > 2);
  console.log(`✓ Word count: ${words.length} words`);
  console.log();
  
  // Remove old student progression chunks
  console.log('Removing old Student Progression chunks...');
  const oldCount = existingStore.filter(chunk => 
    (chunk.source || '').includes('Student progression')
  ).length;
  
  existingStore = existingStore.filter(chunk => 
    !(chunk.source || '').includes('Student progression')
  );
  
  console.log(`✓ Removed ${oldCount} old chunks`);
  console.log(`✓ Remaining chunks: ${existingStore.length}`);
  console.log();
  
  // Create new chunks
  const chunkSize = parseInt(process.env.CHUNK_SIZE) || 900;
  const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 150;
  
  console.log(`Creating new chunks (size: ${chunkSize}, overlap: ${chunkOverlap})...`);
  const chunks = chunkText(cleanedText, {
    size: chunkSize,
    overlap: chunkOverlap,
    source: 'Student progression frame work_5972 (4) A1.pdf',
  });
  
  console.log(`Created ${chunks.length} chunks`);
  console.log();
  
  // Generate embeddings
  console.log('Generating embeddings...\n');
  const newChunks = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      const embedding = await getEmbedding(chunk.text);
      
      newChunks.push({
        text: chunk.text,
        source: chunk.source,
        chunkIndex: chunk.chunkIndex,
        embedding,
      });
      
      process.stdout.write(`  Embedded ${i + 1}/${chunks.length} chunks...\r`);
    } catch (error) {
      console.error(`\n  ✗ Error embedding chunk ${i + 1}:`, error.message);
    }
  }
  
  console.log('\n');
  
  // Combine stores
  const finalStore = [...existingStore, ...newChunks];
  
  console.log('='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Previous chunks: ${existingStore.length}`);
  console.log(`New Student Progression chunks: ${newChunks.length}`);
  console.log(`Total chunks: ${finalStore.length}`);
  console.log();
  
  // Save updated store
  fs.writeFileSync(storePath, JSON.stringify(finalStore, null, 2));
  console.log('✅ Vector store updated successfully!');
  console.log(`   Location: ${storePath}`);
  console.log();
  
  // Show what's now in the store
  console.log('Content in vector store:');
  const sources = [...new Set(finalStore.map(d => d.source || 'unknown'))];
  sources.forEach(s => {
    const count = finalStore.filter(d => d.source === s).length;
    console.log(`  ✓ ${s}: ${count} chunks`);
  });
  console.log();
  console.log('='.repeat(70));
  console.log('🎉 COMPLETE! Student Progression Framework updated!');
  console.log('='.repeat(70));
}

updateStudentProgression().catch(console.error);
