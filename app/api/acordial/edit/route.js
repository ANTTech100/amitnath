import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AccordialContent from "@/modal/AccordialContent";
import mongoose from "mongoose";
import fetch from "node-fetch";

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = "tempelate";
const CLOUDINARY_CLOUD_NAME = "ddyhobnzf";

export async function PUT(request) {
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
    const contentId = fields.contentId;

    // Validate required fields
    if (!title || !subtitle || !userId || !contentId) {
      return NextResponse.json(
        { success: false, message: "Title, subtitle, userId, and contentId are required" },
        { status: 400 }
      );
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId or contentId" },
        { status: 400 }
      );
    }

    // Check if content exists and belongs to user
    const existingContent = await AccordialContent.findById(contentId);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    if (existingContent.createdBy.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to edit this content" },
        { status: 403 }
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

    // Update accordion content
    const updateData = {
      title,
      subtitle,
      backgroundColor,
      guides: guidesData,
      updatedAt: new Date(),
    };

    console.log("Updating accordion content with data:", updateData);
    const updatedContent = await AccordialContent.findByIdAndUpdate(
      contentId,
      updateData,
      { new: true, runValidators: true }
    );
    console.log("Updated accordion content:", updatedContent);

    return NextResponse.json({
      success: true,
      message: "Accordion content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Error updating accordion content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update accordion content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
