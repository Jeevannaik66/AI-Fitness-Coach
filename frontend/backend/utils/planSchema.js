/**
 * Gemini Structured Output Schema
 * Ensures the model always returns:
 * - workoutPlan: Array of 7 days, each with exercises
 * - dietPlan: Array of 7 days, each with 4 specific meals
 * - tips: Array of strings
 * - summary: string
 */

export const planSchema = {
  // Use uppercase for main types as per API standard
  type: "OBJECT",
  properties: {
    workoutPlan: {
      type: "ARRAY",
      description: "A structured weekly workout plan (7 days).",
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "STRING", description: "Day title (e.g., 'Day 1: Chest & Triceps')" },
          exercises: {
            type: "ARRAY",
            description: "Exercises for that day.",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING", description: "Exercise name" },
                sets: { type: "STRING", description: "Number of sets (e.g., '3')" },
                reps: { type: "STRING", description: "Repetitions per set (e.g., '10-12')" },
                rest: { type: "STRING", description: "Rest time between sets (e.g., '60s')" },
                description: { type: "STRING", description: "Technique or instructions (MUST NOT be empty)." },
                homeAlternative: { type: "STRING", description: "Home workout alternative (if applicable)." },
                image: { type: "STRING", description: "Placeholder for an image URL." }
              },
              required: ["name", "sets", "reps"]
            }
          }
        },
        required: ["day", "exercises"]
      }
    },

    // CRITICAL CORRECTION: Restructured to enforce 7 days, each containing a 'meals' array
    dietPlan: {
      type: "ARRAY",
      description: "Daily meals and nutritional guidance for 7 days.",
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "STRING", description: "Day number (e.g., 'Day 1')" },
          meals: {
            type: "ARRAY",
            description: "Exactly 4 meals: Breakfast, Lunch, Dinner, Snacks. Descriptions MUST be provided.",
            items: {
              type: "OBJECT",
              properties: {
                meal: { type: "STRING", description: "Meal name (Breakfast / Lunch / Dinner / Snacks)" },
                description: { type: "STRING", description: "Detailed meal details and recipe. MUST NOT be empty." }
              },
              required: ["meal", "description"]
            }
          }
        },
        required: ["day", "meals"]
      }
    },

    tips: {
      type: "ARRAY",
      description: "General wellness, workout, sleep, and hydration tips (at least 5).",
      items: { type: "STRING" }
    },

    summary: {
      type: "STRING",
      description: "Short, positive, and personalized summary of the full plan (1-3 sentences)."
    }
  },

  // Added 'summary' to the required list for completeness
  required: ["workoutPlan", "dietPlan", "tips", "summary"]
};