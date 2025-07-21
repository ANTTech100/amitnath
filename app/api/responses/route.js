import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { UserResponse, TemplateQuestions } from "@/modal/DynamicPopop";
import User from "@/modal/UserUser";

// GET - Fetch all responses (superadmin or tenant)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    await connectDB();
    let responses;
    if (all === "true") {
      // Superadmin: return all responses
      responses = await UserResponse.find({})
        .populate('templateId', 'name description')
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 });
    } else {
      // Regular admin: filter by tenantToken
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      // Find users for this tenant
      const users = await User.find({ tenantToken });
      const userIds = users.map(u => u._id);
      responses = await UserResponse.find({ userId: { $in: userIds } })
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