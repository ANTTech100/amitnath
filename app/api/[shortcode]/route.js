import { connectDB } from "@/config/Database";
import url from "@/modal/url";
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Get shortcode from params (folder name is [shortcode])
    const shortcode = params.shortcode;

    // Find the URL by short code (database field is shortCode)
    const urlDoc = await url.findOne({ shortCode: shortcode });

    if (!urlDoc) {
      return NextResponse.json(
        { error: 'Short URL not found' },
        { status: 404 }
      );
    }

    // Increment click counter
    await url.updateOne(
      { shortCode: shortcode },
      { $inc: { clicks: 1 } }
    );

    // Return the long URL as JSON (don't redirect here)
    return NextResponse.json({
      success: true,
      longUrl: urlDoc.longUrl
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}