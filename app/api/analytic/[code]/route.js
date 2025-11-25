import { connectDB } from "@/config/Database";
import url from "@/modal/url";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await connectDB();

    const { code } = await context.params;  // ✅ FIXED

    const urlDoc = await url.findOne({ shortCode: code });

    if (!urlDoc) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shortCode: urlDoc.shortCode,
      longUrl: urlDoc.longUrl,
      clicks: urlDoc.clicks,
      createdAt: urlDoc.createdAt,
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
