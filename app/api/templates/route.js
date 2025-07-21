import { connectDB } from "@/config/Database";
import Template from "@/modal/Template";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    let templates;
    if (all === "true") {
      templates = await Template.find({});
    } else {
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      templates = await Template.find({ tenantToken });
    }
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 