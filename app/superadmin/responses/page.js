"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperadminResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/responses?all=true");
        setResponses(response.data.responses || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch responses.");
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Responses (All Organizations)</h1>
        {loading ? (
          <div className="text-blue-300">Loading responses...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-blue-200">User</th>
                  <th className="px-4 py-2 text-blue-200">Response</th>
                  <th className="px-4 py-2 text-blue-200">Organization</th>
                  <th className="px-4 py-2 text-blue-200">Created At</th>
                </tr>
              </thead>
              <tbody>
                {responses.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-blue-200 py-8">No responses found.</td></tr>
                ) : (
                  responses.map((r) => (
                    <tr key={r._id} className="border-b border-blue-800/30">
                      <td className="px-4 py-2 text-white">{r.userName || r.userEmail || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{r.text || r.response || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{r.tenantName || r.tenantToken || "-"}</td>
                      <td className="px-4 py-2 text-blue-100">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</td>
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