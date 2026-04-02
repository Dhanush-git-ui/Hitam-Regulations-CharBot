const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const getEmbedding = require("../utils/embeddings");
const cosineSimilarity = require("../utils/similarity");

// Endpoints
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const OLLAMA_ENDPOINT = "http://localhost:11434/api/generate";

class RAGService {
  constructor(options = {}) {
    this.vectorStorePath = options.vectorStorePath || path.join(__dirname, "../vector_store/store.json");
    this.vectorStore = null;
    this.topK = parseInt(process.env.TOP_K_RESULTS) || 10;
    this.finalK = 10; // Provide massive context to the LLM (up to 10 chunks)
    this.minSimilarity = 0.45; // Broadened slightly to capture linguistic variations
    this.llmFailCount = 0;
    this.MAX_FAILS = 3;
  }

  async loadVectorStore() {
    if (this.vectorStore) return this.vectorStore;
    try {
      const data = await fs.readFile(this.vectorStorePath, "utf-8");
      this.vectorStore = JSON.parse(data);
      console.log(`[RAG ENGINE] Active: ${this.vectorStore.length} chunks loaded.`);
      return this.vectorStore;
    } catch (err) {
      console.error("[RAG ENGINE] Failed to load decision database:", err.message);
      return [];
    }
  }

  async searchSimilar(query) {
    const store = await this.loadVectorStore();
    if (!store.length) return [];

    let queryEmbedding;
    try {
      queryEmbedding = await getEmbedding(query, "search_query: ");
    } catch (e) {
      console.warn("[RAG ENGINE] Embedding service unavailable, falling back to keyword logic.");
    }

    let results = [];
    if (queryEmbedding) {
      results = store
        .map(nd => ({
          text: nd.text,
          source: nd.source || "Official Regulation",
          score: cosineSimilarity(queryEmbedding, nd.embedding)
        }))
        .filter(r => r.score >= this.minSimilarity)
        .sort((a, b) => b.score - a.score)
        .slice(0, this.topK);
    }

    if (!results.length) {
      const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 3);
      results = store
        .map(nd => ({
          text: nd.text,
          source: nd.source || "Official Regulation",
          score: keywords.filter(k => nd.text.toLowerCase().includes(k)).length / Math.max(1, keywords.length)
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, this.topK);
    }

    return results.slice(0, this.finalK);
  }

  async callOpenRouter(systemMsg, userMsg) {
    const key = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free";
    
    if (!key) throw new Error("Missing API Key");

    const response = await axios.post(
      OPENROUTER_ENDPOINT,
      {
        model: model,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: userMsg }
        ],
        temperature: 0, // Deterministic for a decision engine
      },
      {
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        timeout: 45000
      }
    );
    return response.data.choices[0].message.content.trim();
  }

  async callOllama(prompt) {
    const model = process.env.OLLAMA_MODEL || "llama3.2";
    const response = await axios.post(
      OLLAMA_ENDPOINT,
      {
        model: model,
        prompt: prompt,
        stream: false,
        options: { 
          temperature: 0, 
          num_predict: 400,  // Reduced from 800 for faster responses
          top_k: 10,         // Narrow down predictions
          top_p: 0.9         // Nucleus sampling for faster generation
        }
      },
      { timeout: 60000 }  // Reduced from 90s
    );
    return (response.data.response || response.data.message?.content || "").trim();
  }

  async query(question) {
    try {
      const chunks = await this.searchSimilar(question);
      
      // OUT-OF-SCOPE HANDLER: If no relevant context found
      if (!chunks.length) {
        return "Information not available in the provided documents.";
      }

      const context = chunks.map((c, i) => `[Snippet ${i + 1} | Source: ${c.source}]\n${c.text}`).join("\n\n---\n\n");

      // SIMPLE STRICT PROMPT
      const systemMsg = `You are an academic regulation assistant for HITAM.

Your job is to answer strictly based on the provided documents (context).
Do NOT use outside knowledge. Do NOT guess.

Rules:
1. Give only accurate answers from the context.
2. Be precise and direct. No unnecessary explanation.
3. Keep answers short (2–5 lines unless required).
4. If the answer is not in the context, say:
   "Information not available in the provided documents."
5. Do not add assumptions or extra details.
6. Use clear and formal language.
7. If multiple points exist, present them as bullet points.
8. Do not repeat the question.
9. Do not explain reasoning.
10. Prioritize correctness over completeness.

Answer format:
- Direct answer
- Bullet points
- No introduction or conclusion`;

      const userMsg = `### QUESTION
"${question}"

### REGULATION CONTEXT
${context}`;

      // Step 3: LLM Dispatch - LOCAL FIRST (FASTER)
      let answer;
      const key = process.env.OPENROUTER_API_KEY;
      const preferLocal = process.env.PREFER_LOCAL_LLM !== "false"; // Default to local

      // Use local Llama first for faster responses
      if (preferLocal) {
        try {
          console.log(`[RAG ENGINE] Processing locally with Llama 3.2 (fast)...`);
          const fullPrompt = `${systemMsg}\n\n${userMsg}`;
          answer = await this.callOllama(fullPrompt);
        } catch (e) {
          console.warn("[RAG ENGINE] Local LLM failed:", e.message);
        }
      }

      // Fallback to OpenRouter only if local fails AND key is valid
      if (!answer && key && !key.startsWith("#")) {
        try {
          console.log(`[RAG ENGINE] Fallback: Processing with OpenRouter...`);
          answer = await this.callOpenRouter(systemMsg, userMsg);
        } catch (e) {
          console.warn("[RAG ENGINE] OpenRouter also failed:", e.message);
        }
      }

      if (!answer) {
        answer = "The system encountered an error. Please contact the Academic Cell.";
      }

      return answer;

    } catch (e) {
      console.error("[RAG ENGINE] Fatal Error:", e.message);
      return "The system encountered an error. Please contact the Academic Cell.";
    }
  }
}

module.exports = RAGService;