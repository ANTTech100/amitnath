import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import Template from "@/modal/Template";
import mongoose from "mongoose";
import fetch from "node-fetch";

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = "tempelate";
const CLOUDINARY_CLOUD_NAME = "ddyhobnzf";

// Helper function to upload to Cloudinary
async function uploadToCloudinary(file) {
  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: uploadForm }
  );
  
  const cloudinaryData = await cloudinaryRes.json();
  
  if (!cloudinaryData.secure_url) {
    throw new Error("Cloudinary upload failed");
  }
  
  return cloudinaryData.secure_url;
}

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const fields = {};

    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    console.log("Parsed FormData fields:", fields);

    const userToken = request.headers.get('x-user-token');
    const templateId = fields.templateId;
    const backgroundColor = fields.backgroundColor || "#ffffff";
    const heading = fields.heading;
    const subheading = fields.subheading;
    const userId = userToken || fields.userId;
    const askUserDetails = fields.askUserDetails === "true";

    console.log("askUserDetails value:", fields.askUserDetails);
    console.log("askUserDetails converted:", askUserDetails);

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    if (!heading || !subheading) {
      return NextResponse.json(
        { success: false, message: "Heading and Subheading are required" },
        { status: 400 }
      );
    }

    const tenantToken = request.headers.get("x-admin-token");
    const template = tenantToken
      ? await Template.findOne({ _id: templateId, tenantToken })
      : await Template.findById(templateId);
      
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    const contentData = {
      templateId,
      tenantToken: fields.tenantToken || null,
      heading,
      backgroundColor,
      subheading,
      sections: {},
      createdBy: String(userId),
      updatedBy: String(userId),
      askUserDetails,
    };

    for (const section of template.sections) {
      const sectionId = section.id;
      if (fields[sectionId]) {
        if (section.type === "image" && typeof fields[sectionId] === "object" && fields[sectionId].name) {
          try {
            const cloudinaryUrl = await uploadToCloudinary(fields[sectionId]);
            contentData.sections[sectionId] = {
              type: section.type,
              value: cloudinaryUrl,
            };
          } catch (error) {
            console.error("Cloudinary upload error:", error);
            return NextResponse.json(
              { success: false, message: "Image upload failed" },
              { status: 500 }
            );
          }
        } else {
          contentData.sections[sectionId] = {
            type: section.type,
            value: fields[sectionId],
          };
        }
      } else if (section.required) {
        return NextResponse.json(
          { success: false, message: `${section.title} is required` },
          { status: 400 }
        );
      }
    }

    console.log("Creating content with data:", contentData);
    const content = await Content.create(contentData);
    console.log("Created content:", content);

    return NextResponse.json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (error) {
    console.log("Error details:", error);
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

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    const tenantToken = request.headers?.get?.("x-admin-token");
    let contentQuery = {};
    
    if (userId) {
      contentQuery.createdBy = userId;
      if (tenantToken) {
        contentQuery.tenantToken = tenantToken;
      }
      const contents = await Content.find(contentQuery)
        .sort({ updatedAt: -1 })
        .lean();
      return NextResponse.json({
        success: true,
        message: "Content fetched successfully",
        content: contents,
      });
    }

    if (tenantToken) {
      const templates = await Template.find({ tenantToken }).select("_id");
      const templateIds = templates.map(t => t._id);
      contentQuery.templateId = { $in: templateIds };
    }

    const contents = await Content.find(contentQuery)
      .populate({
        path: "templateId",
        match: { _id: { $exists: true } },
      })
      .lean();

    const validContents = contents.filter(
      (content) => content.templateId !== null
    );

    if (validContents.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No content found",
        content: [],
      });
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
    await connectDB();

    const formData = await request.formData();
    const fields = {};

    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    console.log("Parsed FormData fields:", fields);

    const contentId = fields.contentId;
    const templateId = fields.templateId;
    const heading = fields.heading;
    const subheading = fields.subheading;
    const backgroundColor = fields.backgroundColor || "#ffffff";
    const userId = fields.userId;
    const askUserDetails = fields.askUserDetails === "true";

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing content ID" },
        { status: 400 }
      );
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    if (!heading || !subheading) {
      return NextResponse.json(
        { success: false, message: "Heading and Subheading are required" },
        { status: 400 }
      );
    }

    if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing template ID" },
        { status: 400 }
      );
    }

    const template = await Template.findById(templateId).lean();
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    const existingContent = await Content.findById(contentId).populate({
      path: "templateId",
      match: { _id: { $exists: true } },
    });
    
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    if (!existingContent.templateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Existing content has an invalid template reference",
        },
        { status: 400 }
      );
    }

    const contentData = {
      templateId,
      tenantToken: template.tenantToken || null,
      heading,
      subheading,
      backgroundColor,
      sections: {},
      updatedBy: userId,
      updatedAt: Date.now(),
      askUserDetails,
    };

    // Process each section
    for (const section of template.sections) {
      const sectionId = section.id;
      
      if (fields[sectionId]) {
        // Check if it's a new file upload
        if ((section.type === "image" || section.type === "video") && 
            typeof fields[sectionId] === "object" && 
            fields[sectionId].name) {
          
          // Upload new file to Cloudinary
          try {
            const cloudinaryUrl = await uploadToCloudinary(fields[sectionId]);
            contentData.sections[sectionId] = {
              type: section.type,
              value: cloudinaryUrl,
            };
          } catch (error) {
            console.error("Cloudinary upload error:", error);
            return NextResponse.json(
              { success: false, message: "Image upload failed" },
              { status: 500 }
            );
          }
        } else if (typeof fields[sectionId] === "string") {
          // It's either a URL (existing image) or text content
          contentData.sections[sectionId] = {
            type: section.type,
            value: fields[sectionId],
          };
        } else {
          // Default text handling
          contentData.sections[sectionId] = {
            type: section.type,
            value: fields[sectionId],
          };
        }
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

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { $set: contentData },
      { new: true, runValidators: true }
    ).populate("templateId");

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
    await connectDB();

    const { contentId } = await request.json();

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing content ID" },
        { status: 400 }
      );
    }

    const existingContent = await Content.findById(contentId);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

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