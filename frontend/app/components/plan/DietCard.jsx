"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Coffee,
  Sandwich,
  Apple,
  Drumstick,
  Image as ImageIcon,
  Volume2,
  VolumeX
} from "lucide-react";

// MEAL ICONS
const mealIcons = {
  Breakfast: <Coffee className="text-orange-500" />,
  Lunch: <Sandwich className="text-green-500" />,
  Dinner: <Drumstick className="text-purple-500" />,
  Snacks: <Apple className="text-red-500" />,
  Default: <Utensils className="text-indigo-500" />,
};

export default function DietCard({ day, meals }) {
  const safeMeals = Array.isArray(meals) ? meals : [];

  const [loadingIndex, setLoadingIndex] = useState(null);
  const [mealImages, setMealImages] = useState({});
  const [speaking, setSpeaking] = useState(false);

  const audioRef = useRef(null);

  // --------------------------------------------------------------------
  // 🔊 READ THIS DAY'S DIET ONLY (NO SUMMARY)
  // --------------------------------------------------------------------
  async function handleSpeakDiet() {
    try {
      if (!safeMeals.length) {
        alert("No meals to read.");
        return;
      }

      // Build exact readable diet text
      const dietText =
        `Here is your diet for ${day}.\n\n` +
        safeMeals
          .map((meal, i) => {
            return `Meal ${i + 1}: ${meal.meal}. ${meal.description || ""}. ` +
              (meal.calories ? `Calories: ${meal.calories}. ` : "");
          })
          .join(" ");

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietText }),
      });

      const json = await res.json();

      if (!json.success) {
        console.error("Diet TTS error:", json.error);
        alert("Speech generation failed.");
        return;
      }

      const audio = new Audio(json.audioUrl);
      audioRef.current = audio;

      setSpeaking(true);
      audio.play();
      audio.onended = () => setSpeaking(false);

    } catch (err) {
      console.error("Diet TTS error:", err);
      alert("Failed to play diet.");
    }
  }

  // Stop diet speech
  function stopSpeech() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSpeaking(false);
  }

  // --------------------------------------------------------------------
  // 🖼 IMAGE GENERATION
  // --------------------------------------------------------------------
  async function handleImageGenerate(mealName, description, index) {
    try {
      setLoadingIndex(index);

      const prompt = `${mealName}, ${description}, high-quality food photography, realistic, clean white background, appetizing`;

      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      setLoadingIndex(null);

      if (!json.success) {
        console.error("Image error:", json.error);
        alert("Failed to generate image.");
        return;
      }

      setMealImages((prev) => ({
        ...prev,
        [index]: json.image,
      }));
    } catch (err) {
      console.error("Image generation failed:", err);
      setLoadingIndex(null);
      alert("Image generation failed.");
    }
  }

  // --------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="
        p-6 rounded-3xl
        bg-gradient-to-br from-white/60 to-white/30
        dark:from-gray-900/60 dark:to-gray-800/40
        backdrop-blur-xl
        border border-white/20 dark:border-gray-700/20
        shadow-xl hover:shadow-2xl
      "
    >
      {/* HEADER + SPEAK BUTTON */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          {day}
        </h3>

        <button
          onClick={speaking ? stopSpeech : handleSpeakDiet}
          className="
            flex items-center gap-2 px-3 py-1
            bg-orange-600 hover:bg-orange-700
            text-white text-xs rounded-full shadow-md active:scale-95
          "
        >
          {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {speaking ? "Stop" : "Read Diet"}
        </button>
      </div>

      {/* MEAL LIST */}
      <div className="space-y-6">
        {safeMeals.length === 0 && (
          <div className="text-center text-gray-500 italic">
            No meals available.
          </div>
        )}

        {safeMeals.map((meal, index) => {
          const mealName = meal.meal || `Meal ${index + 1}`;
          const description = meal.description || "Description not available";
          const calories = meal.calories || null;
          const icon = mealIcons[mealName] || mealIcons.Default;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: index * 0.06 }}
              className="
                p-5 rounded-2xl
                bg-gray-100/70 dark:bg-gray-800/70
                border border-gray-200/60 dark:border-gray-700/60
                shadow-md hover:shadow-xl transition
              "
            >
              <div className="flex justify-between items-start gap-4">
                {/* LEFT SIDE */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-900 shadow-md">
                    {icon}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      {mealName}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-snug">
                      {description}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col items-end gap-2">
                  {/* Calories */}
                  {calories && (
                    <div
                      className="
                        px-3 py-1 rounded-full text-xs
                        bg-gradient-to-r from-orange-500 to-red-500
                        text-white font-semibold shadow-md
                      "
                    >
                      {calories} kcal
                    </div>
                  )}

                  {/* Image Button */}
                  <button
                    onClick={() =>
                      handleImageGenerate(mealName, description, index)
                    }
                    className="
                      flex items-center gap-1 px-3 py-1
                      bg-indigo-500 hover:bg-indigo-600
                      text-white text-xs rounded-lg shadow-md
                    "
                  >
                    <ImageIcon className="w-4 h-4" />
                    {loadingIndex === index
                      ? "Loading..."
                      : mealImages[index]
                      ? "Re-gen"
                      : "Image"}
                  </button>
                </div>
              </div>

              {/* Meal Image */}
              {mealImages[index] && (
                <div className="mt-4">
                  <img
                    src={mealImages[index]}
                    alt={mealName}
                    className="w-full rounded-xl shadow border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
