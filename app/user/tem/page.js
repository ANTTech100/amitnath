"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../Header";

export default function TemplatesGallery() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/templatecreate");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTemplates(nextPage);
  };

  const handleTemplateSelect = (templateId) => {
    router.push(`/user/tem/${templateId}`);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 text-gray-900 relative overflow-hidden pt-20">
      <Head>
        <title>Templates Gallery - Create Amazing Content</title>
      </Head>

      {/* Navbar with higher z-index */}
      <div className="relative z-50">
        <UserNavbar />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Templates Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover premium templates crafted to bring your ideas to life with
            stunning design and functionality
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg mb-8 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <span>Error: {error}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {templates.map((template, index) => (
              <TemplateCard
                key={template._id}
                template={template}
                index={index}
                onSelect={() => handleTemplateSelect(template._id)}
                variants={cardVariants}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center my-16"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-r-4 border-l-4 border-blue-600 animate-reverse"></div>
            </div>
          </motion.div>
        )}

        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-16"
          >
            <button
              onClick={loadMore}
              className="group relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
            >
              <span className="relative z-10">Load More Templates</span>
            </button>
          </motion.div>
        )}
      </main>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function TemplateCard({ template, index, onSelect, variants }) {
  const typeIcons = {
    basic: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    article: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    gallery: (
      <svg
        className="w-8 h-8"
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
    ),
    portfolio: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
    report: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  };

  const typeColors = {
    basic: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      icon: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      border: "border-blue-200",
      hover: "hover:border-blue-300",
      accent: "bg-blue-500",
    },
    article: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      icon: "text-green-600",
      gradient: "from-green-500 to-green-600",
      border: "border-green-200",
      hover: "hover:border-green-300",
      accent: "bg-green-500",
    },
    gallery: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      icon: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      border: "border-purple-200",
      hover: "hover:border-purple-300",
      accent: "bg-purple-500",
    },
    portfolio: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      icon: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      border: "border-orange-200",
      hover: "hover:border-orange-300",
      accent: "bg-orange-500",
    },
    report: {
      bg: "bg-gradient-to-br from-pink-50 to-pink-100",
      icon: "text-pink-600",
      gradient: "from-pink-500 to-pink-600",
      border: "border-pink-200",
      hover: "hover:border-pink-300",
      accent: "bg-pink-500",
    },
  };

  const colors = typeColors[template.type] || typeColors.basic;

  return (
    <motion.div
      variants={variants}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3 },
      }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className={`relative bg-white rounded-xl border-2 ${colors.border} ${colors.hover} overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu group`}>
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`${colors.bg} rounded-xl p-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
            >
              <div className={colors.icon}>
                {typeIcons[template.type] || typeIcons.basic}
              </div>
            </div>

            {/* Arrow icon */}
            <div className={`${colors.accent} rounded-full p-2 group-hover:scale-110 transition-all duration-300`}>
              <svg
                className="h-4 w-4 text-white group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-3 group-hover:text-gray-600 transition-all duration-300 leading-tight">
            {template.name}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {template.description ||
              "A carefully crafted template designed to help you create professional content with ease."}
          </p>

          {/* Template metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span className={`capitalize ${colors.bg} ${colors.icon} px-3 py-1 rounded-full font-medium`}>
              {template.type} template
            </span>
            <span className="text-gray-400">
              {new Date(template.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Hover effect indicators */}
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className={`text-xs ${colors.icon} font-medium`}>
              Click to explore
            </span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 ${colors.accent} rounded-full animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        </div>
      </div>
    </motion.div>
  );
}
