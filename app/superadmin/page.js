"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  FileText,
  Trash2,
  Edit,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import useSuperadminAuth from "@/utils/useSuperadminAuth";

export default function AdminDashboard() {
  const { loading: authLoading, isAuthenticated } = useSuperadminAuth({ redirectTo: null });
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowPasswordPrompt(true);
    } else if (isAuthenticated) {
      setShowPasswordPrompt(false);
      fetchData(activeTab);
    }
    // eslint-disable-next-line
  }, [authLoading, isAuthenticated, activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      let data;
      switch (tab) {
        case "users":
          response = await axios.get("/api/admin/register");
          data = response.data.users;
          setUsers(Array.isArray(data) ? data : []);
          break;
        case "admins":
          response = await axios.get("/api/admin/register");
          data = response.data;
          setAdmins(Array.isArray(data) ? data : []);
          break;
        case "templates":
          response = await axios.get("/api/admin/templatecreate");
          data = response.data?.data;
          setTemplates(Array.isArray(data) ? data : []);
          break;
        case "reports":
          response = await axios.get("/api/feedback");
          data = response.data?.data;
          setReports(Array.isArray(data) ? data : []);
          break;
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
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
        fetchData(activeTab);
      } else {
        setPasswordError("Access Denied: Incorrect password");
        setPassword("");
      }
    } catch (error) {
      setPasswordError("Error verifying password. Please try again.");
      setPassword("");
    }
  };

  // Format date for the reports section
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-b-4 border-blue-200 mb-6"></div>
          <p className="text-lg font-medium text-blue-200 animate-pulse">Loading data...</p>
        </div>
      );
    }
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl text-blue-200 mb-4">{error}</p>
          <button
            onClick={() => fetchData(activeTab)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
          >
            Retry
          </button>
        </motion.div>
      );
    }
    // ... (rest of your tab content rendering logic, unchanged)
    // (copy your previous tab content logic here)
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-blue-300 animate-pulse">
            Loading superadmin...
          </p>
        </div>
      </div>
    );
  }

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Superadmin Access</h2>
            <p className="text-blue-200/80">Enter your password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-200 mb-2">
                Superadmin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
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
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Access Superadmin
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Blue modern tab bar
  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">
        Super Admin Dashboard
      </h1>
      <div className="mb-8">
        <div className="flex border-b border-blue-600/30 bg-gradient-to-r from-blue-800 to-cyan-800 rounded-xl shadow-lg overflow-x-auto">
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 focus:outline-none ${
              activeTab === "users"
                ? "text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-lg shadow-md"
                : "text-blue-200 hover:text-white hover:bg-blue-700/30"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} className="mr-3" />
            Users
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 focus:outline-none ${
              activeTab === "admins"
                ? "text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-lg shadow-md"
                : "text-blue-200 hover:text-white hover:bg-blue-700/30"
            }`}
            onClick={() => setActiveTab("admins")}
          >
            <Shield size={20} className="mr-3" />
            Admins
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 focus:outline-none ${
              activeTab === "templates"
                ? "text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-lg shadow-md"
                : "text-blue-200 hover:text-white hover:bg-blue-700/30"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            <FileText size={20} className="mr-3" />
            Templates
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 focus:outline-none ${
              activeTab === "reports"
                ? "text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-lg shadow-md"
                : "text-blue-200 hover:text-white hover:bg-blue-700/30"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <MessageSquare size={20} className="mr-3" />
            Reports
          </button>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-blue-400/30 transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}
