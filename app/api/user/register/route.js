import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";

// POST route to register a user
export async function POST(request) {
  try {
    const { fullName, email, password, confirmPassword } = await request.json();
    console.log(fullName, email, password, confirmPassword);

    // Connect to the database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Create new user with initial `validated` status as `false`
    const user = new User({
      fullName,
      email,
      password, // Store the plain text password (not recommended for production)
      confirmPassword, // Store the plain text confirmPassword (not recommended for production)
      validated: false, // Not approved by admin yet
    });

    await user.save();

    return NextResponse.json(
      { userid: user._id },
      { user, message: "User registered successfully" },

      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT route for admin approval
export async function PUT(request) {
  try {
    const { email, validated } = await request.json();

    // Connect to the database
    await connectDB();

    // Find user by email and update the `validated` field
    const user = await User.findOneAndUpdate(
      { email },
      { validated },
      { new: true }
    ).select("-password"); // Exclude password from the response

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User validation status updated", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user validation:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET route to show all users
export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all users
    const users = await User.find();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await User.findOneAndDelete({ email });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting User:", error);
    if (error.name === "MongoError") {
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
