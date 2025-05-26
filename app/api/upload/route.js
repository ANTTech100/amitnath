import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import Template from "@/modal/Template";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse FormData
    const formData = await request.formData();
    const fields = {};

    // Extract fields from FormData
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    // Log parsed data for debugging
    console.log("Parsed FormData fields:", fields);

    // Extract required fields
    const templateId = fields.templateId;
    const heading = fields.heading;
    const subheading = fields.subheading;
    const userId = fields.userId;

    // Validate templateId
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // Validate heading and subheading
    if (!heading || !subheading) {
      return NextResponse.json(
        { success: false, message: "Heading and Subheading are required" },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await Template.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Prepare content data
    const contentData = {
      templateId,
      heading,
      subheading,
      sections: {},
      createdBy: userId, // Use userId from form data
      updatedBy: userId, // Use userId from form data
    };

    // Process each section
    for (const section of template.sections) {
      const sectionId = section.id;
      if (fields[sectionId]) {
        // Handle text/URL
        contentData.sections[sectionId] = {
          type: section.type,
          value: fields[sectionId],
        };
      } else if (section.required) {
        return NextResponse.json(
          { success: false, message: `${section.title} is required` },
          { status: 400 }
        );
      }
    }

    // Create content in database
    const content = await Content.create(contentData);

    return NextResponse.json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Fetch all content
    const contents = await Content.find().populate("templateId").lean();

    return NextResponse.json({
      success: true,
      message: "Content fetched successfully",
      content: contents,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
