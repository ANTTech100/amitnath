"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminUsersPage() {
  const { token, adminId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users`, {
          headers: { "x-admin-token": decodeURIComponent(token) },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUsers(data.users || []);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to fetch users for admin organization.");
      } finally {
        setLoading(false);
      }
    };
    if (token && adminId) fetchUsers();
  }, [token, adminId]);

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Users</h2>
        <div className="flex gap-4">
          <Link href={`/superadmin/organization/${encodeURIComponent(token)}`} className="text-blue-200">← Admins</Link>
          <Link href="/superadmin/organization" className="text-blue-200">All organizations</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-blue-300">Loading users...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-blue-200">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-blue-200">Name</th>
                <th className="px-4 py-2 text-blue-200">Email</th>
                <th className="px-4 py-2 text-blue-200">Pages</th>
                <th className="px-4 py-2 text-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-white/10">
                  <td className="px-4 py-2 text-white">{user.fullName || user.name || "—"}</td>
                  <td className="px-4 py-2 text-blue-100">{user.email || "—"}</td>
                  <td className="px-4 py-2 text-blue-300">{user.pagesCreated ?? "—"}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/superadmin/organization/${encodeURIComponent(token)}/admins/${adminId}/users/${user._id}`}
                      className="text-blue-100 hover:text-white"
                    >
                      View pages →
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