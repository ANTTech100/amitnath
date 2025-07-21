"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperadminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users?all=true");
        setUsers(response.data.users || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Users (All Organizations)</h1>
        {loading ? (
          <div className="text-blue-300">Loading users...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-blue-200">Full Name</th>
                  <th className="px-4 py-2 text-blue-200">Email</th>
                  <th className="px-4 py-2 text-blue-200">Organization</th>
                  <th className="px-4 py-2 text-blue-200">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-blue-200 py-8">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-b border-blue-800/30">
                      <td className="px-4 py-2 text-white">{u.fullName || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{u.email || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{u.tenantName || u.tenantToken || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
} 