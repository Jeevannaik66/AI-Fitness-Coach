export async function generateImageService(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAnUB9nVxS6cAAAAASUVORK5CYII=";
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-pro:predict?key=" +
    GEMINI_API_KEY;

  const body = {
    instances: [{ prompt }],
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
    throw new Error("Google API error: " + raw);
  }

  const data = JSON.parse(raw);
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;

  if (!b64) throw new Error("No image returned");

  return `data:image/png;base64,${b64}`;
}
