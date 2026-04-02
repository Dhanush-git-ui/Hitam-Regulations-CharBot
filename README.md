# HITAM Regulations Bot 🎓

A RAG (Retrieval-Augmented Generation) based chatbot for querying college regulations and policies.

## 📁 Project Structure

```
hita_regulations_bot/
├── backend/                 # Node.js backend server
│   ├── services/           # Core business logic
│   │   └── RAGService.js   # RAG implementation service
│   ├── utils/              # Utility functions
│   │   ├── chunkText.js    # Text chunking with sentence boundaries
│   │   ├── embeddings.js   # Embedding generation via Ollama
│   │   ├── extractText.js  # PDF/DOCX text extraction
│   │   └── similarity.js   # Cosine similarity calculation
│   ├── vector_store/       # Vector store builder
│   │   └── buildVectorStore.js
│   ├── package.json
│   └── server.js           # Express API server
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── documents/              # College regulation documents
│   ├── pdf/               # PDF format documents
│   └── docx/              # Word format documents
├── .env.example           # Environment variables template
├── .gitignore
└── package.json           # Root workspace configuration
```

## 🚀 Features

- **Semantic Search**: Uses embedding-based similarity search to find relevant information
- **Fallback Keyword Search**: Automatically falls back to keyword search if embeddings aren't available
- **Multi-format Support**: Processes both PDF and DOCX documents
- **Smart Chunking**: Intelligent text chunking at sentence boundaries
- **Real-time Chat**: Interactive chat interface for querying regulations
- **Scalable Architecture**: Clean separation of concerns with service layer

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Ollama** - Embedding generation (nomic-embed-text model)
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

### Frontend
- **React** - UI framework
- **Fetch API** - HTTP requests to backend

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Ollama (optional, for embedding generation)
  - Install from: https://ollama.ai
  - Pull embedding model: `ollama pull nomic-embed-text`

## ⚙️ Installation

### 1. Clone the Repository

```bash
cd hita_regulations_bot
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

Or install manually:

```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
OLLAMA_API_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
VECTOR_STORE_PATH=./backend/vector_store/store.json
CHUNK_SIZE=500
TOP_K_RESULTS=3
```

## 🔧 Setup & Usage

### Option 1: Without Embeddings (Keyword Search Only)

If you don't have Ollama installed, the bot will automatically use keyword-based search as a fallback.

1. **Start the Backend**:
   ```bash
   npm run start:backend
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   npm run start:frontend
   ```

3. **Access the Application**:
   Open http://localhost:3000 in your browser

### Option 2: With Embeddings (Full RAG)

For better semantic search capabilities:

1. **Install and Start Ollama**:
   ```bash
   # Download and install Ollama from https://ollama.ai
   ollama pull nomic-embed-text
   ```

2. **Build the Vector Store**:
   ```bash
   npm run build-vector-store
   ```
   
   This will:
   - Extract text from PDF documents
   - Split text into chunks
   - Generate embeddings for each chunk
   - Save to `backend/vector_store/store.json`

3. **Start the Backend**:
   ```bash
   npm run start:backend
   ```

4. **Start the Frontend** (in a new terminal):
   ```bash
   npm run start:frontend
   ```

5. **Access the Application**:
   Open http://localhost:3000 in your browser

### Development Mode

Run backend with auto-reload:

```bash
npm run dev
```

Run both backend and frontend together:

```bash
npm run start:both
```

## 📡 API Endpoints

### POST `/ask`
Send a question to the bot.

**Request:**
```json
{
  "question": "What is the attendance policy?"
}
```

**Response:**
```json
{
  "answer": "Based on the college regulations:\n\n1. Students must maintain 75% attendance...\n\nNote: This answer was retrieved directly from the document files."
}
```

### GET `/health`
Check server health and status.

**Response:**
```json
{
  "status": "healthy",
  "ollama_available": false,
  "document_search_available": true,
  "documents_count": 4,
  "vector_store_loaded": true
}
```

## 📚 Adding Documents

Add your college regulation documents to:

- **PDF files**: `documents/pdf/`
- **Word files**: `documents/docx/`

After adding documents:

1. If using embeddings, rebuild the vector store:
   ```bash
   npm run build-vector-store
   ```

2. Restart the backend server

## 🔍 How It Works

### RAG Pipeline

1. **Document Ingestion**:
   - PDF/DOCX files are read and text is extracted
   - Text is split into chunks at sentence boundaries
   - Embeddings are generated for each chunk (if Ollama available)
   - Vectors are stored in `vector_store/store.json`

2. **Query Processing**:
   - User asks a question
   - Query embedding is generated
   - Cosine similarity finds most relevant chunks
   - Top results are returned as answer

3. **Fallback Mechanism**:
   - If no vector store exists → keyword search
   - If Ollama unavailable → keyword search
   - Ensures bot always works

### Smart Chunking

The chunking algorithm:
- Respects sentence boundaries (., ?, !)
- Configurable chunk size (default: 500 chars)
- Avoids cutting sentences in half
- Maintains context coherence

## 🐛 Troubleshooting

### "Vector store not found"
Run `npm run build-vector-store` to generate it.

### "Ollama connection failed"
- Ensure Ollama is running: `ollama serve`
- Check Ollama URL in `.env`
- Verify embedding model is pulled: `ollama pull nomic-embed-text`

### "No documents found"
- Check that documents exist in `documents/pdf` or `documents/docx`
- Ensure file extensions are lowercase (.pdf, .docx)
- Restart the backend server

### Port already in use
Change the PORT in `.env` file or kill the process using the port.

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run start:backend` | Start backend server |
| `npm run start:frontend` | Start frontend app |
| `npm run start:both` | Run both servers together |
| `npm run build-vector-store` | Build embeddings vector store |
| `npm run dev` | Start backend in dev mode |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes at HITAM.

## 💡 Tips

- Ask specific questions for better answers
- Use natural language queries
- The bot searches semantically, not just keywords
- Rephrase if you don't get relevant results

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in `backend/` folder
3. Verify environment configuration

---

**Built with ❤️ for HITAM students and faculty**
