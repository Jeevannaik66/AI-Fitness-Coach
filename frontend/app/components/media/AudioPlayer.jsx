// frontend/app/components/media/AudioPlayer.jsx
"use client";

import React, { useState, useRef } from "react";

/**
 * AudioPlayer
 * - props:
 *    text (string) : text to speak
 *    label (string) : optional label for UI (e.g., "Read Summary")
 *    voiceOptions (array) : optional voice configs to choose from
 *
 * Behavior:
 * - Calls POST /api/tts with { text, voice, rate, pitch }
 * - Receives { success, audioUrl } and plays it in an <audio> element
 */

export default function AudioPlayer({
  text = "",
  label = "Play",
  voiceOptions = [
    { key: "en-US-Wavenet-F", name: "en-US - Female (Wavenet F)", languageCode: "en-US" },
    { key: "en-US-Wavenet-D", name: "en-US - Male (Wavenet D)", languageCode: "en-US" },
  ],
}) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0].key);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const audioRef = useRef(null);

  async function handlePlay() {
    if (!text || !text.trim()) {
      alert("No text to read.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        text,
        voice: { languageCode: voiceOptions.find((v) => v.key === selectedVoice)?.languageCode || "en-US", name: selectedVoice },
        rate: Number(rate),
        pitch: Number(pitch),
        audioEncoding: "MP3",
      };

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      setLoading(false);

      if (!json.success) {
        console.error("TTS error:", json.error);
        alert("Text-to-speech failed: " + (json.error || "unknown"));
        return;
      }

      setAudioUrl(json.audioUrl);

      // a tiny timeout to ensure state updates and audio element is present
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = json.audioUrl;
          audioRef.current.load();
          audioRef.current.play().catch((e) => {
            console.warn("Auto-play blocked or failed:", e);
          });
        }
      }, 100);
    } catch (err) {
      setLoading(false);
      console.error("TTS request failed:", err);
      alert("TTS request failed.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          disabled={loading}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm disabled:opacity-60"
        >
          {loading ? "Loading..." : label}
        </button>

        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="text-sm px-2 py-1 rounded-md border"
        >
          {voiceOptions.map((v) => (
            <option key={v.key} value={v.key}>
              {v.name}
            </option>
          ))}
        </select>

        <label className="text-sm text-gray-600 ml-2">Rate</label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-24"
        />

        <label className="text-sm text-gray-600">Pitch</label>
        <input
          type="range"
          min="-6.0"
          max="6.0"
          step="0.5"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          className="w-24"
        />
      </div>

      {/* Native audio element */}
      <audio ref={audioRef} controls className="w-full mt-1">
        {audioUrl ? <source src={audioUrl} /> : null}
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
