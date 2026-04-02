const axios = require("axios");

async function getEmbedding(text, prefix = "search_document: ") {

  try {

    if (!text || typeof text !== "string") {
      throw new Error("Invalid text for embedding");
    }

    // Clean text
    const cleanedText = text
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
      
    const promptText = prefix ? prefix + cleanedText : cleanedText;

    const response = await axios.post(
      "http://localhost:11434/api/embeddings",
      {
        model: "nomic-embed-text",
        prompt: promptText
      }
    );

    if (!response.data || !response.data.embedding) {
      throw new Error("Invalid embedding response");
    }

    return response.data.embedding;

  } catch (error) {

    console.error("Embedding generation failed:", error.message);

    throw error;
  }
}

module.exports = getEmbedding;