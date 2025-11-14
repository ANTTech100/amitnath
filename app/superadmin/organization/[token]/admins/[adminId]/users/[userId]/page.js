"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function UserPagesPage() {
  const { token, adminId, userId } = useParams();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/upload?userId=${encodeURIComponent(userId)}`, {
          headers: { "x-admin-token": decodeURIComponent(token) },
        });
        const data = await res.json();
        // Treat empty results as valid; avoid throwing on 404-like cases
        setContents(Array.isArray(data.content) ? data.content : []);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to fetch pages for user.");
      } finally {
        setLoading(false);
      }
    };
    if (token && userId) fetchContent();
  }, [token, userId]);

  const userContents = useMemo(() => {
    return contents.filter((c) => (c.createdBy || "").toString() === userId);
  }, [contents, userId]);

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">User Pages</h2>
        <div className="flex gap-4">
          <a href={`/superadmin/organization/${encodeURIComponent(token)}/admins/${adminId}`} className="text-blue-200">← Users</a>
          <a href={`/superadmin/organization/${encodeURIComponent(token)}`} className="text-blue-200">Admins</a>
          <a href="/superadmin/organization" className="text-blue-200">All organizations</a>
        </div>
      </div>

      {loading ? (
        <div className="text-blue-300">Loading pages...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : userContents.length === 0 ? (
        <div className="text-blue-200">No pages found for this user.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userContents.map((content) => (
            <div key={content._id} className="bg-white/15 rounded-lg p-4 border border-white/10">
              <div className="text-white font-semibold text-lg">{content.heading || content.title || "Untitled"}</div>
              <div className="text-blue-200 text-sm mt-1">Template: {content.templateId?.name || content.templateId || "—"}</div>
              <div className="text-blue-300 text-xs mt-2">Updated: {content.updatedAt ? new Date(content.updatedAt).toLocaleString() : "—"}</div>
              <div className="mt-3">
                <a
                  href={`/edit/${content._id}`}
                  className="inline-block px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500"
                >
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}