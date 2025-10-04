import { connectDB } from "@/config/Database";
import Template from "@/modal/Template";
import { NextResponse } from "next/server";
import { UserResponse } from "@/modal/DynamicPopop";

// GET method
export async function GET(req) {
  try {
    await connectDB();
    
    console.log("=== Starting GET request for template questions ===");
    
    const userResponses = await UserResponse.find()
      .populate({
        path: 'templateId',
        select: 'name description',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'createdBy',
        select: 'fullName email',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✓ Found ${userResponses.length} template questions`);

    return NextResponse.json({
      success: true,
      data: userResponses,
    });
  } catch (error) {
    console.error("=== ERROR in GET /api/admin/questions ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch template questions",
      error: error.message,
      errorDetails: {
        name: error.name,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    }, { status: 500 });
  }
}

// POST method
export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { templateId, questions, createdBy } = body;

    if (!templateId || !questions || !createdBy) {
      return NextResponse.json({
        success: false,
        message: "Template ID, questions, and createdBy are required",
      }, { status: 400 });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return NextResponse.json({
        success: false,
        message: "Template not found",
      }, { status: 404 });
    }

    const existingQuestions = await UserResponse.findOne({ templateId });
    if (existingQuestions) {
      return NextResponse.json({
        success: false,
        message: "Questions already exist for this template. Use PUT to update.",
      }, { status: 400 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Questions must be a non-empty array",
      }, { status: 400 });
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2) {
        return NextResponse.json({
          success: false,
          message: `Question ${i + 1} must have text and at least 2 options`,
        }, { status: 400 });
      }
      
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return NextResponse.json({
          success: false,
          message: `Question ${i + 1} must have exactly one correct option`,
        }, { status: 400 });
      }
    }

    const newUserResponse = new UserResponse({
      templateId,
      questions: questions.map((q, index) => ({
        ...q,
        order: index + 1,
      })),
      createdBy: createdBy === "admin" ? null : createdBy,
    });

    await newUserResponse.save();

    return NextResponse.json({
      success: true,
      message: "Template questions created successfully",
      data: newUserResponse,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating template questions:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create template questions",
      error: error.message,
    }, { status: 500 });
  }
}

// PUT method
export async function PUT(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { templateId, questions, updatedBy } = body;

    if (!templateId || !questions) {
      return NextResponse.json({
        success: false,
        message: "Template ID and questions are required",
      }, { status: 400 });
    }

    const existingQuestions = await UserResponse.findOne({ templateId });
    if (!existingQuestions) {
      return NextResponse.json({
        success: false,
        message: "No questions found for this template",
      }, { status: 404 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Questions must be a non-empty array",
      }, { status: 400 });
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2) {
        return NextResponse.json({
          success: false,
          message: `Question ${i + 1} must have text and at least 2 options`,
        }, { status: 400 });
      }
      
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return NextResponse.json({
          success: false,
          message: `Question ${i + 1} must have exactly one correct option`,
        }, { status: 400 });
      }
    }

    existingQuestions.questions = questions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));
    
    if (updatedBy) {
      existingQuestions.createdBy = updatedBy;
    }

    await existingQuestions.save();

    return NextResponse.json({
      success: true,
      message: "Template questions updated successfully",
      data: existingQuestions,
    });
  } catch (error) {
    console.error("Error updating template questions:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update template questions",
      error: error.message,
    }, { status: 500 });
  }
}

// DELETE method
export async function DELETE(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json({
        success: false,
        message: "Template ID is required",
      }, { status: 400 });
    }

    const result = await UserResponse.findOneAndDelete({ templateId });

    if (!result) {
      return NextResponse.json({
        success: false,
        message: "No questions found for this template",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Template questions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template questions:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete template questions",
      error: error.message,
    }, { status: 500 });
  }
}