"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Dumbbell, ArrowRightCircle, Camera, Volume2, VolumeX } from "lucide-react";

export default function WorkoutCard({ day, exercises }) {
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  const [loadingIndex, setLoadingIndex] = useState(null);
  const [exerciseImages, setExerciseImages] = useState({});
  const [speaking, setSpeaking] = useState(false);

  const audioRef = useRef(null);

  // --------------------------------------------------------------------
  // 🔊 READ **ONLY THIS DAY'S WORKOUT** USING THE UPDATED /api/tts ROUTE
  // --------------------------------------------------------------------
  async function handleSpeakWorkout() {
    try {
      if (!safeExercises.length) {
        alert("No exercises to read.");
        return;
      }

      // Build exact workout text (no summaries)
      const workoutText =
        `Here is your workout for ${day}.\n\n` +
        safeExercises
          .map((ex, i) => {
            return `Exercise ${i + 1}: ${ex.name}. ` +
              (ex.sets && ex.reps ? `Do ${ex.sets} sets of ${ex.reps} reps. ` : "") +
              (ex.duration ? `Duration: ${ex.duration}. ` : "") +
              (ex.notes ? `Notes: ${ex.notes}. ` : "") +
              (ex.homeAlternative ? `Home alternative: ${ex.homeAlternative}. ` : "") +
              (ex.rest ? `Rest: ${ex.rest}. ` : "");
          })
          .join(" ");

      // Send ONLY workoutText to the updated API (NO dietText)
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutText }),
      });

      const json = await res.json();

      if (!json.success) {
        console.error("TTS error:", json.error);
        alert("Speech generation failed.");
        return;
      }

      // Play audio
      const audio = new Audio(json.audioUrl);
      audioRef.current = audio;
      setSpeaking(true);

      audio.play();
      audio.onended = () => setSpeaking(false);

    } catch (err) {
      console.error("TTS error:", err);
      alert("Failed to play workout.");
    }
  }

  // Stop speech
  function stopSpeech() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSpeaking(false);
  }

  // --------------------------------------------------------------------
  // 🖼 IMAGE GENERATION (unchanged)
  // --------------------------------------------------------------------
  async function handleGenerateImage(exerciseName, index) {
    try {
      setLoadingIndex(index);

      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${exerciseName} workout exercise demonstration, realistic, high quality, gym setting, clear form`,
        }),
      });

      const json = await res.json();
      setLoadingIndex(null);

      if (!json.success) {
        alert("Image generation failed.");
        return;
      }

      setExerciseImages((prev) => ({
        ...prev,
        [index]: json.image,
      }));
    } catch (err) {
      setLoadingIndex(null);
      console.error("Image generation failed:", err);
      alert("Image generation failed.");
    }
  }

  // --------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.28 }}
      className="
        p-6 rounded-3xl 
        bg-gradient-to-br from-white/60 to-white/30 
        dark:from-gray-900/60 dark:to-gray-800/30
        backdrop-blur-xl 
        shadow-xl hover:shadow-2xl 
        border border-white/20 dark:border-gray-700/20
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            {day}
          </h3>
        </div>

        {/* 🔊 SPEAK WORKOUT BUTTON */}
        <button
          onClick={speaking ? stopSpeech : handleSpeakWorkout}
          className="
            flex items-center gap-2 px-3 py-1
            bg-purple-600 hover:bg-purple-700
            text-white text-xs rounded-full shadow-md active:scale-95
          "
        >
          {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {speaking ? "Stop" : "Read Workout"}
        </button>
      </div>

      {/* EXERCISE LIST */}
      <div className="space-y-6">
        {safeExercises.length === 0 ? (
          <div className="text-center text-gray-500 italic">No exercises.</div>
        ) : null}

        {safeExercises.map((ex, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.07 }}
            className="
              relative p-5 rounded-2xl 
              bg-gray-100/70 dark:bg-gray-800/70 
              border border-gray-200/60 dark:border-gray-700/60
              shadow-md hover:shadow-xl transition
            "
          >
            {/* Side color bar */}
            <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-xl"></div>

            <div className="flex justify-between items-start gap-4">
              {/* DETAILS */}
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {ex.name || "Unnamed Exercise"}
                </div>

                {ex.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ex.notes}</p>}

                {ex.homeAlternative && (
                  <div className="text-xs mt-2 flex items-center gap-1 text-gray-500">
                    <ArrowRightCircle className="w-3 h-3 text-indigo-400" />
                    Home Alternative: {ex.homeAlternative}
                  </div>
                )}

                {ex.rest && <p className="text-xs mt-1 text-gray-500">Rest: {ex.rest}</p>}
              </div>

              {/* SETS × REPS BADGE */}
              <div
                className="
                  px-3 py-1 rounded-full text-xs 
                  bg-gradient-to-r from-indigo-500 to-purple-600 
                  text-white font-semibold shadow-md
                  whitespace-nowrap
                "
              >
                {ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : ex.duration || "—"}
              </div>
            </div>

            {/* IMAGE DISPLAY */}
            {exerciseImages[idx] && (
              <div className="mt-4">
                <img
                  src={exerciseImages[idx]}
                  alt="exercise"
                  className="w-full rounded-xl shadow-md border border-gray-300 dark:border-gray-600"
                />
              </div>
            )}

            {/* IMAGE BUTTON */}
            <button
              onClick={() => handleGenerateImage(ex.name, idx)}
              className="
                mt-4 flex items-center gap-2 px-3 py-1 
                bg-indigo-500 hover:bg-indigo-600 
                text-white text-xs rounded-lg shadow active:scale-95
              "
            >
              <Camera className="w-4 h-4" />
              {loadingIndex === idx
                ? "Creating..."
                : exerciseImages[idx]
                ? "Re-generate"
                : "Generate Image"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
