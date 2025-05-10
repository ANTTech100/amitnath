"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminNavbar from "../Navbar";

export default function AdminAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Login successful!");
      localStorage.setItem("adminToken", response.data.adminid);
      router.push("/admin/hero");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/admin/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode,
      });

      setSuccess("Admin registration successful! You can now login.");
      setActiveTab("login");
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
        adminCode: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 p-10 rounded-xl shadow-2xl w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            Admin Portal
          </h1>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-700">
            <button
              className={`flex-1 py-3 font-semibold text-center transition-colors duration-300 ${
                activeTab === "login"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 font-semibold text-center transition-colors duration-300 ${
                activeTab === "register"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                />
              </div>

              <div className="mb-8">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister}>
              <div className="mb-6">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="regEmail"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="regEmail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="regPassword"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="regPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                />
              </div>

              <div className="mb-8">
                <label
                  className="block text-gray-300 text-sm font-semibold mb-2"
                  htmlFor="adminCode"
                >
                  Admin Registration Code
                </label>
                <input
                  type="text"
                  id="adminCode"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  required
                  placeholder="Enter admin code"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
