"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import useSuperadminAuth from "@/utils/useSuperadminAuth";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperAdminTokensPage() {
  const { loading: authLoading, isAuthenticated } = useSuperadminAuth({ redirectTo: null });
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: "",
    adminEmail: "",
    expiresAt: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowPasswordPrompt(true);
    } else if (isAuthenticated) {
      setShowPasswordPrompt(false);
      fetchTokens();
    }
    // eslint-disable-next-line
  }, [authLoading, isAuthenticated]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/superadmin/tokens");
      if (response.data.success) {
        setTokens(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setError("Failed to fetch tokens");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!password) {
      setPasswordError("Please enter the password");
      return;
    }
    try {
      const response = await axios.post("/api/password", { password });
      if (response.data.success) {
        localStorage.setItem("superadminAuth", "true");
        setShowPasswordPrompt(false);
        setPassword("");
        fetchTokens();
      } else {
        setPasswordError("Access Denied: Incorrect password");
        setPassword("");
      }
    } catch (error) {
      setPasswordError("Error verifying password. Please try again.");
      setPassword("");
    }
  };

  const handleCreateToken = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/superadmin/tokens", formData);
      if (response.data.success) {
        setSuccess("Token created successfully!");
        setFormData({ tenantName: "", adminEmail: "", expiresAt: "" });
        setShowCreateForm(false);
        fetchTokens();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create token");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    if (!confirm("Are you sure you want to delete this token?")) {
      return;
    }

    try {
      const response = await axios.delete("/api/superadmin/tokens", {
        data: { tokenId }
      });
      if (response.data.success) {
        setSuccess("Token deleted successfully!");
        fetchTokens();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete token");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess("Token copied to clipboard!");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-purple-300 animate-pulse">
            Loading superadmin...
          </p>
        </div>
      </div>
    );
  }

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Superadmin Access</h2>
            <p className="text-purple-200/80">Enter your password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-purple-200 mb-2">
                Superadmin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                placeholder="Enter superadmin password"
                required
              />
            </div>
            {passwordError && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Access Superadmin
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <SuperadminNavbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-cyan-200 mb-4">
            Admin Token Management
          </h1>
          <p className="text-xl text-purple-200/80">Manage admin tokens for your clients</p>
          <div className="mt-4 text-lg text-purple-100 font-semibold">
            Total Tokens Generated: <span className="text-cyan-200">{tokens.length}</span>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-4 rounded-xl mb-6 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 backdrop-blur-sm border border-green-400/30 text-green-200 px-6 py-4 rounded-xl mb-6 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{success}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Token Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-semibold">Create New Token</span>
            </div>
          </button>
        </motion.div>

        {/* Create Token Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Create New Admin Token</h3>
              <form onSubmit={handleCreateToken} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Tenant/Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.tenantName}
                      onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                      placeholder="Enter admin email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 transition-all duration-200"
                  >
                    {creating ? "Creating..." : "Create Token"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tokens List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Active Tokens ({tokens.length})
          </h3>

          {tokens.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p className="text-purple-200/60 text-lg">No tokens created yet</p>
              <p className="text-purple-200/40 text-sm mt-2">Create your first admin token above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <motion.div
                  key={token._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white text-lg">{token.tenantName}</h4>
                      <p className="text-purple-200/60">{token.adminEmail}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(token.token)}
                        className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Copy</span>
                      </button>
                      <button
                        onClick={() => handleDeleteToken(token._id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200/80 text-sm font-medium">Token:</span>
                      <span className="text-purple-200 text-xs font-mono">{token.token.substring(0, 20)}...</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-purple-200/60">
                    <div className="flex items-center space-x-4">
                      <span>Created: {new Date(token.createdAt).toLocaleDateString()}</span>
                      {token.expiresAt && (
                        <span>Expires: {new Date(token.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      token.isActive 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {token.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 