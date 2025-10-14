import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { TemplateQuestions } from "@/modal/DynamicPopop";
import Template from "@/modal/Template";

// GET - Fetch all template questions (superadmin or tenant)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    let templateQuestions;
    if (all === "true") {
      // Only superadmin should use all=true; otherwise block
      const superadmin = request.headers.get("x-superadmin") === "true";
      if (!superadmin) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      templateQuestions = await TemplateQuestions.find()
        .populate('templateId', 'name description')
        .populate('createdBy', 'fullName email')
        .sort({ createdAt: -1 });
    } else {
      // Regular admin: filter by tenantToken
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        // If no tenant token, return all questions without tenant filter
        templateQuestions = await TemplateQuestions.find({})
          .populate('templateId', 'name description')
          .populate('createdBy', 'fullName email')
          .sort({ createdAt: -1 });
      } else {
        // If tenant token exists, find questions with this token OR questions without a tenant token
        templateQuestions = await TemplateQuestions.find({
          $or: [
            { tenantToken },
            { tenantToken: { $exists: false } }
          ]
        })
          .populate('templateId', 'name description')
          .populate('createdBy', 'fullName email')
          .sort({ createdAt: -1 });
      }
    }
    return NextResponse.json({ questions: templateQuestions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching template questions:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch template questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new template question
export async function POST(request) {
  try {
    await connectDB();
    
    // Get request body
    const data = await request.json();
    
    // Get tenant token from headers
    const tenantToken = request.headers.get("x-admin-token");
    
    // Validate required fields
    if (!data.templateId || !data.question || !data.type) {
      return NextResponse.json(
        { message: "Missing required fields: templateId, question, and type are required" },
        { status: 400 }
      );
    }
    
    // Verify template exists
    const template = await Template.findById(data.templateId);
    if (!template) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 });
    }
    
    // Create new template question
    const newQuestion = new TemplateQuestions({
      ...data,
      tenantToken: tenantToken || undefined, // Use tenantToken if available, otherwise leave undefined
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newQuestion.save();
    
    return NextResponse.json(
      { message: "Question created successfully", question: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template question:", error);
    return NextResponse.json(
      {
        message: "Failed to create template question",
        error: error.message,
      },
      { status: 500 }
    );
  }
}