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
    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID is required",
        },
        { status: 400 }
      );
    }

    // If userId is provided, check if user has already completed questions for this template
    if (userId) {
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

    if (!templateId || !userInfo || !responses) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID, user info, and responses are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate anonymous userId if not provided
    const finalUserId = userId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check if user has already completed questions for this template (only if userId is provided)
    if (userId) {
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
      userId: finalUserId,
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
        userId: finalUserId,
        userInfo,
        responses: processedResponses,
        completed: true,
      });
    }

    await userResponse.save();

    // Send welcome email to the user
    try {
      const emailSubject = "Welcome to Codeless! 🎉";
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; margin-bottom: 10px;">Welcome to Codeless!</h1>
            <p style="color: #666; font-size: 18px;">Thank you for your time and participation</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; color: white; margin-bottom: 30px;">
            <h2 style="margin-bottom: 15px;">Hello ${userInfo.name}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for taking the time to complete our questionnaire. Your feedback and participation are incredibly valuable to us.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              We're excited to have you as part of our community and look forward to providing you with the best possible experience.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>We'll review your responses and personalize your experience</li>
              <li>You'll receive updates about new features and improvements</li>
              <li>Stay tuned for exclusive content and offers</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px;">
              If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 10px;">
              Best regards,<br>
              The Codeless Team
            </p>
          </div>
        </div>
      `;

      // Send email using the existing email API
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userInfo.email,
          subject: emailSubject,
          message: emailBody,
          fromName: "Codeless Team"
        }),
      });

      if (!emailResponse.ok) {
        console.error("Failed to send welcome email");
      } else {
        console.log("Welcome email sent successfully to:", userInfo.email);
      }

    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the main request if email fails
    }

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

 