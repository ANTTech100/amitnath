import { connectDB } from "@/config/Database";
import url from "@/modal/url";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const urls = await url.find().sort({ createdAt: -1 });

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Error fetching all URLs:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
