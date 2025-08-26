// app/layouts/template-ten/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";

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

  // Function to render video based on URL
  const renderVideo = (url) => {
    console.log("Video URL:", url);
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Handle both youtube.com and youtu.be URLs
      let videoId = "";
      if (url.includes("youtube.com")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }

      if (!videoId) {
        console.error("Invalid YouTube URL:", url);
        return (
          <div className="text-center text-white">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">Invalid YouTube URL</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-400 hover:text-blue-300 underline"
            >
              Open in new tab
            </a>
          </div>
        );
      }

      return (
        <div className="relative group">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-2xl shadow-xl border border-white/20 transition-transform duration-300 group-hover:scale-102"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm rounded-2xl hidden items-center justify-center">
            <div className="text-center text-white">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">Video could not be loaded</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-400 hover:text-blue-300 underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      );
    } else if (url.includes("mux.com")) {
      return (
        <div className="relative group">
          <video
            width="100%"
            height="500"
            controls
            src={url}
            className="rounded-2xl shadow-xl border border-white/20"
          />
        </div>
      );
    } else {
      console.error("Unsupported video platform:", url);
      return <p className="text-red-600">Unsupported video platform</p>;
    }
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

  // Process sections
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  // Extract content by type
  const videoSection = sections.find((section) => section.type === "video");
  const textSections = sections.filter((section) => section.type === "text");
  const imageSection = sections.find((section) => section.type === "image");
  const linkSection = sections.find((section) => section.type === "link");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>{content.heading}</title>
        <meta name="description" content={content.subheading} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Header */}
        <motion.header
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {content.heading || "Welcome"}
          </motion.h1>
          <motion.p
            variants={fadeInVariants}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
          >
            {content.subheading || "Discover amazing content"}
          </motion.p>
        </motion.header>

        {/* Video Section */}
        {videoSection && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20 backdrop-blur-sm">
                {renderVideo(videoSection.value)}
              </div>
            </div>
          </motion.section>
        )}

        {/* Main Content Grid */}
        <motion.section
          variants={slideInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Text Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                Key Information
              </h3>
              {textSections.slice(0, 3).map((textSection, index) => (
                <motion.div
                  key={textSection.id}
                  variants={scaleInVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Text Card {index + 1}
                      </h4>
                      <p className="text-blue-100 leading-relaxed">
                        {textSection.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Side - Image */}
            {imageSection && (
              <motion.div
                variants={scaleInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:sticky lg:top-8"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20 backdrop-blur-sm">
                  <img
                    src={imageSection.value}
                    alt="Featured Content"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Bottom Link Button */}
        {linkSection && (
          <motion.section
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <a
              href={linkSection.value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl border border-blue-500/50"
            >
              <span className="text-lg">Explore More</span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </motion.section>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/20 backdrop-blur-sm"
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

      {/* Custom Styles */}
      <style jsx global>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
