// File: /app/api/admin/createques/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { TemplateQuestions } from "@/modal/DynamicPopop";
import Template from "@/modal/Template";

// GET - Fetch all template questions for a specific tenant
export async function GET(request) {
  try {
    await connectDB();

    const tenantToken = request.headers.get("x-admin-token");
    
    if (!tenantToken) {
      return NextResponse.json(
        { success: false, message: "Missing admin token" },
        { status: 401 }
      );
    }

    console.log("Fetching questions for tenant:", tenantToken);

    // Fetch questions for this tenant OR legacy questions without tenantToken
    const templateQuestions = await TemplateQuestions.find({ 
      $or: [
        { tenantToken: tenantToken },
        { tenantToken: { $exists: false } },
        { tenantToken: null }
      ]
    })
      .populate('templateId', 'name description tenantToken')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${templateQuestions.length} question sets for tenant`);

    return NextResponse.json({
      success: true,
      data: templateQuestions,
      count: templateQuestions.length,
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

    const tenantToken = request.headers.get("x-admin-token");
    
    if (!tenantToken) {
      return NextResponse.json(
        { success: false, message: "Missing admin token" },
        { status: 401 }
      );
    }

    console.log("Creating questions with tenant:", tenantToken);
    console.log("Template ID:", templateId);

    // Validate required fields
    if (!templateId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID and questions array are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // CRITICAL: Verify template exists AND (belongs to the same tenant OR is a legacy template)
    const template = await Template.findOne({ 
      _id: templateId,
      $or: [
        { tenantToken: tenantToken }, // Belongs to this tenant
        { tenantToken: { $exists: false } }, // Legacy template without field
        { tenantToken: null } // Legacy template with null value
      ]
    });
    
    if (!template) {
      console.log("Template not found or doesn't belong to tenant");
      return NextResponse.json(
        {
          success: false,
          message: "Template not found or you don't have permission to add questions to this template",
        },
        { status: 404 }
      );
    }

    console.log("Template verified:", template.name);

    // Check if questions already exist for this template and tenant combination
    const existingQuestions = await TemplateQuestions.findOne({ 
      templateId: templateId,
      tenantToken: tenantToken // Check for same tenant
    });
    
    if (existingQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: "Questions already exist for this template. Use PUT to update.",
        },
        { status: 400 }
      );
    }

    // Validate questions array
    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one question is required",
        },
        { status: 400 }
      );
    }

    // Validate each question structure
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Check question text
      if (!question.questionText || !question.questionText.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have text`,
          },
          { status: 400 }
        );
      }
      
      // Check options exist
      if (!Array.isArray(question.options)) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have options array`,
          },
          { status: 400 }
        );
      }
      
      // Filter valid options (non-empty text)
      const validOptions = question.options.filter(opt => opt.text && opt.text.trim());
      
      if (validOptions.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have at least 2 options with text`,
          },
          { status: 400 }
        );
      }
      
      // Check for exactly one correct option
      const correctOptions = validOptions.filter(opt => opt.isCorrect === true);
      
      if (correctOptions.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have exactly one correct option selected`,
          },
          { status: 400 }
        );
      }
      
      if (correctOptions.length > 1) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} can only have one correct option`,
          },
          { status: 400 }
        );
      }
    }

    // Process and clean questions
    const processedQuestions = questions.map((q, index) => ({
      questionText: q.questionText.trim(),
      options: q.options
        .filter(opt => opt.text && opt.text.trim()) // Remove empty options
        .map(opt => ({
          text: opt.text.trim(),
          isCorrect: opt.isCorrect === true,
        })),
      required: q.required !== false, // Default to true
      order: index + 1,
    }));

    console.log(`Creating ${processedQuestions.length} questions for template`);

    // Create template questions with tenant isolation
    const templateQuestions = new TemplateQuestions({
      templateId: templateId,
      questions: processedQuestions,
      createdBy: createdBy && createdBy !== "admin" ? createdBy : null,
      tenantToken: tenantToken, // CRITICAL: Store the tenant token
      isActive: true,
    });

    await templateQuestions.save();
    console.log("Questions created successfully with ID:", templateQuestions._id);

    // Populate the response with template details
    await templateQuestions.populate('templateId', 'name description tenantToken');
    if (templateQuestions.createdBy) {
      await templateQuestions.populate('createdBy', 'fullName email');
    }

    return NextResponse.json(
      {
        success: true,
        message: "Template questions created successfully",
        data: templateQuestions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template questions:", error);
    
    // Handle duplicate key error (from unique index)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Questions already exist for this template in your organization",
        },
        { status: 400 }
      );
    }
    
    // Handle validation errors from mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: " + error.message,
        },
        { status: 400 }
      );
    }
    
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

    const tenantToken = request.headers.get("x-admin-token");
    
    if (!tenantToken) {
      return NextResponse.json(
        { success: false, message: "Missing admin token" },
        { status: 401 }
      );
    }

    console.log("Updating questions for tenant:", tenantToken);
    console.log("Template ID:", templateId);

    if (!templateId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID and questions array are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // CRITICAL: Verify template belongs to the tenant OR is legacy template
    const template = await Template.findOne({ 
      _id: templateId,
      $or: [
        { tenantToken: tenantToken },
        { tenantToken: { $exists: false } },
        { tenantToken: null }
      ]
    });
    
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          message: "Template not found or you don't have permission",
        },
        { status: 404 }
      );
    }

    // Find existing questions for this tenant only
    const existingQuestions = await TemplateQuestions.findOne({ 
      templateId: templateId,
      tenantToken: tenantToken // Must belong to same tenant
    });
    
    if (!existingQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: "No questions found for this template in your organization",
        },
        { status: 404 }
      );
    }

    console.log("Found existing questions, updating...");

    // Validate questions array
    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one question is required",
        },
        { status: 400 }
      );
    }

    // Validate each question (same validation as POST)
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.questionText || !question.questionText.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have text`,
          },
          { status: 400 }
        );
      }
      
      if (!Array.isArray(question.options)) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have options array`,
          },
          { status: 400 }
        );
      }
      
      const validOptions = question.options.filter(opt => opt.text && opt.text.trim());
      
      if (validOptions.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: `Question ${i + 1} must have at least 2 valid options`,
          },
          { status: 400 }
        );
      }
      
      const correctOptions = validOptions.filter(opt => opt.isCorrect === true);
      
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

    // Process and update questions
    const processedQuestions = questions.map((q, index) => ({
      questionText: q.questionText.trim(),
      options: q.options
        .filter(opt => opt.text && opt.text.trim())
        .map(opt => ({
          text: opt.text.trim(),
          isCorrect: opt.isCorrect === true,
        })),
      required: q.required !== false,
      order: index + 1,
    }));

    existingQuestions.questions = processedQuestions;
    
    if (updatedBy && updatedBy !== "admin") {
      existingQuestions.createdBy = updatedBy;
    }

    await existingQuestions.save();
    console.log("Questions updated successfully");

    // Populate the response
    await existingQuestions.populate('templateId', 'name description tenantToken');
    if (existingQuestions.createdBy) {
      await existingQuestions.populate('createdBy', 'fullName email');
    }

    return NextResponse.json({
      success: true,
      message: "Template questions updated successfully",
      data: existingQuestions,
    });
  } catch (error) {
    console.error("Error updating template questions:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: " + error.message,
        },
        { status: 400 }
      );
    }
    
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

    const tenantToken = request.headers.get("x-admin-token");
    
    if (!tenantToken) {
      return NextResponse.json(
        { success: false, message: "Missing admin token" },
        { status: 401 }
      );
    }

    console.log("Deleting questions for tenant:", tenantToken);
    console.log("Template ID:", templateId);

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

    // CRITICAL: Verify template belongs to tenant OR is legacy template before deleting
    const template = await Template.findOne({ 
      _id: templateId,
      $or: [
        { tenantToken: tenantToken },
        { tenantToken: { $exists: false } },
        { tenantToken: null }
      ]
    });
    
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          message: "Template not found or you don't have permission",
        },
        { status: 404 }
      );
    }

    // Delete only for this tenant
    const result = await TemplateQuestions.findOneAndDelete({ 
      templateId: templateId,
      tenantToken: tenantToken // Must belong to same tenant
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "No questions found for this template in your organization",
        },
        { status: 404 }
      );
    }

    console.log("Questions deleted successfully");

    return NextResponse.json({
      success: true,
      message: "Template questions deleted successfully",
      data: { 
        templateId: templateId,
        deletedCount: result.questions.length 
      },
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