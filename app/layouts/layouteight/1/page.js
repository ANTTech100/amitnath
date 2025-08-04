// app/layouts/testimonial-video/[id]/page.js
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

export default function TestimonialVideoLayout() {
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

  // Function to render video based on URL
  const renderVideo = (url) => {
    console.log("Video URL:", url);
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("/")[0];
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
              className="inline-block mt-3 text-teal-400 hover:text-teal-300 underline"
            >
              Open in new tab
            </a>
          </div>
        );
      }

      return (
        <div className="relative group w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/20 transition-transform duration-300 group-hover:scale-102"
          />
        </div>
      );
    } else {
      return (
        <div className="relative group w-full h-full">
          <video
            controls
            className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/20"
            poster="/video-thumbnail.jpg"
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-teal-100 animate-pulse">
            Loading content...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-500/50"
        >
          <div className="flex items-center gap-3 text-red-500 mb-4">
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

  // Process sections into videos and texts
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const videos = sections.filter((section) => section.type === "video");
  const texts = sections.filter((section) => section.type === "text");

  // First video and its corresponding text
  const firstVideo = videos[0]?.value || "";
  const firstText = texts[0]?.value || "No description available";

  // Remaining videos and texts for rows (2 videos per row)
  const remainingVideos = videos.slice(1);
  const remainingTexts = texts.slice(1);

  // Group remaining videos and texts into rows of 2
  const rows = [];
  for (let i = 0; i < remainingVideos.length; i += 2) {
    const videoPair = remainingVideos.slice(i, i + 2);
    const textPair = remainingTexts.slice(i, i + 2);
    rows.push({ videos: videoPair, texts: textPair });
  }

  // Gradient colors for text cards
  const gradientColors = [
    "bg-gradient-to-br from-teal-500 to-teal-800",
    "bg-gradient-to-br from-indigo-500 to-indigo-800",
    "bg-gradient-to-br from-purple-500 to-purple-800",
    "bg-gradient-to-br from-blue-500 to-blue-800",
  ];

  return (
    <>
      {templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-800">
        <Head>
          <title>{content?.heading || "Video Testimonials"}</title>
          <meta
            name="description"
            content={content?.subheading || "Hear from our amazing students"}
          />
        </Head>

        {/* Header Section: Heading and Subheading */}
        <motion.header
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="py-16 text-center"
        >
          <motion.h1
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-100 mb-6 leading-tight"
          >
            {content?.heading || "Video Testimonials"}
          </motion.h1>
          <motion.p
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {content?.subheading || "Hear from our amazing students"}
          </motion.p>
        </motion.header>

        {/* First Video and Text Section */}
        {firstVideo && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-12 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-5xl mx-auto">
              {/* First Video */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900"
              >
                <div className="aspect-video">{renderVideo(firstVideo)}</div>
              </motion.div>
              {/* First Text in a Card */}
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`mt-8 ${gradientColors[0]} rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105`}
              >
                <p className="text-white leading-relaxed text-lg">{firstText}</p>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Rows of Videos and Texts (2 videos per row) */}
        {rows.length > 0 && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-12 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-5xl mx-auto space-y-16">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="space-y-8">
                  {/* Videos Row: Two Videos Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {row.videos.map((video, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900"
                      >
                        <div className="aspect-video">
                          {renderVideo(video.value)}
                        </div>
                      </motion.div>
                    ))}
                    {row.videos.length === 1 && (
                      <div className="hidden lg:block"></div>
                    )}
                  </div>

                  {/* Texts Row: Two Text Cards Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {row.videos.map((_, index) => {
                      const text = row.texts[index];
                      return (
                        <motion.div
                          key={index}
                          variants={fadeInVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className={`${
                            gradientColors[
                              (index + rowIndex * 2 + 1) % gradientColors.length
                            ]
                          } rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105`}
                        >
                          <p className="text-white leading-relaxed text-lg">
                            {text?.value || "No description available"}
                          </p>
                        </motion.div>
                      );
                    })}
                    {row.videos.length === 1 && row.texts.length === 1 && (
                      <div className="hidden lg:block"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
}
