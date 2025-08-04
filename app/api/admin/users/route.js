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

export async function PUT(request) {
  try {
    const { email, validated } = await request.json();

    // Connect to the database
    await connectDB();

    // Get tenant token from headers
    const tenantToken = request.headers.get("x-admin-token");
    if (!tenantToken) {
      return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
    }

    // Verify admin exists
    const admin = await Admin.findOne({ tenantToken });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 401 });
    }

    // Find user by email and tenant token, then update validation status
    const user = await User.findOneAndUpdate(
      { email, tenantToken },
      { validated },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User validation status updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user validation:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 