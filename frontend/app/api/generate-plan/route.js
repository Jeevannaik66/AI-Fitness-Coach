import { NextResponse } from "next/server";
import { generatePlanService } from "@/backend/services/plan.service.js";

/**
 * POST /api/generate-plan
 * Generates a full AI fitness plan (workout + diet + tips + summary)
 */
export async function POST(request) {
  try {
    // -----------------------------------
    // Parse request body
    // -----------------------------------
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // -----------------------------------
    // Validate required fields
    // -----------------------------------
    const requiredFields = [
      "name",
      "age",
      "gender",
      "height",
      "weight",
      "goal",
      "level",
      "location",
      "dietPref",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    // -----------------------------------
    // Generate AI plan via service layer
    // -----------------------------------
    const result = await generatePlanService(body);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );

  } catch (err) {
    console.error("API ERROR (/generate-plan):", err);

    return NextResponse.json(
      { success: false, error: "AI plan generation failed. Try again later." },
      { status: 500 }
    );
  }
}
