import { genAI } from "../lib/geminiClient.js";
import { buildPlanPrompt } from "../utils/buildPrompt.js";

/**
 * Universal Gemini Fitness Plan Generator
 * Fully normalized so UI never breaks.
 */
export async function generatePlanService(userData) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = buildPlanPrompt(userData);
    const result = await model.generateContent(prompt);

    const rawText = result.response.text();
    const jsonText = extractJSON(rawText);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("❌ JSON parsing failed:", err);
      return { raw: jsonText };
    }

    // 🔥 Normalize EVERYTHING
    const normalized = normalizePlan(parsed);

    return normalized;

  } catch (error) {
    console.error("Gemini Plan Generation Error:", error);
    throw new Error("Failed to generate a complete and valid fitness plan.");
  }
}

/**
 * Extract JSON safely from model output
 */
function extractJSON(text) {
  if (!text) return "";

  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first !== -1 && last !== -1) {
    cleaned = cleaned.substring(first, last + 1);
  }

  return cleaned;
}

/**
 * 🔥 MASTER NORMALIZER
 * Ensures the full plan is ALWAYS valid.
 */
function normalizePlan(plan) {
  return {
    workoutPlan: normalizeWorkoutPlan(plan.workoutPlan),
    dietPlan: normalizeDietPlan(plan.dietPlan),
    tips: Array.isArray(plan.tips) ? plan.tips : [],
    summary: plan.summary || "",
  };
}

/**
 * 🔥 NORMALIZE WORKOUT PLAN
 * ALWAYS 7 days
 * ALWAYS minimum 4 exercises/day
 */
function normalizeWorkoutPlan(data) {
  const DEFAULT_EXERCISES = [
    {
      name: "Bodyweight Squats",
      sets: "3",
      reps: "12–15",
      rest: "60s",
      notes: "Keep chest lifted and core tight.",
    },
    {
      name: "Push-Ups",
      sets: "3",
      reps: "10–12",
      rest: "60s",
      notes: "Engage your core and keep elbows tucked.",
    },
    {
      name: "Glute Bridges",
      sets: "3",
      reps: "12–15",
      rest: "45s",
      notes: "Squeeze glutes at the top.",
    },
    {
      name: "Plank",
      sets: "3",
      reps: "30s hold",
      rest: "45s",
      notes: "Keep back straight.",
    },
  ];

  const safe = Array.isArray(data) ? data : [];

  const final = [];

  for (let i = 0; i < 7; i++) {
    const dayObj = safe[i] || {};

    let exercises = Array.isArray(dayObj.exercises)
      ? dayObj.exercises
      : [];

    if (exercises.length < 4) {
      exercises = DEFAULT_EXERCISES;
    }

    final.push({
      day: dayObj.day || `Day ${i + 1}`,
      exercises,
    });
  }

  return final;
}

/**
 * 🔥 NORMALIZE DIET PLAN
 * ALWAYS 7 days
 * ALWAYS 4 meals/day:
 *  Breakfast, Lunch, Dinner, Snacks
 */
function normalizeDietPlan(data) {
  const REQUIRED_MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  // FIX 1: convert object → array ALWAYS
  let safe = [];

  if (Array.isArray(data)) {
    safe = data;
  } else if (typeof data === "object" && data !== null) {
    // Convert { "Day 1": {...}, "Day 2": {...} } → [ {...}, {...} ]
    safe = Object.keys(data).map((key) => ({
      day: key,
      meals: data[key].meals || data[key],
    }));
  }

  const final = [];

  for (let i = 0; i < 7; i++) {
    const dayObj = safe[i] || {};

    let meals = dayObj.meals;

    // FIX 2: Convert wrong meal formats
    if (!Array.isArray(meals)) {
      if (typeof meals === "object" && meals !== null) {
        meals = Object.values(meals);
      } else {
        meals = [];
      }
    }

    // FIX 3: ALWAYS force strict 4-meal structure
    const fixedMeals = REQUIRED_MEALS.map((mealName) => {
      const existing = meals.find((m) => m.meal === mealName);
      return (
        existing || {
          meal: mealName,
          description: "A balanced, nutritious meal aligned with your fitness goals.",
        }
      );
    });

    final.push({
      day: `Day ${i + 1}`,
      meals: fixedMeals,
    });
  }

  return final;
}

