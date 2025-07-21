"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperadminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admins?all=true");
        setAdmins(response.data.admins || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Admins (All Organizations)</h1>
        {loading ? (
          <div className="text-blue-300">Loading admins...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-blue-200">Name</th>
                  <th className="px-4 py-2 text-blue-200">Email</th>
                  <th className="px-4 py-2 text-blue-200">Organization</th>
                  <th className="px-4 py-2 text-blue-200">Created At</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-blue-200 py-8">No admins found.</td></tr>
                ) : (
                  admins.map((a) => (
                    <tr key={a._id} className="border-b border-blue-800/30">
                      <td className="px-4 py-2 text-white">{a.name || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{a.email || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{a.tenantName || a.tenantToken || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}</td>
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