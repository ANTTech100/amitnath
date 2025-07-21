import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { TemplateQuestions } from "@/modal/DynamicPopop";
import Template from "@/modal/Template";

// GET - Fetch all template questions
export async function GET() {
  try {
    await connectDB();
    
    const templateQuestions = await TemplateQuestions.find()
      .populate('templateId', 'name description')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: templateQuestions,
    });
  } catch (error) {
    console.error("Error fetching template questions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch template questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create questions for a template
export async function POST(request) {
  try {
    const { templateId, questions, createdBy } = await request.json();

    if (!templateId || !questions || !createdBy) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID, questions, and createdBy are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify template exists
    const template = await Template.findById(templateId);
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          message: "Template not found",
        },
        { status: 404 }
      );
    }

    // Check if questions already exist for this template
    const existingQuestions = await TemplateQuestions.findOne({ templateId });
    if (existingQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: "Questions already exist for this template. Use PUT to update.",
        },
        { status: 400 }
      );
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Questions must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have text and at least 2 options`,
          },
          { status: 400 }
        );
      }
      
      // Ensure only one correct option per question
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have exactly one correct option`,
          },
          { status: 400 }
        );
      }
    }

    // Create template questions
    const templateQuestions = new TemplateQuestions({
      templateId,
      questions: questions.map((q, index) => ({
        ...q,
        order: index + 1,
      })),
      createdBy: createdBy === "admin" ? null : createdBy, // Handle admin case
    });

    await templateQuestions.save();

    return NextResponse.json({
      success: true,
      message: "Template questions created successfully",
      data: templateQuestions,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating template questions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create template questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update questions for a template
export async function PUT(request) {
  try {
    const { templateId, questions, updatedBy } = await request.json();

    if (!templateId || !questions) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID and questions are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find existing questions
    const existingQuestions = await TemplateQuestions.findOne({ templateId });
    if (!existingQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: "No questions found for this template",
        },
        { status: 404 }
      );
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Questions must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have text and at least 2 options`,
          },
          { status: 400 }
        );
      }
      
      // Ensure only one correct option per question
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have exactly one correct option`,
          },
          { status: 400 }
        );
      }
    }

    // Update questions
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
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update template questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete questions for a template
export async function DELETE(request) {
  try {
    const { templateId } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await TemplateQuestions.findOneAndDelete({ templateId });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "No questions found for this template",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template questions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template questions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete template questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
} 