import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Missing prompt" },
        { status: 400 }
      );
    }

    // If no key → return placeholder
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: true,
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAnUB9nVxS6cAAAAASUVORK5CYII=",
        },
        { status: 200 }
      );
    }

    // ✅ Use Imagen 4.0 (WORKING MODEL FOR YOUR KEY)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GEMINI_API_KEY}`;

    const body = {
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
      },
    };

    const googleRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await googleRes.text();
    console.log("RAW GOOGLE IMAGE RESPONSE:", raw);

    if (!googleRes.ok) {
      return NextResponse.json(
        { success: false, error: raw },
        { status: 500 }
      );
    }

    const data = JSON.parse(raw);

    // Extract base64 image
    const b64 = data?.predictions?.[0]?.bytesBase64Encoded;

    if (!b64) {
      return NextResponse.json(
        { success: false, error: "No image returned" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        image: `data:image/png;base64,${b64}`,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
