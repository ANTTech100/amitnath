"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Play, ExternalLink } from "lucide-react";

export default function ViewAccordionContent() {
  const params = useParams();
  const contentId = params.id;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedGuides, setExpandedGuides] = useState(new Set());

  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/acordial/view?id=${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch content");
      }

      setContent(data.data);
      // Expand first guide by default
      if (data.data.guides && data.data.guides.length > 0) {
        setExpandedGuides(new Set([0]));
      }
    } catch (err) {
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const toggleGuide = (guideIndex) => {
    const newExpanded = new Set(expandedGuides);
    if (newExpanded.has(guideIndex)) {
      newExpanded.delete(guideIndex);
    } else {
      newExpanded.add(guideIndex);
    }
    setExpandedGuides(newExpanded);
  };

  // Convert YouTube URL to embed format
  const convertToEmbedUrl = (url) => {
    if (!url) return url;
    
    // Check if it's already an embed URL
    if (url.includes('embed')) {
      return url;
    }
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url;
  };

  const renderItem = (item, itemIndex) => {
    switch (item.type) {
      case "text":
        return (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: itemIndex * 0.1 }}
            className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg font-medium">
              {item.content}
            </div>
          </motion.div>
        );

      case "image":
        return (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: itemIndex * 0.1 }}
            className="flex justify-center my-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <img
                src={item.content}
                alt={`Guide item ${itemIndex + 1}`}
                className="max-w-full h-auto rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </motion.div>
        );

      case "video":
        return (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: itemIndex * 0.1 }}
            className="flex justify-center my-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 w-full max-w-4xl">
              <iframe
                src={convertToEmbedUrl(item.content)}
                className="w-full h-64 md:h-96 rounded-lg"
                allowFullScreen
                title={`Video ${itemIndex + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </motion.div>
        );

      case "button":
        return (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: itemIndex * 0.1 }}
            className="flex justify-center my-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-purple-200">
              <a
                href={item.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                <span className="text-lg">{item.buttonText}</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-50 border border-gray-200 text-gray-800 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Content Not Found</h2>
            <p>The requested content could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: content.backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Accordion Guides */}
        <div className="space-y-4">
          {content.guides.map((guide, guideIndex) => {
            const isExpanded = expandedGuides.has(guideIndex);
            
            return (
              <motion.div
                key={guideIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: guideIndex * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Guide Header */}
                <button
                  onClick={() => toggleGuide(guideIndex)}
                  className="w-full px-8 py-6 text-left bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white bg-opacity-20 rounded-full p-2">
                        <span className="text-black font-bold text-lg">{guideIndex + 1}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-black">
                        {guide.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white bg-opacity-20 rounded-full p-2"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-black" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-black" />
                      )}
                    </motion.div>
                  </div>
                </button>

                {/* Guide Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 py-8 space-y-8 bg-gradient-to-br from-gray-50 to-white">
                        {guide.items.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            {renderItem(item, itemIndex)}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
