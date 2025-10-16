import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import { TemplateQuestions } from "@/modal/DynamicPopop";
import { UserResponse } from "@/modal/DynamicPopop";

export async function GET(request) {
  try {
    console.log("=== GET /api/user/responses ===");
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully");
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");
    const templateId = searchParams.get("templateId");
    console.log("Query params:", { contentId, templateId });
    
    // If contentId is provided, check if content exists and matches templateId
    if (contentId) {
      console.log("ContentId provided, fetching content...");
      const content = await Content.findById(contentId);
      console.log("Content found:", content ? "Yes" : "No");
      
      if (!content) {
        console.log("Content not found for ID:", contentId);
        return NextResponse.json({
          success: false,
          message: "Content not found",
        }, { status: 404 });
      }
      
      console.log("Content details:", {
        contentId: content._id.toString(),
        contentTemplateId: content.templateId.toString(),
        contentTenantToken: content.tenantToken,
        requestedTemplateId: templateId
      });
      
      // Check if content's templateId matches the provided templateId
      if (content.templateId.toString() !== templateId) {
        console.log("Template ID mismatch:", {
          contentTemplateId: content.templateId.toString(),
          requestedTemplateId: templateId
        });
        return NextResponse.json({
          success: false,
          message: "Content's templateId does not match the provided templateId",
        }, { status: 400 });
      }
      
      // Fetch template questions that match the templateId
      console.log("Fetching template questions for templateId:", templateId);
      const templateQuestions = await TemplateQuestions.find({ 
        'templateId': templateId 
      }).populate('templateId', 'name type');
      console.log("Template questions found:", templateQuestions.length);
      
      if (!templateQuestions || templateQuestions.length === 0) {
        console.log("No questions found for template:", templateId);
        return NextResponse.json({
          success: false,
          message: "No questions found for this template",
        }, { status: 404 });
      }
      
      // Check if content's tenantToken matches any of the templateQuestions' tenantToken
      console.log("Checking tenant token match between content and questions");
      console.log("Content tenant token:", content.tenantToken);
      console.log("Question tenant tokens:", templateQuestions.map(q => q.tenantToken));
      
      const matchingQuestions = templateQuestions.filter(
        question => question.tenantToken === content.tenantToken
      );
      console.log("Matching questions count:", matchingQuestions.length);
      
      if (matchingQuestions.length === 0) {
        console.log("No matching tenant tokens found");
        return NextResponse.json({
          success: false,
          message: "Content's tenant token does not match any template questions' tenant token",
        }, { status: 400 });
      }
      
      // Return only the matching questions
      console.log("Returning matching questions");
      return NextResponse.json({
        success: true,
        message: "Questions fetched successfully",
        questions: matchingQuestions,
        count: matchingQuestions.length
      });
    } else {
      // If no contentId provided, fetch all questions (original behavior)
      console.log("No contentId provided, fetching all questions");
      const allQuestions = await TemplateQuestions.find()
        .populate('templateId', 'name type')
        .sort({ createdAt: -1 });
      console.log("All questions count:", allQuestions.length);

      return NextResponse.json({
        success: true,
        message: "Questions fetched successfully",
        questions: allQuestions,
        count: allQuestions.length
      });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    
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

export async function POST(request) {
  try {
    console.log("=== POST /api/user/responses ===");
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully");
    
    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);
    
    const {  templateId, userInfo, responses } = body;
    
   
    
    // Check if content exists and matches templateId
    console.log("Fetching content...");
    // const content = await Content.findById(contentId);
    
  
    
   
    
    // Create a new user response
    const userResponse = new UserResponse({
    
      templateId,
      userInfo,
      responses,
      // tenantToken: content.tenantToken,
    });
    
    // Save the user response
    console.log("Saving user response...");
    await userResponse.save();
    console.log("User response saved successfully");
    
    return NextResponse.json({
      success: true,
      message: "Response submitted successfully",
      responseId: userResponse._id,
    });
  } catch (error) {
    console.error("Error in POST /api/user/responses:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}

