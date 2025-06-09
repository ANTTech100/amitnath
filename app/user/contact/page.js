"use client";
import { useState } from "react";
import UserNavbar from "../Header";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", issue: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {" "}
      <UserNavbar></UserNavbar>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}

          <div className="text-center mb-16">
            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from
              you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Let's Start a Conversation
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Whether you're experiencing technical issues, have feature
                  requests, or just want to share feedback about WORK, we're
                  here to help.
                </p>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">📧</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Email Support
                      </h3>
                      <p className="text-gray-400">support@work.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">💬</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Live Chat</h3>
                      <p className="text-gray-400">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Quick Response
                      </h3>
                      <p className="text-gray-400">Usually within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">
                  Check Our FAQ First
                </h3>
                <p className="text-gray-300 mb-4">
                  Many common questions are already answered in our FAQ section.
                </p>
                <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 flex items-center gap-2">
                  <span>View FAQ</span>
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-gray-400">
                    Fill out the form below and we'll get back to you soon
                  </p>
                </div>

                {/* Name Field */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Your Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-focus-within:from-purple-600/10 group-focus-within:to-blue-600/10 pointer-events-none transition-all duration-300"></div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-focus-within:from-purple-600/10 group-focus-within:to-blue-600/10 pointer-events-none transition-all duration-300"></div>
                  </div>
                </div>

                {/* issue Field */}
                <div className="group">
                  <label
                    htmlFor="issue"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Your Message *
                  </label>
                  <div className="relative">
                    <textarea
                      id="issue"
                      name="issue"
                      value={formData.issue}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 resize-none"
                      placeholder="Tell us about your issue, question, or feedback..."
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-focus-within:from-purple-600/10 group-focus-within:to-blue-600/10 pointer-events-none transition-all duration-300"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full px-6 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">📨</span>
                        Send Message
                      </>
                    )}
                  </span>
                </button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="p-4 bg-emerald-600/20 border border-emerald-400/30 rounded-xl">
                    <p className="text-emerald-300 text-center font-semibold flex items-center justify-center gap-2">
                      <span>✅</span>
                      Message sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-600/20 border border-red-400/30 rounded-xl">
                    <p className="text-red-300 text-center font-semibold flex items-center justify-center gap-2">
                      <span>❌</span>
                      Failed to send message. Please try again.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
