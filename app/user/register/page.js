"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import UserNavbar from "../Header";

export default function UserAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    tenantName: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

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
      const response = await axios.post("/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Login successful!");
      const userid = localStorage.setItem("userid", response.data.userid);
      console.log("User ID:", userid);
      router.push("/");
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

    if (!formData.fullName || !formData.email || !formData.password || !formData.tenantName) {
      setError("All fields are required, including organization name");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/user/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        tenantName: formData.tenantName,
      });
      const userid = localStorage.setItem("userid", response.data.userid);
      console.log("User ID:", userid);
      setSuccess("Registration successful! You can now login.");
      setActiveTab("login");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        tenantName: "",
      });
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");
    setSuccess("");

    if (!forgotPasswordEmail) {
      setError("Please enter your email address");
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/user/forgot-password", {
        email: forgotPasswordEmail,
      });

      setSuccess("Password reset email sent! Please check your inbox.");
      setForgotPasswordEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <UserNavbar></UserNavbar>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-8 rounded-xl shadow-lg border border-purple-500/30 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center text-purple-100 mb-6">
            User Portal
          </h1>

          {/* Tabs */}
          <div className="flex mb-6 border-b border-purple-500/30">
            <button
              className={`flex-1 py-2 font-medium text-center rounded-t-xl ${
                activeTab === "login"
                  ? "bg-purple-500/20 text-purple-300 border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-purple-300"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 font-medium text-center rounded-t-xl ${
                activeTab === "register"
                  ? "bg-purple-500/20 text-purple-300 border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-purple-300"
              }`}
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
            <button
              className={`flex-1 py-2 font-medium text-center rounded-t-xl ${
                activeTab === "forgot"
                  ? "bg-purple-500/20 text-purple-300 border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-purple-300"
              }`}
              onClick={() => handleTabChange("forgot")}
            >
              Forgot Password
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-4"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-xl mb-4"
            >
              {success}
            </motion.div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
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
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
                  htmlFor="tenantName"
                >
                  Organization Name
                </label>
                <input
                  type="text"
                  id="tenantName"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                  placeholder="Enter your organization name"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {activeTab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-300 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-1"
                  htmlFor="forgotEmail"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
                disabled={forgotPasswordLoading}
              >
                {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleTabChange("login")}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
