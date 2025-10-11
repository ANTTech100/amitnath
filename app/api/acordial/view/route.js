import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AccordialContent from "@/modal/AccordialContent";
import User from "@/modal/UserUser";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("id");

    if (!contentId) {
      return NextResponse.json(
        { success: false, message: "Content ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const content = await AccordialContent.findById(contentId)
      .populate("createdBy", "fullName email");

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
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
