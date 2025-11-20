// frontend/app/api/tts/route.js
import { NextResponse } from "next/server";

/**
 * Accepts:
 * {
 *   workoutText?: string,
 *   dietText?: string,
 *   voice?: { languageCode, name },
 *   rate?: number,
 *   pitch?: number
 * }
 *
 * Supports:
 * - Speak Workout only
 * - Speak Diet only
 * - Speak Full Plan
 */

const API_KEY =
  process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY || "";

// 🔇 Tiny silent MP3 (fallback + empty text protection)
const SILENT_MP3 =
  "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAAAAA==";

export async function POST(req) {
  try {
    const body = await req.json();

    const workoutText = (body?.workoutText || "").trim();
    const dietText = (body?.dietText || "").trim();

    // ⚠ MAIN FIX: NO MORE 400 ERROR → return silent audio instead
    if (!workoutText && !dietText) {
      return NextResponse.json(
        { success: true, audioUrl: SILENT_MP3 },
        { status: 200 }
      );
    }

    // 🔥 Build EXACT text (no summaries, no rewriting)
    let finalText = "";

    if (workoutText) {
      finalText += `Workout Plan:\n${workoutText}\n\n`;
    }

    if (dietText) {
      finalText += `Diet Plan:\n${dietText}`;
    }

    // Default voice
    const voice = body.voice || {
      languageCode: "en-US",
      name: "en-US-Wavenet-F",
    };

    const rate = typeof body.rate === "number" ? body.rate : 1.03;
    const pitch = typeof body.pitch === "number" ? body.pitch : 0.0;

    if (!API_KEY) {
      // No API key → give silent fallback
      return NextResponse.json(
        { success: true, audioUrl: SILENT_MP3 },
        { status: 200 }
      );
    }

    const ttsReq = {
      input: { text: finalText },
      voice,
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: rate,
        pitch,
      },
    };

    const googleRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ttsReq),
      }
    );

    const raw = await googleRes.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON returned from Google TTS" },
        { status: 500 }
      );
    }

    if (!googleRes.ok) {
      const msg =
        data?.error?.message ||
        JSON.stringify(data.error || "Google TTS error");
      return NextResponse.json(
        { success: false, error: msg },
        { status: 500 }
      );
    }

    const audioContent = data.audioContent;
    if (!audioContent) {
      return NextResponse.json(
        { success: false, error: "No audio returned by Google TTS" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, audioUrl: `data:audio/mp3;base64,${audioContent}` },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "TTS error",
      },
      { status: 500 }
    );
  }
}
