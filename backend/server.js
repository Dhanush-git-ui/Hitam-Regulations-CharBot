const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const RAGService = require('./services/RAGService');

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// FILE LISTING ENDPOINT
// -----------------------------

app.get('/files', async (req, res) => {
  try {
    const docsFolder = path.join(__dirname, '../documents/active');
    const fs = require('fs');
    
    if (!fs.existsSync(docsFolder)) {
      return res.json([]);
    }

    const files = fs.readdirSync(docsFolder)
      .filter(f => /\.(pdf|docx|txt)$/i.test(f))
      .map(f => {
        // Create small descriptions based on file names
        let description = "Official HITAM regulation document.";
        if (f.toLowerCase().includes('attendance')) description = "Rules for class attendance and leaves.";
        if (f.toLowerCase().includes('progression')) description = "Criteria for advancing to next academic year.";
        if (f.toLowerCase().includes('band')) description = "Details regarding Band A, B, C, and D progression.";
        if (f.toLowerCase().includes('credit')) description = "Grading and credit requirements.";
        
        return {
          name: f,
          description: description
        };
      });

    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// -----------------------------
// RAG SERVICE
// -----------------------------

const ragService = new RAGService({
  vectorStorePath: path.join(__dirname, 'vector_store/store.json'),
  documentsPath: path.join(__dirname, '../documents'),
  chunkSize: parseInt(process.env.CHUNK_SIZE) || 500,
  topK: parseInt(process.env.TOP_K_RESULTS) || 5
});

// -----------------------------
// HELPER FUNCTION
// Cleans document fragments
// -----------------------------

function cleanAnswer(text) {
  if (!text) return '';

  let cleaned = text;

  // remove numbered garbage fragments (e.g., "1. ") but only at the start of lines
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '');

  // remove yes/no form fields
  cleaned = cleaned.replace(/Yes\s*\/\s*No/gi, '');

  // remove excessive whitespace
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');

  return cleaned.trim();
}

// -----------------------------
// API ROUTES
// -----------------------------

app.get('/health', async (req, res) => {
  try {

    const vectorLoaded = ragService.vectorStore !== null;

    res.json({
      status: 'healthy',
      vector_store_loaded: vectorLoaded,
      rag_system: "active"
    });

  } catch (error) {

    res.status(500).json({
      status: 'unhealthy',
      error: error.messageS
    });

  }
});


// -----------------------------
// ASK ROUTE (IMPROVED)
// -----------------------------

app.post('/ask', async (req, res) => {

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  try {

    let answer = await ragService.query(question);

    if (!answer || answer.length === 0) {
      return res.json({
        answer: "I couldn't find relevant information in the regulation documents."
      });
    }

    // Clean the answer text
    answer = cleanAnswer(answer);

    res.json({
      answer
    });

  } catch (error) {
    console.error('Error processing ask request:', error.message);

    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});


// -----------------------------
// START SERVER
// -----------------------------

const PORT = process.env.PORT || 5000;

async function startServer() {
  await ragService.loadVectorStore();

  app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
    console.log(`Health check: http://127.0.0.1:${PORT}/health`);
    console.log('RAG-based document search enabled');

    if (!ragService.vectorStore) {
      console.log('⚠️ Vector store not loaded. Run `npm run build-vector-store`');
    }
  });
}

startServer().catch(console.error);