import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { UserResponse, TemplateQuestions } from "@/modal/DynamicPopop";
import User from "@/modal/UserUser";

// GET - Handle both checking user completion and fetching admin responses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('admin') === 'true';

    await connectDB();

    // If admin request, return all responses
    if (isAdmin) {
      let query = {};
      if (templateId) query.templateId = templateId;
      if (userId) query.userId = userId;

      const userResponses = await UserResponse.find(query)
        .populate('templateId', 'name description')
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: userResponses,
      });
    }

    // Regular user request - check completion status
    if (!templateId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID and User ID are required",
        },
        { status: 400 }
      );
    }

    // Check if user has already completed questions for this template
    const existingResponse = await UserResponse.findOne({
      templateId,
      userId,
      completed: true,
    });

    if (existingResponse) {
      return NextResponse.json({
        success: true,
        completed: true,
        message: "User has already completed questions for this template",
      });
    }

    // Get questions for the template
    const templateQuestions = await TemplateQuestions.findOne({
      templateId,
      isActive: true,
    });

    if (!templateQuestions || !Array.isArray(templateQuestions.questions) || templateQuestions.questions.length === 0) {
      return NextResponse.json({
        success: true,
        completed: false,
        hasQuestions: false,
        message: "No questions found for this template",
      });
    }

    // Always return all questions, regardless of number
    const questions = templateQuestions.questions.map((q, idx) => ({
      questionText: q.questionText || `Question ${idx + 1}`,
      options: Array.isArray(q.options) ? q.options : [],
      required: q.required !== undefined ? q.required : true,
      order: q.order !== undefined ? q.order : idx + 1
    }));

    return NextResponse.json({
      success: true,
      completed: false,
      hasQuestions: true,
      questions,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Submit user responses
export async function POST(request) {
  try {
    const { templateId, userId, userInfo, responses } = await request.json();

    if (!templateId || !userId || !userInfo || !responses) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID, User ID, user info, and responses are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user has already completed questions for this template
    const existingResponse = await UserResponse.findOne({
      templateId,
      userId,
      completed: true,
    });

    if (existingResponse) {
      return NextResponse.json({
        success: false,
        message: "User has already completed questions for this template",
      }, { status: 400 });
    }

    // Get template questions to validate responses
    const templateQuestions = await TemplateQuestions.findOne({
      templateId,
      isActive: true,
    });

    if (!templateQuestions) {
      return NextResponse.json({
        success: false,
        message: "No questions found for this template",
      }, { status: 404 });
    }

    // Validate responses
    if (!Array.isArray(responses) || responses.length !== templateQuestions.questions.length) {
      return NextResponse.json({
        success: false,
        message: "Invalid responses format or missing responses",
      }, { status: 400 });
    }

    // Process responses and check correctness
    const processedResponses = responses.map((response, index) => {
      const question = templateQuestions.questions[index];
      const correctOption = question.options.find(opt => opt.isCorrect);
      
      return {
        questionText: question.questionText,
        selectedOption: response.selectedOption,
        isCorrect: response.selectedOption === correctOption.text,
      };
    });

    // Create or update user response
    let userResponse = await UserResponse.findOne({
      templateId,
      userId,
    });

    if (userResponse) {
      // Update existing response
      userResponse.userInfo = userInfo;
      userResponse.responses = processedResponses;
      userResponse.completed = true;
    } else {
      // Create new response
      userResponse = new UserResponse({
        templateId,
        userId,
        userInfo,
        responses: processedResponses,
        completed: true,
      });
    }

    await userResponse.save();

    return NextResponse.json({
      success: true,
      message: "User responses submitted successfully",
      data: userResponse,
    }, { status: 201 });
  } catch (error) {
    console.error("Error submitting user responses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit user responses",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

 