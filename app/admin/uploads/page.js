"use client";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  Calendar,
  User,
  FileText,
  Hash,
  Search,
  Filter,
  MoreVertical,
  RefreshCw,
  Zap,
  TrendingUp,
} from "lucide-react";

const AdminContentDashboard = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all contents
  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/upload");
      const data = await response.json();

      if (data.success) {
        setContents(data.content || []);
      } else {
        setError(data.message || "Failed to fetch contents");
      }
    } catch (err) {
      setError("Failed to fetch contents");
      console.error("Error fetching contents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete content
  const handleDelete = async (contentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this content? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(contentId);
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId }),
      });

      const data = await response.json();

      if (data.success) {
        setContents(contents.filter((content) => content._id !== contentId));
        alert("Content deleted successfully!");
      } else {
        alert(data.message || "Failed to delete content");
      }
    } catch (err) {
      alert("Failed to delete content");
      console.error("Error deleting content:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchContents();
    setRefreshing(false);
  };

  // Filter contents based on search
  const filteredContents = contents.filter(
    (content) =>
      content.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.subheading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchContents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-400 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-purple-400/40 mx-auto"></div>
          </div>
          <p className="mt-6 text-purple-200 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Content Management
              </h1>
              <p className="mt-2 text-slate-300 text-lg">
                Manage all content templates and data with style
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={() => (window.location.href = "/admin/content/add")}
                className="flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Content
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-400">Error</h3>
                <div className="mt-1 text-red-300">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-purple-300">
                  Total Contents
                </dt>
                <dd className="text-3xl font-bold text-white">
                  {contents.length}
                </dd>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-blue-300">
                  Recent Activity
                </dt>
                <dd className="text-lg font-semibold text-white">
                  {contents.length > 0
                    ? formatDate(contents[0]?.updatedAt)
                    : "None"}
                </dd>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-emerald-300">
                  Active Templates
                </dt>
                <dd className="text-3xl font-bold text-white">
                  {new Set(contents.map((c) => c.templateId?._id)).size}
                </dd>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search contents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <button className="flex items-center px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 backdrop-blur-sm">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>

        {/* Content Cards */}
        <div className="backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/30">
            <h3 className="text-2xl font-bold text-white">All Contents</h3>
            <p className="mt-2 text-slate-300">
              Manage your content entries with modern style and efficiency.
            </p>
          </div>

          {filteredContents.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No contents found
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first content"}
              </p>
              <button
                onClick={() => (window.location.href = "/admin/content/add")}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Content
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {filteredContents.map((content, index) => (
                <div
                  key={content._id}
                  className="p-6 hover:bg-slate-700/20 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-2 w-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-400 font-mono">
                          #{content._id}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        {content.heading}
                      </h4>
                      <p className="text-slate-400 mb-4">
                        {content.subheading}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-400" />
                          <div>
                            <span className="text-slate-400">Created by:</span>
                            <span className="text-white ml-1 font-medium">
                              {content.createdBy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-emerald-400" />
                          <div>
                            <span className="text-slate-400">Updated:</span>
                            <span className="text-white ml-1 font-medium">
                              {formatDate(content.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() =>
                          (window.location.href = `/edit/${content._id}`)
                        }
                        className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:text-purple-300 transition-all duration-200"
                        title="Edit Content"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(content._id)}
                        disabled={deleteLoading === content._id}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 disabled:opacity-50"
                        title="Delete Content"
                      >
                        {deleteLoading === content._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContentDashboard;
