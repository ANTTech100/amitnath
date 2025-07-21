import { connectDB } from "@/config/Database";
import AdminToken from "@/modal/AdminToken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the admin token
    const adminToken = await AdminToken.findOne({ 
      token: token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!adminToken) {
      return NextResponse.json(
        { message: "Invalid or expired admin token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token validated successfully",
      tokenData: {
        name: adminToken.name,
        email: adminToken.email,
        token: adminToken.token
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error validating admin token:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
} 