import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import AdminToken from "@/modal/AdminToken";
import { NextResponse } from "next/server";
import { validateTenantToken } from "@/utils/tenantHelper";

// POST route to register a user
export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword, tenantName } = body;
    console.log("Received tenantName:", tenantName);

    // Connect to the database
    await connectDB();

    // Find admin token by tenantName (case-insensitive)
    const tokenDoc = await AdminToken.findOne({ tenantName: { $regex: new RegExp(`^${tenantName}$`, 'i') }, isActive: true });
    if (!tokenDoc) {
      return NextResponse.json({ message: "Invalid organization name. Please check with your admin." }, { status: 400 });
    }
    const validTenantToken = tokenDoc.token;

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
      tenantToken: validTenantToken, // Add tenant token from organization name
    });

    await user.save();

    return NextResponse.json(
      { userid: user._id, message: "User registered successfully" },
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

    // Validate tenant token if provided
    const tenantValidation = await validateTenantToken(request);
    const tenantToken = tenantValidation.success ? tenantValidation.tenant.token : null;

    // Build query with tenant filtering
    const query = { email };
    if (tenantToken) {
      query.tenantToken = tenantToken;
    }

    // Find user by email and update the `validated` field
    const user = await User.findOneAndUpdate(
      query,
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
export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // Validate tenant token if provided
    const tenantValidation = await validateTenantToken(request);
    
    if (!tenantValidation.success) {
      return NextResponse.json(
        { message: tenantValidation.error },
        { status: tenantValidation.status }
      );
    }

    // Build query with tenant filtering
    const query = {};
    if (tenantValidation.tenant) {
      query.tenantToken = tenantValidation.tenant.token;
    }

    // Fetch users based on tenant
    const users = await User.find(query);

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

    // Validate tenant token if provided
    const tenantValidation = await validateTenantToken(request);
    const tenantToken = tenantValidation.success ? tenantValidation.tenant.token : null;

    // Build query with tenant filtering
    const query = { email };
    if (tenantToken) {
      query.tenantToken = tenantToken;
    }

    const admin = await User.findOneAndDelete(query);

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
