import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { TemplateQuestions } from "@/modal/DynamicPopop";

export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all questions from the database without any filtering
    const allQuestions = await TemplateQuestions.find()
      .populate('templateId', 'name type') // Populate template information
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    // Return success response with all questions
    return NextResponse.json({
      success: true,
      message: "Questions fetched successfully",
      questions: allQuestions,
      count: allQuestions.length
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}