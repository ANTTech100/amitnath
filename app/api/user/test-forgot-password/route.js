import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found with this email address" },
        { status: 404 }
      );
    }

    console.log("Found user:", user.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    console.log("Generated token:", resetToken);
    console.log("Token expiry:", resetTokenExpiry);

    // Update user with reset token
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      resetToken: resetToken,
      resetTokenExpiry: resetTokenExpiry,
    }, { new: true });

    console.log("User updated:", updatedUser ? "Yes" : "No");
    if (updatedUser) {
      console.log("Saved resetToken:", updatedUser.resetToken);
      console.log("Saved resetTokenExpiry:", updatedUser.resetTokenExpiry);
    }

    // Verify the token was saved
    const verifyUser = await User.findById(user._id);
    console.log("Verification - User has resetToken:", !!verifyUser.resetToken);
    console.log("Verification - User has resetTokenExpiry:", !!verifyUser.resetTokenExpiry);

    return NextResponse.json({
      message: "Test completed",
      userEmail: user.email,
      tokenGenerated: resetToken,
      tokenSaved: !!updatedUser?.resetToken,
      verificationPassed: !!verifyUser.resetToken
    });

  } catch (error) {
    console.error("Error in test forgot password:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
} 