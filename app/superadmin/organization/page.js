"use client";
import { useEffect, useMemo, useState } from "react";

function TokenChip({ token }) {
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const short = token ? `${token.slice(0, 8)}…${token.slice(-6)}` : "—";

  const copy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(token || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (_) {}
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="px-2 py-1 rounded bg-blue-900/60 text-blue-100 font-mono text-xs break-all">
        {showFull ? token : short}
      </span>
      <button
        onClick={copy}
        className="text-xs px-2 py-1 rounded bg-blue-700 text-white hover:bg-blue-600"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={(e) => { e.preventDefault(); setShowFull((s) => !s); }}
        className="text-xs px-2 py-1 rounded bg-white/20 text-blue-100 hover:bg-white/30"
      >
        {showFull ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function OrgCard({ org, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  const handleResetToken = async (e) => {
    e.preventDefault();
    if (showConfirm !== "reset") {
      setShowConfirm("reset");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${org.id}/reset-token`, {
        method: "POST",
        headers: { "x-superadmin": "true" },
      });
      if (!res.ok) throw new Error("Failed to reset token");
      const data = await res.json();
      onUpdate({ ...org, token: data.newToken });
      setShowConfirm(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (e) => {
    e.preventDefault();
    if (showConfirm !== "pause") {
      setShowConfirm("pause");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${org.id}/toggle-status`, {
        method: "PATCH",
        headers: { "x-superadmin": "true" },
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      onUpdate({ ...org, isActive: data.isActive });
      setShowConfirm(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block bg-white/15 hover:bg-white/20 transition rounded-lg p-5 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="text-white font-semibold text-lg truncate max-w-[60%]">{org.name}</div>
        <span className={`px-2 py-1 rounded text-xs ${org.isActive ? "bg-green-600/70 text-white" : "bg-red-500/70 text-white"}`}>
          {org.isActive ? "Active" : "Paused"}
        </span>
      </div>
      <div className="text-blue-200 text-sm mt-1">Admin: {org.adminEmail}</div>
      <TokenChip token={org.token} />
      <div className="text-blue-300 text-xs mt-3">
        Created: {org.createdAt ? new Date(org.createdAt).toLocaleString() : "—"}
      </div>
      <div className="text-blue-300 text-xs">
        Expires: {org.expiresAt ? new Date(org.expiresAt).toLocaleDateString() : "—"}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleResetToken}
          disabled={loading}
          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition ${
            showConfirm === "reset"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
          } disabled:opacity-50`}
        >
          {loading && showConfirm === "reset" ? "Resetting..." : showConfirm === "reset" ? "Confirm Reset?" : "Reset Token"}
        </button>
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition ${
            showConfirm === "pause"
              ? "bg-red-600 text-white hover:bg-red-700"
              : org.isActive
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-green-600 text-white hover:bg-green-700"
          } disabled:opacity-50`}
        >
          {loading && showConfirm === "pause"
            ? "Updating..."
            : showConfirm === "pause"
            ? "Confirm?"
            : org.isActive
            ? "Pause Account"
            : "Activate Account"}
        </button>
      </div>

      {showConfirm && (
        <button
          onClick={(e) => { e.preventDefault(); setShowConfirm(null); }}
          className="w-full mt-2 px-3 py-1 rounded text-xs bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancel
        </button>
      )}

      <a
        href={`/superadmin/organization/${encodeURIComponent(org.token)}`}
        className="block mt-3 text-blue-100 text-sm hover:text-blue-50"
      >
        View admins →
      </a>
    </div>
  );
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/organizations`, {
          headers: { "x-superadmin": "true" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrganizations(data.organizations || []);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to fetch organizations.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleOrgUpdate = (updatedOrg) => {
    setOrganizations((orgs) =>
      orgs.map((o) => (o.id === updatedOrg.id ? updatedOrg : o))
    );
  };

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = organizations;
    if (q) {
      list = list.filter((o) =>
        (o.name || "").toLowerCase().includes(q) ||
        (o.token || "").toLowerCase().includes(q) ||
        (o.adminEmail || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") {
      list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return list;
  }, [organizations, searchTerm, sortBy]);

  const total = organizations.length;
  const active = organizations.filter((o) => o.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Organizations Management</h1>
        
        <div className="bg-white/10 rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 lg:col-span-2 flex items-center gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, token, or email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-3 rounded-lg bg-white/20 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 rounded-lg p-4">
                <div className="text-blue-200 text-xs">Total Orgs</div>
                <div className="text-white text-2xl font-semibold">{total}</div>
              </div>
              <div className="bg-white/15 rounded-lg p-4">
                <div className="text-blue-200 text-xs">Active</div>
                <div className="text-white text-2xl font-semibold">{active}</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-blue-300">Loading organizations...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-blue-200">No organizations found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((org) => (
                <OrgCard key={org.id} org={org} onUpdate={handleOrgUpdate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}