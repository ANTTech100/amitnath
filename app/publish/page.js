"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../user/Header";

export default function ContentViewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/upload");
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch content");
      }

      // Normalize sections to array-based structure
      const processedContents = data.content.map((content) => {
        let normalizedSections = {
          texts: [],
          images: [],
          videos: [],
          links: [],
        };

        // Check if sections is Map-based (from /api/upload)
        if (
          content.sections &&
          !content.sections.texts &&
          !content.sections.images &&
          !content.sections.videos &&
          !content.sections.links
        ) {
          Object.entries(content.sections).forEach(([sectionId, section]) => {
            const sectionData = {
              sectionId,
              [section.type === "text" ? "content" : "url"]: section.value,
            };
            normalizedSections[section.type + "s"].push(sectionData);
          });
        } else {
          // Already in array-based format
          normalizedSections = {
            texts: content.sections.texts || [],
            images: content.sections.images || [],
            videos: content.sections.videos || [],
            links: content.sections.links || [],
          };
        }

        return {
          ...content,
          status: content.status || "draft", // Fallback for status
          sections: normalizedSections,
        };
      });

      setContents(processedContents);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-purple-300 animate-pulse">
            Loading your content...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-500/50"
        >
          <div className="flex items-center gap-3 text-red-400">
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
            onClick={fetchContent}
            className="mt-6 w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-500/50 text-center"
        >
          <div className="flex items-center gap-3 text-yellow-400">
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
            <p className="text-lg font-semibold">No content found</p>
          </div>
          <Link
            href="/content"
            className="mt-6 inline-block bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors duration-300"
          >
            Return to Content List
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Content List
            </Link>
          </motion.div>

          <AnimatePresence>
            {contents.map((content, idx) => (
              <motion.div
                key={content._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gray-800 rounded-2xl shadow-2xl mb-8 border border-purple-500/30 overflow-hidden hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-purple-100">
                      Content {idx + 1}
                    </h1>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        content.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : content.status === "draft"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {content.status.charAt(0).toUpperCase() +
                        content.status.slice(1)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-400 mb-6">
                    Created: {new Date(content.createdAt).toLocaleString()}
                    {content.updatedAt !== content.createdAt && (
                      <span>
                        {" "}
                        | Updated:{" "}
                        {new Date(content.updatedAt).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Text Sections */}
                  {content.sections.texts?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-purple-200 mb-4">
                        Text Content
                      </h2>
                      <div className="space-y-4">
                        {content.sections.texts.map((text, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
                          >
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {text.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Sections */}
                  {content.sections.images?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-purple-200 mb-4">
                        Images
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.sections.images.map((image, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-900/50 rounded-xl overflow-hidden border border-purple-500/20"
                          >
                            <img
                              src={image.url}
                              alt="Uploaded content"
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                            <div className="p-4">
                              <a
                                href={image.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 text-sm truncate block hover:text-purple-300 transition-colors"
                              >
                                {image.url}
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Sections */}
                  {content.sections.videos?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-purple-200 mb-4">
                        Videos
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {content.sections.videos.map((video, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-900/50 rounded-xl overflow-hidden border border-purple-500/20"
                          >
                            {video.url.includes("youtube.com") ||
                            video.url.includes("youtu.be") ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${
                                  video.url.includes("youtu.be")
                                    ? video.url.split("/").pop().split("?")[0]
                                    : new URL(video.url).searchParams.get("v")
                                }`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-48"
                              ></iframe>
                            ) : video.url.includes("vimeo.com") ? (
                              <iframe
                                src={`https://player.vimeo.com/video/${video.url
                                  .split("/")
                                  .pop()}`}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                className="w-full h-48"
                              ></iframe>
                            ) : (
                              <div className="flex items-center justify-center h-48 bg-gray-900">
                                <p className="text-gray-400">
                                  Video preview not available
                                </p>
                              </div>
                            )}
                            <div className="p-4">
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 text-sm truncate block hover:text-purple-300 transition-colors"
                              >
                                {video.url}
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link Sections */}
                  {content.sections.links?.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-purple-200 mb-4">
                        Links
                      </h2>
                      <div className="space-y-4">
                        {content.sections.links.map((link, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 break-words font-medium transition-colors"
                            >
                              {link.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
