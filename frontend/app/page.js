"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import UserForm from "./components/forms/UserForm";
import WorkoutCard from "./components/plan/WorkoutCard";
import DietCard from "./components/plan/DietCard";
import TipsCard from "./components/plan/TipsCard";

// Utility PDF generator (local file)
import { generatePDF } from "./components/utils/pdf";

import {
  Dumbbell,
  Wand2,
  Sparkles,
  Share2,
  Download,
} from "lucide-react";

export default function Page() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  /* ---------------------------------------
        DARK MODE INITIALIZE + TOGGLE
  ---------------------------------------- */
  useEffect(() => {
    // Check system preference first, then localStorage
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem("darkMode");
    
    let initialDarkMode = systemPrefersDark;
    
    if (savedMode !== null) {
      initialDarkMode = savedMode === "true";
    }
    
    setDarkMode(initialDarkMode);
    applyDarkMode(initialDarkMode);
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    applyDarkMode(newDarkMode);
  };

  /* ---------------------------------------
            EXPORT PDF
  ---------------------------------------- */
  const exportToPDF = async () => {
    if (!plan) return;
    setIsGeneratingPDF(true);
    try {
      await generatePDF(plan);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /* ---------------------------------------
            SHARE PLAN
  ---------------------------------------- */
  const sharePlan = async () => {
    if (!plan) return;

    const shareText = `
AI FITNESS PLAN 🏋️‍♂️

${plan.summary || ""}

Workout days: ${plan.workoutPlan?.length || 0}
Diet days: ${plan.dietPlan?.length || 0}
Tips: ${plan.tips?.length || 0}

Generated with AI Fitness Coach
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My AI Fitness Plan",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Sharing cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Plan copied to clipboard! 📋");
      } catch {
        alert("Unable to copy plan to clipboard.");
      }
    }
  };

  /* ---------------------------------------
            NORMALIZE AI OUTPUT
  ---------------------------------------- */
  const normalizePlan = (aiPlan) => {
    if (!aiPlan) return null;

    return {
      workoutPlan: Array.isArray(aiPlan.workoutPlan)
        ? aiPlan.workoutPlan.map((item, idx) => ({
            day: item.day || `Day ${idx + 1}`,
            exercises: Array.isArray(item.exercises) ? item.exercises : [],
          }))
        : [],

      dietPlan: Array.isArray(aiPlan.dietPlan)
        ? aiPlan.dietPlan.map((item, idx) => ({
            day: item.day || `Day ${idx + 1}`,
            meals: Array.isArray(item.meals) ? item.meals : [],
          }))
        : [],

      tips: Array.isArray(aiPlan.tips) ? aiPlan.tips : [],

      summary: aiPlan.summary || "",
    };
  };

  /* ---------------------------------------
           GENERATE PLAN
  ---------------------------------------- */
  const handleGenerate = async (userData) => {
    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "AI error");

      const normalized = normalizePlan(json.data);
      setPlan(normalized);

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 400);
    } catch (e) {
      console.error("Generate error:", e);
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------
                UI
  ---------------------------------------- */
  return (
    <main
      className={`
        min-h-screen transition-colors duration-300
        bg-gradient-to-br 
        from-indigo-100 via-white to-green-100
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        py-12 px-4 sm:px-6
      `}
    >
      {/* FLOATING BUTTONS - DARK MODE BUTTON REMOVED */}
      <div className="fixed top-6 right-6 flex gap-3 z-50">
        {/* PDF Button - appears when plan exists */}
        {plan && (
          <motion.button
            onClick={exportToPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isGeneratingPDF}
            className={`
              flex items-center gap-2 px-4 py-3
              bg-gradient-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700
              text-white font-semibold rounded-2xl 
              shadow-xl hover:shadow-2xl
              transition-all duration-300
              backdrop-blur-xl
              ${isGeneratingPDF ? "opacity-70 cursor-not-allowed" : ""}
            `}
            title="Export plan as PDF"
          >
            {isGeneratingPDF ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {isGeneratingPDF ? "Generating..." : "Export PDF"}
            </span>
          </motion.button>
        )}

        {/* Share Plan Button */}
        {plan && (
          <motion.button
            onClick={sharePlan}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="
              flex items-center gap-2 px-4 py-3
              bg-gradient-to-r from-blue-500 to-indigo-600 
              hover:from-blue-600 hover:to-indigo-700
              text-white font-semibold rounded-2xl 
              shadow-xl hover:shadow-2xl
              transition-all duration-300
              backdrop-blur-xl
            "
            title="Share your fitness plan"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </motion.button>
        )}
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center items-center gap-4 mb-4"
        >
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
            <Dumbbell className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            AI Fitness Coach
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-300 text-lg"
        >
          Personalized workouts. Smart diet plans. Real results. 💪
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 dark:text-gray-400 mt-2"
        >
          Get your custom plan in seconds with advanced AI technology
        </motion.p>
      </motion.div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE — FORM */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="
            rounded-3xl p-6 
            bg-white/60 dark:bg-gray-900/60 
            backdrop-blur-xl border border-white/30 dark:border-gray-700/30 
            shadow-xl h-fit lg:sticky lg:top-8
          "
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl"
            >
              <Wand2 className="w-5 h-5 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Build Your Custom Plan
            </h2>
          </div>

          <UserForm onSubmit={handleGenerate} />

          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-lg flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"
              />
              <span className="font-medium">Generating your personalized plan... ⏳</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg"
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT SIDE — RESULTS */}
        <motion.div
          id="results-section"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-10"
        >
          {/* BEFORE GENERATION PLACEHOLDER */}
          {!plan && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                rounded-3xl p-12 text-center
                bg-white/60 dark:bg-gray-900/60
                backdrop-blur-xl border border-white/30 dark:border-gray-700/30 
                shadow-xl
              "
            >
              <Sparkles className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Your AI Plan Awaits!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Fill out the form and watch your personalized fitness plan come to life
              </p>
              <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Workout Plans
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Diet Plans
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Expert Tips
                </div>
              </div>
            </motion.div>
          )}

          {/* WORKOUT PLAN */}
          {plan?.workoutPlan?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🏋️ Workout Plan
                </h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {plan.workoutPlan.map((day, i) => (
                  <WorkoutCard key={i} day={day.day} exercises={day.exercises} />
                ))}
              </div>
            </motion.section>
          )}

          {/* DIET PLAN */}
          {plan?.dietPlan?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <span className="text-white text-lg">🥗</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Diet Plan
                </h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {plan.dietPlan.map((day, i) => (
                  <DietCard key={i} day={day.day} meals={day.meals} />
                ))}
              </div>
            </motion.section>
          )}

          {/* TIPS */}
          {plan?.tips?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <span className="text-white text-lg">💡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Daily Tips
                </h2>
              </div>
              <TipsCard tips={plan.tips} />
            </motion.section>
          )}

          {/* SUMMARY - WITHOUT AUDIO PLAYER */}
          {plan?.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="
                p-6 rounded-3xl 
                bg-white/60 dark:bg-gray-900/60 
                backdrop-blur-xl border border-white/30 dark:border-gray-700/30
                shadow-xl
              "
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Plan Summary
              </h3>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {plan.summary}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}