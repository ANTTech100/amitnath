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

  // Convert YouTube URLs to embed format
  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    // Handle various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    return url; // Return original if not a YouTube URL
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-rose-100 animate-pulse">
            Loading content...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
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

  const videos = sections.filter((section) => section.type === "video");
  const texts = sections.filter((section) => section.type === "text");
  const images = sections.filter((section) => section.type === "image");

  // Layout structure:
  // 1. Main heading
  // 2. First video (hero)
  // 3. Second title (from text description)
  // 4. 4 videos horizontal scroll
  // 5. 4 images horizontal scroll
  // 6. Final text

  const firstVideo = videos[0]?.value || "";
  const remainingVideos = videos.slice(1, 5); // Next 4 videos for horizontal scroll
  const firstText = texts[0]?.value || "Video Collection";
  const lastText =
    texts[texts.length - 1]?.value || "Thank you for watching our content!";

  return (
    <>
      {templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900">
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
            {content.heading || "Video Gallery"}
          </motion.h1>
          <motion.p
            variants={fadeInVariants}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-rose-100 max-w-4xl mx-auto leading-relaxed"
          >
            {content.subheading || "Discover amazing video content"}
          </motion.p>
        </motion.header>

        {/* First Video (Hero) */}
        {firstVideo && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-5xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm"
              >
                <div className="aspect-video">
                  <iframe
                    src={convertToEmbedUrl(firstVideo)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Main Video"
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Second Title */}
        <motion.section
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12 px-4 text-center"
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Content
          </motion.h2>
          <motion.p className="text-lg md:text-xl text-rose-100 max-w-3xl mx-auto">
            {firstText}
          </motion.p>
        </motion.section>

        {/* 4 Videos Horizontal Scroll */}
        {remainingVideos.length > 0 && (
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
                  Video Collection
                </h3>
                <div className="flex items-center gap-2 text-rose-200">
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
                {remainingVideos.map((video, index) => (
                  <motion.div
                    key={index}
                    variants={scaleInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-96 h-56 relative rounded-xl overflow-hidden shadow-xl bg-gray-900/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
                  >
                    <iframe
                      src={convertToEmbedUrl(video.value)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video ${index + 2}`}
                    />
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                      Video {index + 2}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* 4 Images Horizontal Scroll */}
        {images.length > 0 && (
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
                  Image Gallery
                </h3>
                <div className="flex items-center gap-2 text-rose-200">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">Swipe to view more</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <div
                className="flex gap-6 px-4 sm:px-6 lg:px-8 pb-4"
                style={{ width: "max-content" }}
              >
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    variants={scaleInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-80 h-64 relative rounded-xl overflow-hidden shadow-xl bg-gray-900/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 group"
                  >
                    <img
                      src={image.value || "/placeholder-image.jpg"}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold text-lg">Image {index + 1}</p>
                        <p className="text-sm text-rose-200">
                          Click to view larger
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/20 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                      {index + 1}/{images.length}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Final Text Section */}
        <motion.section
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="bg-gradient-to-br from-rose-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-rose-300 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Thank You for Exploring
              </h3>
              <p className="text-white/90 leading-relaxed text-lg md:text-xl">
                {lastText}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/20 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Contact Information
                </h4>
                <p className="text-rose-200">
                  Email: contact@example.com
                  <br />
                  Phone: (555) 123-4567
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Privacy Policy
                </h4>
                <p className="text-rose-200 text-sm leading-relaxed">
                  We respect your privacy and are committed to protecting your
                  personal data. This privacy policy will inform you about how we
                  look after your personal data.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-rose-300">
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

          /* Custom scrollbar for better UX */
          .scrollbar-thin::-webkit-scrollbar {
            height: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(244, 63, 94, 0.5);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(244, 63, 94, 0.7);
          }
        `}</style>
      </div>
    </>
  );
}
