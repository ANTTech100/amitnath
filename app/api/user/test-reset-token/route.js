import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    // Get all users
    const allUsers = await User.find({});
    console.log("Total users:", allUsers.length);

    // Check if any users have reset tokens
    const usersWithTokens = await User.find({ resetToken: { $exists: true } });
    console.log("Users with reset tokens:", usersWithTokens.length);

    if (usersWithTokens.length > 0) {
      console.log("Sample user data:", {
        email: usersWithTokens[0].email,
        resetToken: usersWithTokens[0].resetToken,
        resetTokenExpiry: usersWithTokens[0].resetTokenExpiry,
        hasResetToken: !!usersWithTokens[0].resetToken,
        hasResetTokenExpiry: !!usersWithTokens[0].resetTokenExpiry
      });
    }

    return NextResponse.json({
      totalUsers: allUsers.length,
      usersWithTokens: usersWithTokens.length,
      sampleUser: usersWithTokens.length > 0 ? {
        email: usersWithTokens[0].email,
        hasResetToken: !!usersWithTokens[0].resetToken,
        hasResetTokenExpiry: !!usersWithTokens[0].resetTokenExpiry
      } : null
    });

  } catch (error) {
    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
} 