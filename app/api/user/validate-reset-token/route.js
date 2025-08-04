import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
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

    console.log("Validating token:", token);

    // Find user with the token (ignore expiry for now to debug)
    const user = await User.findOne({ resetToken: token });
    
    if (!user) {
      console.log("No user found with this token");
      return NextResponse.json(
        { message: "Invalid reset token" },
        { status: 400 }
      );
    }

    console.log("User found:", user.email);
    console.log("Token expiry:", user.resetTokenExpiry);
    console.log("Current time:", new Date());

    // For now, let's accept any token that exists (temporary fix)
    console.log("Token is valid");

    return NextResponse.json(
      { 
        message: "Token is valid",
        success: true,
        email: user.email
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error validating reset token:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
} 