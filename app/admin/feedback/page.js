"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Send, FileText, Edit, PlusCircle } from "lucide-react";
import AdminNavbar from "../Navbar";

export default function AdminFeedback() {
  const [formData, setFormData] = useState({
    topic: "",
    changes: "",
    updates: "",
    feedback: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/feedback", {
        adminid: localStorage.getItem("adminToken"),
        topic: formData.topic,
        changes: formData.changes,
        updates: formData.updates,
        feedback: formData.feedback,
      });
      console.log("Feedback response:", response.data); // Debug log

      setSuccess("Feedback submitted successfully!");
      setFormData({
        topic: "",
        changes: "",
        updates: "",
        feedback: "",
      });
      setTimeout(() => {
        router.push("/admin/hero");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800"
        style={{ padding: "20px" }}
      >
        <div className="bg-gray-900 p-12 rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <h1 className="text-4xl font-bold text-center text-white mb-10 flex items-center justify-center gap-3 font-sans">
            <FileText className="w-9 h-9 animate-pulse" />
            Daily Admin Feedback
          </h1>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-900/80 border border-red-700 text-red-100 px-5 py-4 rounded-lg mb-8 animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/80 border border-green-700 text-green-100 px-5 py-4 rounded-lg mb-8 animate-fade-in">
              {success}
            </div>
          )}

          {/* Feedback Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label
                className="block text-gray-200 text-sm font-semibold mb-3 flex items-center gap-2"
                htmlFor="topic"
              >
                <Edit className="w-5 h-5 text-white transition-transform duration-200 hover:scale-110" />
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 hover:bg-gray-700"
                required
                placeholder="Enter the topic of today's work"
              />
            </div>

            <div className="mb-8">
              <label
                className="block text-gray-200 text-sm font-semibold mb-3 flex items-center gap-2"
                htmlFor="changes"
              >
                <Edit className="w-5 h-5 text-white transition-transform duration-200 hover:scale-110" />
                Changes Made
              </label>
              <textarea
                id="changes"
                name="changes"
                value={formData.changes}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 hover:bg-gray-700"
                required
                placeholder="Describe any changes implemented today"
                rows="5"
              />
            </div>

            <div className="mb-8">
              <label
                className="block text-gray-200 text-sm font-semibold mb-3 flex items-center gap-2"
                htmlFor="updates"
              >
                <PlusCircle className="w-5 h-5 text-white transition-transform duration-200 hover:scale-110" />
                New Updates
              </label>
              <textarea
                id="updates"
                name="updates"
                value={formData.updates}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 hover:bg-gray-700"
                required
                placeholder="List any new updates or features added"
                rows="5"
              />
            </div>

            <div className="mb-10">
              <label
                className="block text-gray-200 text-sm font-semibold mb-3 flex items-center gap-2"
                htmlFor="feedback"
              >
                <FileText className="w-5 h-5 text-white transition-transform duration-200 hover:scale-110" />
                General Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 hover:bg-gray-700"
                placeholder="Share any additional feedback or notes"
                rows="5"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-4 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 animate-bounce" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
