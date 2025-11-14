"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrganizationAdminsPage() {
  const { token } = useParams();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admins`, {
          headers: { "x-admin-token": decodeURIComponent(token) },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAdmins(data.admins || []);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to fetch admins for organization.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAdmins();
  }, [token]);

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Admins</h2>
        <Link href="/superadmin/organization" className="text-blue-200">← All organizations</Link>
      </div>

      {loading ? (
        <div className="text-blue-300">Loading admins...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : admins.length === 0 ? (
        <div className="text-blue-200">No admins found for this organization.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-blue-200">Name</th>
                <th className="px-4 py-2 text-blue-200">Email</th>
                <th className="px-4 py-2 text-blue-200">Created At</th>
                <th className="px-4 py-2 text-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-t border-white/10">
                  <td className="px-4 py-2 text-white">{admin.fullName || admin.name || "—"}</td>
                  <td className="px-4 py-2 text-blue-100">{admin.email || admin.adminEmail || "—"}</td>
                  <td className="px-4 py-2 text-blue-300">{admin.createdAt ? new Date(admin.createdAt).toLocaleString() : "—"}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/superadmin/organization/${encodeURIComponent(token)}/admins/${admin._id}`}
                      className="text-blue-100 hover:text-white"
                    >
                      View users →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}