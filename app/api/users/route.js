import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    let users;
    if (all === "true") {
      users = await User.find({});
    } else {
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      users = await User.find({ tenantToken });
    }
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 