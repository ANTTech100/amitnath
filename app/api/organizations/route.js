import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AdminToken from "@/modal/AdminToken";

// GET /api/organizations
// Lists all organizations (tenants) for superadmin usage
export async function GET(request) {
  try {
    await connectDB();

    // Only allow superadmin to list all organizations
    const isSuperadmin = request.headers.get("x-superadmin") === "true";
    if (!isSuperadmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase();

    // Fetch all admin tokens which represent organizations/tenants
    const tokens = await AdminToken.find({}).lean();

    // Map to organization objects
    let organizations = tokens.map((t) => ({
      id: t._id?.toString(),
      name: t.tenantName,
      token: t.token,
      adminEmail: t.adminEmail,
      isActive: !!t.isActive,
      createdAt: t.createdAt,
      expiresAt: t.expiresAt || null,
    }));

    // Apply search filter if provided
    if (q) {
      organizations = organizations.filter((o) => {
        return (
          (o.name || "").toLowerCase().includes(q) ||
          (o.token || "").toLowerCase().includes(q) ||
          (o.adminEmail || "").toLowerCase().includes(q)
        );
      });
    }

    return NextResponse.json({ organizations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}