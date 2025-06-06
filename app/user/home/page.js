"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Image,
  Video,
  ExternalLink,
  Search,
  User,
  Sparkles,
  ArrowRight,
  Plus,
  Grid3X3,
  Zap,
  Palette,
  Globe,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../Header";

export default function UserDashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/admin/templatecreate");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data); // Debug log

          // Handle different response structures
          let templatesArray = [];
          if (Array.isArray(data)) {
            templatesArray = data;
          } else if (data.templates && Array.isArray(data.templates)) {
            templatesArray = data.templates;
          } else if (data.data && Array.isArray(data.data)) {
            templatesArray = data.data;
          } else {
            console.log("Unexpected data structure:", data);
            templatesArray = [];
          }

          // Limit to 3-4 templates and add modern styling properties
          const limitedTemplates = templatesArray
            .slice(0, 6)
            .map((template, index) => ({
              id: template._id || template.id || `template-${index}`,
              name: template.name || template.heading || "Template",
              description:
                template.description ||
                template.subheading ||
                "Professional template for your content creation needs",
              type: template.type || "basic",
              status: template.status || "published",
              usageCount: template.usageCount || 0,
              color: getGradientColor(index),
              bgColor: getBgColor(index),
              iconColor: getIconColor(index),
              icon: getTemplateIcon(template.name || template.heading),
            }));

          setTemplates(limitedTemplates);
        } else {
          console.error("API response not ok:", response.status);
          setTemplates(getFallbackTemplates());
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Fallback templates if API fails
        setTemplates(getFallbackTemplates());
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Helper functions for styling
  const getGradientColor = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-pink-500 to-rose-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-cyan-500 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  const getBgColor = (index) => {
    const bgColors = [
      "bg-blue-500/10",
      "bg-pink-500/10",
      "bg-green-500/10",
      "bg-orange-500/10",
      "bg-cyan-500/10",
    ];
    return bgColors[index % bgColors.length];
  };

  const getIconColor = (index) => {
    const iconColors = [
      "text-blue-400",
      "text-pink-400",
      "text-green-400",
      "text-orange-400",
      "text-cyan-400",
    ];
    return iconColors[index % iconColors.length];
  };

  const getTemplateIcon = (name) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("blog") || lowerName.includes("post"))
      return FileText;
    if (
      lowerName.includes("image") ||
      lowerName.includes("photo") ||
      lowerName.includes("gallery")
    )
      return Image;
    if (lowerName.includes("video")) return Video;
    if (lowerName.includes("portfolio")) return Palette;
    if (
      lowerName.includes("web") ||
      lowerName.includes("site") ||
      lowerName.includes("landing")
    )
      return Globe;
    if (lowerName.includes("magnet") || lowerName.includes("lead")) return Star;
    if (lowerName.includes("page")) return FileText;
    return Sparkles; // Default icon
  };

  const getFallbackTemplates = () => [
    {
      name: "Blog Post",
      description: "Create engaging text-based blog posts with rich formatting",
      id: "blog-post",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      icon: FileText,
    },
    {
      name: "Photo Gallery",
      description: "Showcase multiple images in beautiful gallery layouts",
      id: "gallery",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-400",
      icon: Image,
    },
    {
      name: "Video Content",
      description: "Upload and manage video content with metadata",
      id: "video",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
      icon: Video,
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navbar */}
      <UserNavbar />

      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <Sparkles className="relative h-12 w-12 text-purple-300" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-blue-200 sm:text-6xl mb-4">
              Welcome to SSWORK
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-purple-200/90 leading-relaxed">
              Transform your ideas into stunning content with our professionally
              designed templates
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/user/tem"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <Grid3X3 className="mr-3 h-5 w-5" />
                Browse All Templates
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <Star className="mr-3 h-5 w-5" />
                Featured Content
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { label: "Templates", value: "50+", icon: Palette },
                { label: "Active Users", value: "10K+", icon: User },
                { label: "Projects Created", value: "25K+", icon: TrendingUp },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-6 w-6 text-purple-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-purple-200/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Templates Section */}
      <div className="relative max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-12">
            <motion.h2
              variants={cardVariants}
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200 mb-4"
            >
              Featured Templates
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-lg text-purple-200/80 max-w-2xl mx-auto"
            >
              Choose from our curated selection of professional templates to get
              started quickly
            </motion.p>
          </div>

          {/* Enhanced Search */}
          <motion.div
            variants={cardVariants}
            className="mb-12 max-w-md mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                <Search className="h-5 w-5 text-purple-300 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 bg-transparent text-white placeholder-purple-200/50 focus:outline-none"
                  placeholder="Search templates..."
                />
              </div>
            </div>
          </motion.div>

          {/* Template Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white/10 rounded-3xl h-48"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <motion.div
                    key={template.id || template._id || index}
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      z: 50,
                    }}
                    className="group cursor-pointer perspective-1000"
                    onClick={() => (window.location.href = "/user/tem")}
                  >
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform-gpu">
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>

                      {/* Content */}
                      <div className="relative p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`${template.bgColor} backdrop-blur-sm rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent
                              className={`h-8 w-8 ${template.iconColor}`}
                            />
                          </div>
                          <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                          {template.name}
                        </h3>

                        <p className="text-purple-200/70 text-sm leading-relaxed line-clamp-3">
                          {template.description}
                        </p>

                        {/* Template metadata */}
                        <div className="mt-4 flex items-center justify-between text-xs text-purple-300/60">
                          <span className="capitalize">
                            {template.type} template
                          </span>
                          {template.usageCount > 0 && (
                            <span>{template.usageCount} uses</span>
                          )}
                        </div>

                        {/* Hover effect indicators */}
                        <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs text-purple-300 font-medium">
                            Click to explore
                          </span>
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Enhanced My Content Section */}
      <div className="relative max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={cardVariants}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200 mb-8 text-center"
          >
            My Content
          </motion.h2>

          {/* Enhanced Empty State */}
          <motion.div variants={cardVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative text-center py-16 px-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-xl">
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <Plus className="relative h-16 w-16 text-purple-300 mx-auto" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No content yet
              </h3>
              <p className="text-lg text-purple-200/70 mb-8 max-w-md mx-auto">
                Ready to create something amazing? Choose a template and bring
                your ideas to life.
              </p>
              <Link
                href="/user/tem"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <Zap className="mr-3 h-5 w-5" />
                Start Creating
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Template Modal (unchanged functionality) */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {selectedTemplate === "blog-post" && "Create Blog Post"}
                  {selectedTemplate === "gallery" && "Create Photo Gallery"}
                  {selectedTemplate === "video" && "Upload Video Content"}
                </h3>

                {/* Forms remain the same for functionality */}
                {selectedTemplate === "blog-post" && (
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white placeholder-purple-200/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your blog title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        Content
                      </label>
                      <textarea
                        rows="6"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white placeholder-purple-200/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Write your blog content..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        Featured Image
                      </label>
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-white/5 hover:bg-white/10 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-purple-300 mb-4" />
                        <div className="text-sm text-purple-200">
                          <label className="cursor-pointer font-medium text-purple-300 hover:text-purple-200">
                            Upload a file
                            <input type="file" className="sr-only" />
                          </label>
                          <span className="ml-1">or drag and drop</span>
                        </div>
                        <p className="text-xs text-purple-300/70 mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        className="px-6 py-3 text-sm font-semibold text-purple-200 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
