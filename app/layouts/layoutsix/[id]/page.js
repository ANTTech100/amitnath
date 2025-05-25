// app/layouts/layoutsix/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";

// Enhanced animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
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

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LayoutSix() {
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

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-transparent border-purple-300 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 text-xl font-medium bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
          >
            Loading your content...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-red-500/30 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-red-400 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
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
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Oops! Something went wrong
                </h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-red-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Process sections (same logic)
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const images = sections.filter((section) => section.type === "image");
  const texts = sections.filter((section) => section.type === "text");

  const backgroundImage = images[0]?.value || "";
  const remainingImages = images.slice(1);

  const rows = [];
  for (let i = 0; i < remainingImages.length; i += 2) {
    const imagePair = remainingImages.slice(i, i + 2);
    const textPair = texts.slice(i, i + 2);
    rows.push({ images: imagePair, texts: textPair });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>{content.heading} | Lead Magnet</title>
        <meta name="description" content={content.subheading} />
      </Head>

      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Background Image with Parallax Effect */}
        <div
          className="relative h-screen bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundAttachment: "fixed",
          }}
        >
          {/* Multi-layered Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30"></div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  left: `${10 + i * 15}%`,
                  top: "90%",
                }}
              />
            ))}
          </div>

          {/* Header Content */}
          <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                    {content.heading}
                  </span>
                </h1>
              </motion.div>

              <motion.div
                variants={slideInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                <h2 className="relative text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-200 leading-relaxed max-w-4xl mx-auto">
                  {content.subheading}
                </h2>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex flex-col items-center text-white/60">
                  <span className="text-sm mb-2 font-medium">
                    Scroll to explore
                  </span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
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
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: rowIndex * 0.2 }}
              className="mb-24 last:mb-0"
            >
              {/* Enhanced Images Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {row.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    {/* Glow effect container */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                    {/* Image container */}
                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                      <img
                        src={image.value}
                        alt={`Section Image ${index + 1}`}
                        className="w-full h-80 object-cover transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Hover indicator */}
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {row.images.length === 1 && (
                  <div className="hidden lg:block"></div>
                )}
              </div>

              {/* Enhanced Texts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {row.images.map((_, index) => {
                  const text = row.texts[index];
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="group relative"
                    >
                      {/* Card glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>

                      {/* Card content */}
                      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                        {/* Decorative element */}
                        <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>

                        {text ? (
                          <p className="text-slate-300 leading-relaxed text-lg font-light pt-4">
                            {text.value}
                          </p>
                        ) : (
                          <p className="text-slate-500 italic leading-relaxed text-lg font-light pt-4">
                            No description available
                          </p>
                        )}

                        {/* Bottom accent */}
                        <div className="absolute bottom-0 right-6 w-8 h-1 bg-gradient-to-l from-purple-500 to-blue-500 rounded-full opacity-60"></div>
                      </div>
                    </motion.div>
                  );
                })}

                {row.images.length === 1 && row.texts.length === 1 && (
                  <div className="hidden lg:block"></div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>
    </div>
  );
}
