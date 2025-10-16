import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AccordialContent from "@/modal/AccordialContent";
import mongoose from "mongoose";
import fetch from "node-fetch";

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = "tempelate";
const CLOUDINARY_CLOUD_NAME = "ddyhobnzf";

export async function POST(request) {
  try {
    await connectDB();

    // Parse FormData
    const formData = await request.formData();
    const fields = {};

    // Extract fields from FormData
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    console.log("Parsed FormData fields:", fields);

    // Extract required fields
    const title = fields.title;
    const subtitle = fields.subtitle;
    const backgroundColor = fields.backgroundColor || "#ffffff";
    const userId = fields.userId;

    // Validate required fields
    if (!title || !subtitle || !userId) {
      return NextResponse.json(
        { success: false, message: "Title, subtitle, and userId are required" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId ) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    // Process guides data
    const guidesData = [];
    let guideIndex = 0;

    // Parse guides from form data
    while (fields[`guide_${guideIndex}_title`]) {
      const guideTitle = fields[`guide_${guideIndex}_title`];
      const guideItems = [];
      let itemIndex = 0;

      // Parse items for this guide
      while (fields[`guide_${guideIndex}_item_${itemIndex}_type`]) {
        const itemType = fields[`guide_${guideIndex}_item_${itemIndex}_type`];
        const itemContent = fields[`guide_${guideIndex}_item_${itemIndex}_content`];
        
        const item = {
          type: itemType,
          content: itemContent,
          order: itemIndex,
        };

        // Handle image uploads
        if (itemType === "image" && typeof fields[`guide_${guideIndex}_item_${itemIndex}_file`] === "object") {
          const file = fields[`guide_${guideIndex}_item_${itemIndex}_file`];
          if (file.name) {
            // Upload to Cloudinary
            const uploadForm = new FormData();
            uploadForm.append("file", file);
            uploadForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            
            const cloudinaryRes = await fetch(
              `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
              { method: "POST", body: uploadForm }
            );
            
            const cloudinaryData = await cloudinaryRes.json();
            if (cloudinaryData.secure_url) {
              item.content = cloudinaryData.secure_url;
            } else {
              return NextResponse.json(
                { success: false, message: "Cloudinary upload failed" },
                { status: 500 }
              );
            }
          }
        }

        // Handle button specific fields
        if (itemType === "button") {
          item.buttonText = fields[`guide_${guideIndex}_item_${itemIndex}_buttonText`] || "Click Here";
          item.buttonLink = fields[`guide_${guideIndex}_item_${itemIndex}_buttonLink`] || "#";
        }

        guideItems.push(item);
        itemIndex++;
      }

      guidesData.push({
        title: guideTitle,
        items: guideItems,
        order: guideIndex,
      });

      guideIndex++;
    }

    // Create accordion content
    const contentData = {
      title,
      subtitle,
      backgroundColor,
      guides: guidesData,
      createdBy: userId,
      isPublished: true,
    };

    console.log("Creating accordion content with data:", contentData);
    const content = await AccordialContent.create(contentData);
    console.log("Created accordion content:", content);

    return NextResponse.json({
      success: true,
      message: "Accordion content created successfully",
      data: content,
    });
  } catch (error) {
    console.error("Error creating accordion content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create accordion content",
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

    let query = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.createdBy = userId;
    }

    const contents = await AccordialContent.find(query)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: contents,
      count: contents.length,
    });
  } catch (error) {
    console.error("Error fetching accordion content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch accordion content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
