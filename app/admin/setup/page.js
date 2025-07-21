"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const [adminToken, setAdminToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Check if admin token is already set
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      // Check if admin is already registered
      const adminData = localStorage.getItem("adminData");
      if (adminData) {
        router.push("/admin/hero");
      } else {
        router.push("/admin/register");
      }
    }
  }, [router]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!adminToken.trim()) {
      setError("Please enter your admin token");
      setLoading(false);
      return;
    }

    try {
      // Validate the token using the correct API endpoint
      const response = await fetch("/api/admin/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: adminToken.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Token is valid, store it and redirect to registration
        localStorage.setItem("adminToken", adminToken.trim());
        localStorage.setItem("adminTokenData", JSON.stringify(data.tokenData));
        setSuccess("Token validated successfully! Redirecting to admin registration...");
        setTimeout(() => {
          router.push("/admin/register");
        }, 1500);
      } else {
        setError(data.message || "Invalid admin token");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setError("Failed to validate token. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Setup</h2>
          <p className="text-blue-200/80">Enter your admin token to access your dashboard</p>
        </div>

        <form onSubmit={handleTokenSubmit} className="space-y-6">
          <div>
            <label htmlFor="adminToken" className="block text-sm font-semibold text-blue-200 mb-2">
              Admin Token
            </label>
            <input
              id="adminToken"
              type="text"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              placeholder="Enter your admin token"
              required
            />
            <p className="text-xs text-blue-200/60 mt-2">
              Contact your system administrator to get your admin token
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-400/30 text-green-200 px-4 py-3 rounded-xl"
            >
              {success}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="font-semibold">Validating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Continue to Registration</span>
                </>
              )}
            </div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-blue-200/60 text-sm">
            Don't have an admin token?{" "}
            <span className="text-blue-300 font-medium">Contact your administrator</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 