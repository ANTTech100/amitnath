import { connectDB } from "@/config/Database";
import Admin from "@/modal/UserAdmin";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    let admins;
    if (all === "true") {
      admins = await Admin.find({});
    } else {
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      admins = await Admin.find({ tenantToken });
    }
    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 