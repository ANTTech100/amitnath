import { connectDB } from "@/config/Database";
import Admin from "@/modal/UserAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password, adminCode } = await request.json();

    // Connect to the database
    await connectDB();

    // Verify admin registration code
    if (adminCode !== "admin") {
      return NextResponse.json(
        { message: "Invalid admin registration code" },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Create new admin user (without password hashing)
    const admin = new Admin({
      name,
      email,
      password, // Store the password as-is (no hashing)
      adminCode, // Store the adminCode (optional)
    });

    await admin.save();

    return NextResponse.json(
      { adminid: admin._id, message: "Admin registered successfully" },

      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering admin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all admins from the database
    const admins = await Admin.find({});

    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { email, validated } = await request.json();

    // Connect to the database
    await connectDB();

    // Find admin by email and update the `validated` field
    const admin = await Admin.findOneAndUpdate(
      { email },
      { validated },
      { new: true }
    );

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Admin updated successfully", admin },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating admin:", error);
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
    const admin = await Admin.findOneAndDelete({ email });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin:", error);
    if (error.name === "MongoError") {
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
