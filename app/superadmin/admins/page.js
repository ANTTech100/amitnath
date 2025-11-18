"use client";
import { useEffect, useState, useMemo } from "react";
import SuperadminNavbar from "../SuperadminNavbar";
import { Search, Users, Building2, Filter } from "lucide-react";

export default function SuperadminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admins?all=true");
        const data = await response.json();
        setAdmins(data.admins || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Get unique organizations
  const organizations = useMemo(() => {
    const orgs = new Set();
    admins.forEach(admin => {
      const orgName = admin.tenantName || admin.tenantToken || "Unknown";
      orgs.add(orgName);
    });
    return Array.from(orgs).sort();
  }, [admins]);

  // Filter admins based on selected organization and search term
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const orgName = admin.tenantName || admin.tenantToken || "Unknown";
      const matchesOrg = selectedOrg === "all" || orgName === selectedOrg;
      const matchesSearch = 
        (admin.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (admin.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orgName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesOrg && matchesSearch;
    });
  }, [admins, selectedOrg, searchTerm]);

  // Get organization statistics
  const orgStats = useMemo(() => {
    const stats = {};
    admins.forEach(admin => {
      const orgName = admin.tenantName || admin.tenantToken || "Unknown";
      stats[orgName] = (stats[orgName] || 0) + 1;
    });
    return stats;
  }, [admins]);

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              Admin Management
            </h1>
            <p className="text-purple-200">Manage all administrators across organizations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Total Admins</p>
                  <p className="text-4xl font-bold text-white mt-2">{admins.length}</p>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-xl">
                  <Users className="w-8 h-8 text-purple-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Organizations</p>
                  <p className="text-4xl font-bold text-white mt-2">{organizations.length}</p>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-xl">
                  <Building2 className="w-8 h-8 text-blue-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Filtered Results</p>
                  <p className="text-4xl font-bold text-white mt-2">{filteredAdmins.length}</p>
                </div>
                <div className="bg-green-500/20 p-4 rounded-xl">
                  <Filter className="w-8 h-8 text-green-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-purple-200 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Organization Filter */}
              <div>
                <label className="text-sm font-medium text-purple-200 mb-2 block">Filter by Organization</label>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-800">All Organizations ({admins.length})</option>
                  {organizations.map((org) => (
                    <option key={org} value={org} className="bg-slate-800">
                      {org} ({orgStats[org] || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-xl text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-purple-200 mt-4">Loading admins...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20 shadow-xl">
              <p className="text-red-300">{error}</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Organization</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <Users className="w-16 h-16 text-purple-300/30 mx-auto mb-4" />
                          <p className="text-purple-200">No admins found matching your criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAdmins.map((admin, index) => (
                        <tr 
                          key={admin._id} 
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-purple-300 font-medium">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                {admin.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <span className="text-white font-medium">{admin.name || "-"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-purple-100">{admin.email || "-"}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">
                              <Building2 className="w-4 h-4" />
                              {admin.tenantName || admin.tenantToken || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-purple-100">
                            {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}