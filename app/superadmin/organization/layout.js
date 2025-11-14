"use client";
import SuperadminNavbar from "../SuperadminNavbar";

export default function OrganizationLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
      <SuperadminNavbar />
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Organizations</h1>
          <div className="text-blue-200">Superadmin • Tenant overview</div>
        </div>
        {children}
      </div>
    </div>
  );
}