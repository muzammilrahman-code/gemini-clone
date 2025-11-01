
import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
  console.error("❌ GEMINI_API_KEY not found in .env");
}

const genAI = new GoogleGenerativeAI(gemini_api_key);
const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.0-flash", "gemini-1.5-pro", "gemini-pro"];

// Test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Chat route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, generationConfig });
      const result = await model.generateContent(message);
      const text = result.response.text();
      return res.json({ model: modelName, text });
    } catch (err) {
      console.error(err);
    }
  }

  res.status(500).json({ error: "All models failed" });
});

export default app;
