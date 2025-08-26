// app/layouts/template-ten/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import DynamicPopup from "@/app/components/DynamicPopup";

// Animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function TemplateTenLayout() {
  const params = useParams();
  const id = params?.id;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get template ID from content data
  const templateId = content?.templateId?._id || content?.templateId;

  useEffect(() => {
    if (!id) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/upload`);
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error("Failed to fetch content");
        }

        const matchedContent = data.content.find((item) => item._id === id);
        if (!matchedContent) {
          throw new Error("Content not found");
        }

        setContent(matchedContent);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  // Utility function to truncate text to 15 characters
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-blue-100 animate-pulse">
            Loading content...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-500/50"
        >
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Process sections to separate images and create text cards
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  // Get first image for center background
  const centerImage = sections.find(
    (section) => section.type === "image"
  )?.value;

  // Create cards from text and link pairs
  const textSections = sections.filter((section) => section.type === "text");
  const linkSections = sections.filter((section) => section.type === "link");

  const cards = textSections.map((textSection, index) => ({
    text: textSection.value,
    link: linkSections[index]?.value || null,
  }));

  return (
    <>
      {templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Head>
          <title>{content.heading}</title>
          <meta name="description" content={content.subheading} />
        </Head>

        {/* Main Header */}
        <motion.header
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="py-16 px-4 text-center"
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {content.heading || "Content Gallery"}
          </motion.h1>
          <motion.p
            variants={fadeInVariants}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
          >
            {content.subheading || "Discover amazing content"}
          </motion.p>
        </motion.header>

        {/* Center Background Image */}
        {centerImage && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm"
                style={{ width: "90%", margin: "0 auto", marginTop: "-20px" }}
              >
                <img
                  src={centerImage}
                  alt="Center Image"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Horizontal Cards Section */}
        {cards.length > 0 && (
          <motion.section
            variants={slideInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-8"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Featured Content
                </h3>
                <div className="flex items-center gap-2 text-blue-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                  <span className="text-sm">Scroll to explore</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <div
                className="flex gap-6 px-4 sm:px-6 lg:px-8 pb-4"
                style={{ width: "max-content" }}
              >
                {cards.map((card, index) => (
                  <motion.div
                    key={index}
                    variants={scaleInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300"
                  >
                    {/* Card Content */}
                    <div className="p-6">
                      {/* Truncated Heading (15 characters) */}
                      <h4 className="text-lg font-bold text-white mb-3">
                        {truncateText(card.text || `Card ${index + 1}`, 15)}
                      </h4>

                      {/* Full Text */}
                      <p className="text-sm text-blue-100 leading-relaxed mb-4 line-clamp-4">
                        {card.text || "No description available"}
                      </p>

                      {/* External Link Button */}
                      {card.link && (
                        <a
                          href={card.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                        >
                          <span>Visit Link</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <motion.footer
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/20 backdrop-blur-sm mt-16"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Contact Information
                </h4>
                <p className="text-blue-200">
                  Email: support@codelesspage.info
                  <br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-blue-200 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                  <a
                    href="#"
                    className="block text-blue-200 hover:text-white transition-colors"
                  >
                    Services
                  </a>
                  <a
                    href="#"
                    className="block text-blue-200 hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Privacy Policy
                </h4>
                <p className="text-blue-200 text-sm leading-relaxed">
                  We respect your privacy and are committed to protecting your
                  personal data. This privacy policy will inform you about how we
                  look after your personal data.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-blue-300">
                © 2024 Template Ten. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* Custom scrollbar for better UX */
          .scrollbar-thin::-webkit-scrollbar {
            height: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.7);
          }
        `}</style>
      </div>
    </>
  );
}
