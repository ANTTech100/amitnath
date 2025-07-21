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
      // Superadmin: return all questions
      templateQuestions = await TemplateQuestions.find()
        .populate('templateId', 'name description')
        .populate('createdBy', 'fullName email')
        .sort({ createdAt: -1 });
    } else {
      // Regular admin: filter by tenantToken
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      templateQuestions = await TemplateQuestions.find({ tenantToken })
        .populate('templateId', 'name description')
        .populate('createdBy', 'fullName email')
        .sort({ createdAt: -1 });
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