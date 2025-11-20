/**
 * Generates a fully structured, LLM-optimized prompt for producing a
 * predictable & valid 7-day fitness plan:
 * - 7 days workoutPlan
 * - 7 days dietPlan (4 meals per day)
 * - tips[]
 * - summary
 *
 * Enforces STRICT JSON output with no markdown or extra text.
 *
 * @param {object} userData
 * @returns {string}
 */
export function buildPlanPrompt(userData) {
  return `
You are a certified fitness coach and sports nutrition specialist.
Using the user's data below, create a **fully personalized 7-day fitness program**.

===========================================
USER PROFILE (USE THIS FOR CUSTOMIZATION)
===========================================
${JSON.stringify(userData, null, 2)}

===========================================
STRICT OUTPUT POLICY (EXTREMELY IMPORTANT)
===========================================
Your ENTIRE response MUST be:

✔ ONLY **one valid JSON object**  
✔ No markdown  
✔ No backticks  
✔ No commentary  
✔ No explanations  
✔ No extra words outside the JSON  

The JSON MUST contain ONLY these 4 keys:

{
  "workoutPlan": [...],
  "dietPlan": [...],
  "tips": [...],
  "summary": "..."
}

No extra keys are allowed.

===========================================
WORKOUT PLAN — HARD RULES
===========================================
"workoutPlan" MUST be an ARRAY of EXACTLY **7 objects**:

[
  {
    "day": "Day 1",
    "exercises": [
      {
        "name": "Exercise",
        "sets": "3",
        "reps": "10-12",
        "rest": "60s",
        "notes": "Form cue or alternative"
      }
    ]
  }
]

MANDATORY RULES:
- MUST contain **Day 1 → Day 7**, no skipping.
- Each day MUST contain **at least 4 exercises**.
- Every exercise MUST have:
  • name  
  • sets  
  • reps  
  • rest  
  • notes (cannot be empty)
- Exercises MUST match their:
  • fitness level  
  • goals  
  • available equipment  
  • injury limitations (if any)

===========================================
DIET PLAN — 4 MEALS PER DAY (STRICT)
===========================================
"dietPlan" MUST be an ARRAY of EXACTLY **7 objects**:

[
  {
    "day": "Day 1",
    "meals": [
      { "meal": "Breakfast", "description": "..." },
      { "meal": "Lunch", "description": "..." },
      { "meal": "Dinner", "description": "..." },
      { "meal": "Snacks", "description": "..." }
    ]
  }
]

STRICT RULES:
- EXACTLY 7 days (Day 1 → Day 7)
- EXACTLY **4 meals per day**, with FIXED names:
  1. Breakfast
  2. Lunch
  3. Dinner
  4. Snacks
- Each "description" MUST be:
  ✔ meaningful  
  ✔ specific  
  ✔ goal-aligned  
  ✔ based on dietary restrictions  
  ✘ NOT empty  
  ✘ NOT generic terms like “healthy food”  
- Meals MUST be realistic & culturally appropriate.

===========================================
TIPS SECTION — REQUIRED
===========================================
"tips" MUST be an ARRAY containing **at least 5 meaningful tips**.
Each tip MUST be practical, actionable, and useful.

===========================================
SUMMARY SECTION — REQUIRED
===========================================
"summary" MUST be a motivational paragraph (1–3 sentences).
It MUST be positive, supportive, and tailored to the user.

===========================================
FINAL INSTRUCTIONS (NON-NEGOTIABLE)
===========================================
OUTPUT MUST BE:
✔ ONLY pure JSON  
✔ STRICTLY following the structures above  
✔ No markdown  
✔ No code fences  
✔ No prose outside JSON  

FAILURE TO FOLLOW THIS EXACT FORMAT IS NOT ALLOWED.

===========================================
NOW OUTPUT THE FINAL JSON ONLY.
===========================================
`;
}
