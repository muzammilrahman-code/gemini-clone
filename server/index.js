import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const gemini_api_key = process.env.GEMINI_API_KEY;

if (!gemini_api_key) {
  console.error("❌ GEMINI_API_KEY not found in .env");
  process.exit(1); // Stop server if key is missing
}

const genAI = new GoogleGenerativeAI(gemini_api_key);

// Optional config
const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.0-flash", "gemini-1.5-pro", "gemini-pro"];


// ✅ Test route (GET)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Chat route (POST)
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

    for (const modelName of models) {
    try {
      console.log(`🟡 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

  
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    console.log(`Gemini response: ${modelName}`);
    return res.json({ model: modelName, text });
  } catch (error) {
    console.error("Error:", error.message || error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
