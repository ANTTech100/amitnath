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
    const backgroundColor = fields.backgroundColor || "#ffffff"; // Default to white if not provided
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
      backgroundColor,
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

    // Fetch all content and populate templateId
    const contents = await Content.find()
      .populate({
        path: "templateId",
        match: { _id: { $exists: true } }, // Ensure only valid templates are populated
      })
      .lean();

    // Filter out content where templateId is null (i.e., template not found)
    const validContents = contents.filter(
      (content) => content.templateId !== null
    );

    if (validContents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid content found with associated templates",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Content fetched successfully",
      content: validContents,
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
export async function PUT(request) {
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
    const contentId = fields.contentId;
    const templateId = fields.templateId;
    const heading = fields.heading;
    const subheading = fields.subheading;
    const userId = fields.userId;

    // Validate contentId
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing content ID" },
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

    // Validate templateId
    if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing template ID" },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await Template.findById(templateId).lean();
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Verify content exists
    const existingContent = await Content.findById(contentId).populate({
      path: "templateId",
      match: { _id: { $exists: true } }, // Ensure populated template is valid
    });
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    // Check if existing content's templateId is valid
    if (!existingContent.templateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Existing content has an invalid template reference",
        },
        { status: 400 }
      );
    }

    // Prepare updated content data
    const contentData = {
      templateId,
      heading,
      subheading,
      sections: {},
      updatedBy: userId,
      updatedAt: Date.now(),
    };

    // Process each section and enforce required fields
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
          {
            success: false,
            message: `Section '${section.title}' is required but was not provided`,
          },
          { status: 400 }
        );
      }
    }

    // Update content in database
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { $set: contentData },
      { new: true, runValidators: true }
    ).populate("templateId");

    // Verify updated content has valid templateId
    if (!updatedContent.templateId) {
      console.error("Updated content has null templateId:", updatedContent);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update content: Invalid template reference",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { contentId } = await request.json();

    // Validate contentId
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing content ID" },
        { status: 400 }
      );
    }

    // Check if content exists
    const existingContent = await Content.findById(contentId);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    // Delete the content
    await Content.findByIdAndDelete(contentId);

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully",
      deletedId: contentId,
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
