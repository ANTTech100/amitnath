import { connectDB } from "@/config/Database";
import url from "@/modal/url";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { code } = await params;  // <-- fix: folder is [code], not shortCode

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
