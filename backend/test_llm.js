const axios = require('axios');
require('dotenv').config({ path: '../.env' });

async function testLLMs() {
    console.log("Checking OpenRouter (Qwen)...");
    try {
        const orRes = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-coder-32b-instruct:free",
            messages: [{ role: "user", content: "Say 'System Online'" }]
        }, {
            headers: { 
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            timeout: 10000
        });
        console.log("✅ OpenRouter reachable:", orRes.data.choices[0].message.content);
    } catch (e) {
        console.log("❌ OpenRouter failed:", e.message);
        if (e.response) console.log("Response Body:", JSON.stringify(e.response.data));
    }

    console.log("\nChecking Ollama (tinyllama)...");
    try {
        const ollamaRes = await axios.post("http://localhost:11434/api/generate", {
            model: "tinyllama",
            prompt: "hi",
            stream: false
        }, { timeout: 30000 });
        console.log("✅ Ollama reachable:", ollamaRes.data.response);
    } catch (e) {
        console.log("❌ Ollama failed:", e.message);
    }
}

testLLMs();
