import { connectDB } from "@/config/Database";
import Admin from "@/modal/UserAdmin";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const tenantToken = request.headers.get("x-admin-token");
    if (!tenantToken) {
      return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
    }
    // Find the admin for this tenant token
    const admin = await Admin.findOne({ tenantToken });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 401 });
    }
    // Find all users for this organization
    const users = await User.find({ tenantToken });
    return NextResponse.json({ users: users || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users for admin org:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 