import { connectDB } from "@/config/Database";
import Admin from "@/modal/UserAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Connect to the database
    await connectDB();

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify the password (password hashing should be added in production)
    if (admin.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Respond with success message
    return NextResponse.json(
      {
        message: "Login successful",
        adminid: admin._id,
        admin: { name: admin.name, email: admin.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in admin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
