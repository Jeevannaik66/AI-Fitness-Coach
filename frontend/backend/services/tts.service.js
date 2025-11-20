import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Text-to-Speech service using Gemini Audio model
 */
export async function ttsService(text) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-tts",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const audioData = result.response.audio;

    if (!audioData) {
      throw new Error("No audio returned from TTS model");
    }

    return audioData; // base64 WAV/MP3 depending on model
  } catch (err) {
    console.error("TTS Generation Error:", err);
    throw new Error("Failed to generate speech audio.");
  }
}
