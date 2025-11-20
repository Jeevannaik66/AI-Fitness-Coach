// frontend/app/components/utils/pdf.js

export async function generatePDF(plan) {
  if (!plan) throw new Error("No plan data received for PDF export.");

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ 
    unit: "pt", 
    format: "a4",
    compress: true
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 50;
  let y = 70;

  // Colors for professional design
  const colors = {
    primary: [41, 128, 185],
    secondary: [52, 152, 219],
    accent: [46, 204, 113],
    dark: [50, 50, 50],
    light: [100, 100, 100],
    background: [248, 249, 250]
  };

  const newPage = () => {
    pdf.addPage();
    y = 70;
    addHeader();
  };

  const checkY = (spaceNeeded = 20) => {
    if (y + spaceNeeded > 720) {
      newPage();
      return true;
    }
    return false;
  };

  // Add header to each page
  const addHeader = () => {
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text("AI FITNESS COACH", margin, 30);
    
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255, 0.8);
    pdf.text("Personalized Fitness Plan", pageWidth - margin, 30, { align: 'right' });
  };

  // Add section header with underline
  const addSectionHeader = (text, color = colors.primary) => {
    checkY(40);
    
    pdf.setFontSize(20);
    pdf.setTextColor(...color);
    pdf.setFont(undefined, 'bold');
    pdf.text(text, margin, y);
    
    // Underline
    pdf.setDrawColor(...color);
    pdf.setLineWidth(2);
    pdf.line(margin, y + 5, margin + 120, y + 5);
    
    y += 30;
  };

  // Add subsection header
  const addSubHeader = (text, color = colors.dark) => {
    checkY(25);
    
    pdf.setFillColor(...colors.background);
    pdf.rect(margin - 10, y - 15, pageWidth - margin * 2 + 20, 22, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(...color);
    pdf.setFont(undefined, 'bold');
    pdf.text(text, margin, y);
    
    y += 20;
  };

  // Add bullet point with proper spacing
  const addBullet = (text, indent = 0, isBold = false) => {
    checkY(18);
    
    pdf.setFontSize(11);
    pdf.setTextColor(...colors.dark);
    
    if (isBold) {
      pdf.setFont(undefined, 'bold');
    } else {
      pdf.setFont(undefined, 'normal');
    }
    
    // Bullet point
    pdf.setFillColor(...colors.primary);
    pdf.circle(margin + indent, y - 4, 2, 'F');
    
    // Text
    const lines = pdf.splitTextToSize(text, pageWidth - margin * 2 - indent - 15);
    lines.forEach((line, index) => {
      if (index > 0) checkY(16);
      pdf.text(line, margin + indent + 10, y);
      y += 16;
    });
  };

  // Add detail line
  const addDetail = (text, indent = 0) => {
    checkY(14);
    
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.light);
    pdf.setFont(undefined, 'normal');
    
    const lines = pdf.splitTextToSize(text, pageWidth - margin * 2 - indent - 10);
    lines.forEach((line, index) => {
      if (index > 0) checkY(14);
      pdf.text(line, margin + indent + 10, y);
      y += 14;
    });
  };

  // Add spacing
  const addSpacing = (space = 10) => {
    y += space;
  };

  /* -----------------------------------
          COVER PAGE
  ----------------------------------- */
  addHeader();
  
  // Main title
  pdf.setFontSize(32);
  pdf.setTextColor(...colors.primary);
  pdf.setFont(undefined, 'bold');
  pdf.text("FITNESS PLAN", pageWidth / 2, 200, { align: 'center' });
  
  // Subtitle
  pdf.setFontSize(16);
  pdf.setTextColor(...colors.light);
  pdf.setFont(undefined, 'normal');
  pdf.text("Personalized Workout & Nutrition Guide", pageWidth / 2, 230, { align: 'center' });
  
  // Decorative line
  pdf.setDrawColor(...colors.accent);
  pdf.setLineWidth(3);
  pdf.line(pageWidth / 2 - 100, 250, pageWidth / 2 + 100, 250);
  
  // Generation info
  pdf.setFontSize(12);
  pdf.setTextColor(...colors.light);
  pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, 300, { align: 'center' });
  
  y = 400;

  /* -----------------------------------
          SUMMARY SECTION
  ----------------------------------- */
  newPage();
  
  if (plan.summary) {
    addSectionHeader("Plan Overview", colors.primary);
    
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.dark);
    pdf.setFont(undefined, 'normal');
    
    const summaryLines = pdf.splitTextToSize(plan.summary, pageWidth - margin * 2);
    summaryLines.forEach((line) => {
      checkY(18);
      pdf.text(line, margin, y);
      y += 18;
    });
    
    addSpacing(30);
  }

  /* -----------------------------------
          WORKOUT PLAN
  ----------------------------------- */
  if (plan.workoutPlan?.length > 0) {
    addSectionHeader("Workout Program", colors.secondary);
    
    plan.workoutPlan.forEach((dayObj, dayIndex) => {
      // Day header
      addSubHeader(`${dayObj.day}`, colors.secondary);
      
      // Exercises
      dayObj.exercises.forEach((ex, exIndex) => {
        // Exercise name
        addBullet(ex.name, 0, true);
        
        // Exercise details
        let details = [];
        if (ex.sets && ex.reps) details.push(`${ex.sets} sets × ${ex.reps} reps`);
        if (ex.duration) details.push(`Duration: ${ex.duration}`);
        if (ex.rest) details.push(`Rest: ${ex.rest}`);
        
        if (details.length > 0) {
          addDetail(details.join(' • '), 15);
        }
        
        // Notes
        if (ex.notes) {
          addDetail(`Notes: ${ex.notes}`, 15);
        }
        
        // Home alternative
        if (ex.homeAlternative) {
          addDetail(`Home Alternative: ${ex.homeAlternative}`, 15);
        }
        
        addSpacing(8);
      });
      
      addSpacing(20);
    });
  }

  /* -----------------------------------
          NUTRITION PLAN
  ----------------------------------- */
  if (plan.dietPlan?.length > 0) {
    newPage();
    addSectionHeader("Nutrition Guide", colors.accent);
    
    plan.dietPlan.forEach((dayObj, dayIndex) => {
      // Day header
      addSubHeader(`${dayObj.day}`, colors.accent);
      
      // Meals
      dayObj.meals.forEach((meal, mealIndex) => {
        // Meal name
        addBullet(meal.meal, 0, true);
        
        // Meal description
        const mealText = meal.description || meal.foods || '';
        if (mealText) {
          addDetail(mealText, 15);
        }
        
        // Calories
        if (meal.calories) {
          addDetail(`Calories: ${meal.calories}`, 15);
        }
        
        addSpacing(8);
      });
      
      addSpacing(20);
    });
  }

  /* -----------------------------------
          TIPS & GUIDANCE
  ----------------------------------- */
  if (plan.tips?.length > 0) {
    newPage();
    addSectionHeader("Daily Guidance", [155, 89, 182]);
    
    plan.tips.forEach((tip, tipIndex) => {
      addBullet(tip, 0, false);
      addSpacing(5);
    });
  }

  /* -----------------------------------
          FINAL PAGE - CLOSING
  ----------------------------------- */
  newPage();
  
  pdf.setFontSize(24);
  pdf.setTextColor(...colors.primary);
  pdf.setFont(undefined, 'bold');
  pdf.text("Stay Consistent", pageWidth / 2, 200, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(...colors.light);
  pdf.setFont(undefined, 'normal');
  
  const closingText = [
    "Remember: Progress takes time and consistency.",
    "Celebrate small victories along the way.",
    "Listen to your body and adjust as needed.",
    "Keep pushing towards your goals."
  ];
  
  let closingY = 250;
  closingText.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, closingY, { align: 'center' });
    closingY += 30;
  });

  /* -----------------------------------
          FOOTER FOR ALL PAGES
  ----------------------------------- */
  const totalPages = pdf.internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Page number
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.light);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pdf.internal.pageSize.height - 30,
      { align: 'center' }
    );
    
    // Confidential notice on first page
    if (i === 1) {
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        "Confidential - Personalized Fitness Plan",
        pageWidth / 2,
        pdf.internal.pageSize.height - 15,
        { align: 'center' }
      );
    }
  }

  /* -----------------------------------
          SAVE PDF
  ----------------------------------- */
  const fileName = `Fitness-Plan-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

/**
 * Premium PDF download function
 */
export async function downloadFitnessPDF(plan) {
  try {
    if (!plan) {
      throw new Error("No fitness plan data available.");
    }

    // Enhanced validation
    const hasWorkouts = plan.workoutPlan?.length > 0;
    const hasDiet = plan.dietPlan?.length > 0;
    const hasTips = plan.tips?.length > 0;

    if (!hasWorkouts && !hasDiet) {
      throw new Error("No workout or nutrition data found.");
    }

    console.log("🔄 Generating premium PDF...");
    
    await generatePDF(plan);
    
    return { 
      success: true, 
      message: "Premium PDF generated successfully!",
      stats: {
        workoutDays: hasWorkouts ? plan.workoutPlan.length : 0,
        dietDays: hasDiet ? plan.dietPlan.length : 0,
        tips: hasTips ? plan.tips.length : 0
      }
    };
    
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
    return { 
      success: false, 
      message: error.message || "Failed to generate PDF. Please try again.",
      error: error.toString()
    };
  }
}