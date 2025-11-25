import { connectDB } from "@/config/Database";
import url from "@/modal/url";
import { NextResponse } from 'next/server';

// Generate random short code
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { longUrl, customCode } = await request.json();

    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(longUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let shortCode = customCode;

    // If custom code provided, check if it's available
    if (customCode) {
      const existing = await url.findOne({ shortCode: customCode });
      if (existing) {
        return NextResponse.json(
          { error: 'This custom code is already taken' },
          { status: 409 }
        );
      }
    } else {
      // Generate unique short code
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateShortCode();
        const existing = await url.findOne({ shortCode });
        if (!existing) {
          isUnique = true;
        }
      }
    }

    // Create new URL entry
    const newUrl = await url.create({
      shortCode,
      longUrl,
    });

    return NextResponse.json({
      success: true,
      shortCode: newUrl.shortCode,
      longUrl: newUrl.longUrl,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}