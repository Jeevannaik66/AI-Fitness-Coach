// geminiClient.js
// Simple text-only Gemini client (no images)

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in environment.");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// For text generation only (workout, diet plan, etc)
export const textModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
