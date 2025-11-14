import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AdminToken from "@/modal/AdminToken";
import crypto from 'crypto';

// Generate a random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// GET - List all tokens
export async function GET() {
  try {
    await connectDB();
    const tokens = await AdminToken.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}

// POST - Create new token
export async function POST(request) {
  try {
    await connectDB();
    const { tenantName, adminEmail, expiresAt } = await request.json();

    if (!tenantName || !adminEmail) {
      return NextResponse.json(
        { success: false, message: "Tenant name and admin email are required" },
        { status: 400 }
      );
    }

    const token = generateToken();
    
    const newToken = new AdminToken({
      token,
      tenantName,
      adminEmail,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await newToken.save();
    // Send email to the provided admin email with tenant details and token
    try {
      const emailEndpoint = new URL('/api/email', request.url).toString();
      const subject = `Tenant Token Created - ${tenantName}`;
      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin:0 auto;">
          <h2 style="color:#111">Tenant Token Generated</h2>
          <p><strong>Tenant Name:</strong> ${tenantName}</p>
          <p><strong>Tenant Token:</strong> <code>${token}</code></p>
          ${newToken.expiresAt ? `<p><strong>Expires At:</strong> ${newToken.expiresAt.toISOString()}</p>` : ''}
          <p style="margin-top:16px">Use this token in your admin setup to manage your tenant’s content and responses.</p>
        </div>
      `;

      const emailRes = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: adminEmail,
          subject,
          message,
          fromName: 'Super Admin'
        })
      });

      if (!emailRes.ok) {
        console.warn('Failed to send tenant token email to admin');
      }
    } catch (emailErr) {
      console.error('Error while emailing tenant token:', emailErr);
      // Do not fail token creation due to email errors
    }

    return NextResponse.json({
      success: true,
      message: "Token created successfully",
      data: {
        token,
        tenantName,
        adminEmail,
        createdAt: newToken.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create token" },
      { status: 500 }
    );
  }
}

// DELETE - Delete token
export async function DELETE(request) {
  try {
    await connectDB();
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json(
        { success: false, message: "Token ID is required" },
        { status: 400 }
      );
    }

    const deletedToken = await AdminToken.findByIdAndDelete(tokenId);
    
    if (!deletedToken) {
      return NextResponse.json(
        { success: false, message: "Token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting token:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete token" },
      { status: 500 }
    );
  }
}