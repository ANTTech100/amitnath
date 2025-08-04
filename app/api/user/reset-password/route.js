import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Update user password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: password,
      $unset: { resetToken: 1, resetTokenExpiry: 1 }
    });

    return NextResponse.json(
      { 
        message: "Password reset successfully",
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
} 