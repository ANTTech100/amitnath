"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperadminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/templates?all=true");
        setTemplates(response.data.templates || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch templates.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Templates (All Organizations)</h1>
        {loading ? (
          <div className="text-blue-300">Loading templates...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-blue-200">Name</th>
                  <th className="px-4 py-2 text-blue-200">Description</th>
                  <th className="px-4 py-2 text-blue-200">Organization</th>
                  <th className="px-4 py-2 text-blue-200">Created At</th>
                </tr>
              </thead>
              <tbody>
                {templates.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-blue-200 py-8">No templates found.</td></tr>
                ) : (
                  templates.map((t) => (
                    <tr key={t._id} className="border-b border-blue-800/30">
                      <td className="px-4 py-2 text-white">{t.name || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{t.description || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{t.tenantName || t.tenantToken || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}</td>
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