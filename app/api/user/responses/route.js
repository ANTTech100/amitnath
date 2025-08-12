import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { UserResponse, TemplateQuestions } from "@/modal/DynamicPopop";
import User from "@/modal/UserUser";

// GET - Handle both checking user completion and fetching admin responses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("templateId");
    const userId = searchParams.get("userId");
    const isAdmin = searchParams.get("admin") === "true";

    await connectDB();

    // If admin request, return all responses
    if (isAdmin) {
      let query = {};
      if (templateId) query.templateId = templateId;
      if (userId) query.userId = userId;

      const userResponses = await UserResponse.find(query)
        .populate("templateId", "name description")
        .populate("userId", "fullName email")
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

    if (
      !templateQuestions ||
      !Array.isArray(templateQuestions.questions) ||
      templateQuestions.questions.length === 0
    ) {
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
      order: q.order !== undefined ? q.order : idx + 1,
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

    // Generate anonymous userId if not provided (store as a constant string so it is identifiable)
    const finalUserId = userId || "not_registered";

    // Check if user has already completed questions for this template (only if userId is provided)
    if (userId) {
      const existingResponse = await UserResponse.findOne({
        templateId,
        userId,
        completed: true,
      });

      if (existingResponse) {
        return NextResponse.json(
          {
            success: false,
            message: "User has already completed questions for this template",
          },
          { status: 400 }
        );
      }
    }

    // Get template questions to validate responses
    const templateQuestions = await TemplateQuestions.findOne({
      templateId,
      isActive: true,
    });

    if (!templateQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: "No questions found for this template",
        },
        { status: 404 }
      );
    }

    // Validate responses
    if (
      !Array.isArray(responses) ||
      responses.length !== templateQuestions.questions.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid responses format or missing responses",
        },
        { status: 400 }
      );
    }

    // Process responses and check correctness
    const processedResponses = responses.map((response, index) => {
      const question = templateQuestions.questions[index];
      const correctOption = question.options.find((opt) => opt.isCorrect);

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
      const origin = new URL(request.url).origin;
      const ctaUrl = `${origin}`;
      const year = new Date().getFullYear();
      const emailBody = `
      <div style="margin:0;padding:0;background-color:#f0f6ff;font-family:Inter,Arial,Helvetica,sans-serif;color:#0f172a;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;box-shadow:0 10px 30px rgba(15,23,42,0.08);overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(135deg,#60a5fa 0%, #93c5fd 100%);padding:32px 24px;text-align:center;color:#0b1220;">
                    <div style="font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#0b1220;opacity:0.9;font-weight:600;">Codeless</div>
                    <h1 style="margin:10px 0 6px;font-size:26px;line-height:1.25;color:#0b1220;">Welcome to Codeless</h1>
                    <p style="margin:0;font-size:15px;color:#0b1220;opacity:0.9;">We’re thrilled to have you on board</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 24px;">
                    <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#0f172a;">Hi <strong>${userInfo.name}</strong> 👋,</p>
                    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">Thanks for taking a moment to complete the quick setup. Your input helps us tailor the experience just for you.</p>
                    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">Here’s what you can do next:</p>
                    <ul style="margin:0 0 22px 18px;padding:0;color:#334155;font-size:15px;line-height:1.8;">
                      <li>Explore templates and create beautiful pages</li>
                      <li>Customize content and publish instantly</li>
                      <li>Get insights and iterate effortlessly</li>
                    </ul>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
                      <tr>
                        <td align="center" style="border-radius:10px;" bgcolor="#3b82f6">
                          <a href="${ctaUrl}" style="display:inline-block;padding:12px 20px;font-size:15px;color:#ffffff;text-decoration:none;border-radius:10px;background:#3b82f6;">Explore Codeless</a>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top:24px;padding:16px 14px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;">
                      <div style="font-weight:600;color:#0f172a;margin:0 0 6px;font-size:15px;">Need help?</div>
                      <div style="margin:0;color:#475569;font-size:14px;line-height:1.7;">Reply to this email anytime—our team is here to help you get the most out of Codeless.</div>
                    </div>
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                    <p style="margin:0;color:#64748b;font-size:12px;">You’re receiving this email because you recently interacted with Codeless.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8fafc;padding:18px 24px;text-align:center;color:#64748b;font-size:12px;">
                    © ${year} Codeless Pages · All rights reserved
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>`;

      // Send email using the email API configured for Resend
      // Build absolute URL from the incoming request for server-side fetch
      const emailEndpoint = new URL("/api/email", request.url).toString();
      const emailResponse = await fetch(emailEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userInfo.email,
          subject: emailSubject,
          message: emailBody,
          fromName: "Codeless Team",
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

    return NextResponse.json(
      {
        success: true,
        message: "User responses submitted successfully",
        data: userResponse,
      },
      { status: 201 }
    );
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
