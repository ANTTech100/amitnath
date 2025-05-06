import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Template from "@/modal/Template";

// GET handler - Get all templates or filter by query params
export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    // Fetch all templates, sorted by creation date
    const templates = await Template.find({});

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch templates",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST handler - Create a new template
export async function POST(request) {
  try {
    // Parse request body
    const templateData = await request.json();
    console.log("Template Data:", templateData);

    // Hardcode createdBy field
    const hardcodedUserId = "644f1a9e4c98e80016d1e8b5"; // Replace with a valid ObjectId from your User collection
    templateData.createdBy = hardcodedUserId;

    // Connect to database
    await connectDB();

    // Create the template
    const template = new Template(templateData);
    await template.save();

    return NextResponse.json(
      {
        success: true,
        message: "Template created successfully",
        data: template,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT handler - Update an existing template (we're using the templates/[id] route for this)
export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed, use /api/templates/[id] instead",
    },
    { status: 405 }
  );
}

// DELETE handler - Delete multiple templates
export async function DELETE(request) {
  try {
    // Parse request body to get array of template IDs to delete
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request - IDs array required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete the templates
    const result = await Template.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} templates deleted successfully`,
      count: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete templates",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
