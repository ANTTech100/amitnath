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

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user/reset-password?token=${resetToken}`;

    // TEMPORARILY SKIP EMAIL SENDING FOR TESTING
    console.log("Reset URL for testing:", resetUrl);

    return NextResponse.json(
      { 
        message: "Password reset token generated successfully. Check console for reset URL.",
        success: true,
        resetUrl: resetUrl // Include the URL in response for testing
      },
      { status: 200 }
    );

    /* COMMENTED OUT EMAIL SENDING FOR TESTING
    // Email content
    const emailSubject = "Password Reset Request";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.fullName},</p>
        <p>You have requested to reset your password. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 7 days for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>Your Application Team</p>
      </div>
    `;

    // Send email using the existing email API
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: emailSubject,
          message: emailBody,
          fromName: "Password Reset Service"
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }

      return NextResponse.json(
        { 
          message: "Password reset email sent successfully. Please check your inbox.",
          success: true
        },
        { status: 200 }
      );

    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      
      // Remove the reset token if email failed
      await User.findByIdAndUpdate(user._id, {
        $unset: { resetToken: 1, resetTokenExpiry: 1 }
      });

      return NextResponse.json(
        { message: "Failed to send password reset email. Please try again later." },
        { status: 500 }
      );
    }
    */

  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
} 