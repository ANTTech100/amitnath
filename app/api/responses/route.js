import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { UserResponse, TemplateQuestions } from "@/modal/DynamicPopop";
import User from "@/modal/UserUser";
import Template from "@/modal/Template";

// GET - Fetch all responses (superadmin or tenant)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    const templateId = searchParams.get("templateId");
    await connectDB();
    let responses;
    if (all === "true") {
      // Only superadmin can view all
      const superadmin = request.headers.get("x-superadmin") === "true";
      if (!superadmin) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      responses = await UserResponse.find({})
        .populate('templateId', 'name description')
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 });
    } else {
      // Regular admin: filter by tenant templates
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }

      const templateFilter = { tenantToken };
      if (templateId) templateFilter._id = templateId;
      const templates = await Template.find(templateFilter).select('_id');
      const templateIds = templates.map(t => t._id);

      responses = await UserResponse.find({ templateId: { $in: templateIds } })
        .populate('templateId', 'name description')
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 });
    }
    return NextResponse.json({ responses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch responses",
        error: error.message,
      },
      { status: 500 }
    );
  }
} 