"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../../Header";
import React from "react";
import InfoTooltip from "../../../components/InfoTooltip";

export default function ContentUploadPage({ params }) {
  const router = useRouter();
  const { templateId } = React.use(params); // Unwrap params with React.use()

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    backgroundColor: "#ffffff",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [filePreviews, setFilePreviews] = useState({});
  const [inputTypes, setInputTypes] = useState({});
  const [userId, setUserId] = useState(null);
  const [videoUrlErrors, setVideoUrlErrors] = useState({});
  const [visibleSectionCount, setVisibleSectionCount] = useState(5);

  const fallbackImage =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  // Function to get section icon with text label based on type
  const getSectionIcon = (type) => {
    const iconClass = "w-5 h-5 mr-2";
    let icon;
    let label;

    switch (type) {
      case "text":
        icon = (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        );
        label = "Text Section";
        break;
      case "image":
        icon = (
          <svg
            className={iconClass}
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
        );
        label = "Image Section";
        break;
      case "video":
        icon = (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
        label = "Video Section";
        break;
      case "audio":
        icon = (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5 15h4l5 5V4l-5 5H5v6z"
            />
          </svg>
        );
        label = "Audio Section";
        break;
      case "link":
        icon = (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        );
        label = "Link Section";
        break;
      default:
        icon = (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
        label = "Default Section";
        break;
    }

    return (
      <div className="flex items-center">
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      router.push("/user/register");
      return;
    }

    if (templateId) {
      fetchTemplateDetails();
    }

    return () => {
      Object.values(filePreviews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [templateId, router, filePreviews]);

  const fetchTemplateDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/templatecreate/${templateId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch template");
      }
      setTemplate(data.data);

      const initialFormData = {
        heading: "",
        subheading: "",
        backgroundColor: "#ffffff",
      };
      const initialInputTypes = {};
      if (data.data.sections) {
        data.data.sections.forEach((section) => {
          initialFormData[section.id] = "";
          initialInputTypes[section.id] = "url";
        });
      }
      setFormData(initialFormData);
      setInputTypes(initialInputTypes);
    } catch (err) {
      console.error("Error fetching template:", err);
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const validateField = useCallback(
    (key, value, file) => {
      if (key === "heading" || key === "subheading") {
        if (!value) {
          return `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
        if (value.length < 3) {
          return `${
            key.charAt(0).toUpperCase() + key.slice(1)
          } must be at least 3 characters`;
        }
        if (value.length > 100) {
          return `${
            key.charAt(0).toUpperCase() + key.slice(1)
          } must be at most 100 characters`;
        }
        return null;
      }
      if (key === "backgroundColor") {
        if (!value) {
          return "Background color is required";
        }
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
          return "Invalid color format. Use a valid hex color code (e.g., #ffffff)";
        }
        return null;
      }

      const section = template?.sections?.find((s) => s.id === key);
      if (!section) return null;

      const { config } = section;
      if (section.required && !value && !file) {
        return `${section.title} is required`;
      }
      if (section.type === "text" && config && value) {
        if (config.minLength && value.length < config.minLength) {
          return `${section.title} must be at least ${config.minLength} characters`;
        }
        if (config.maxLength && value.length > config.maxLength) {
          return `${section.title} must be at most ${config.maxLength} characters`;
        }
      }
      if (section.type === "image" && config && (value || file)) {
        if (value) {
          if (config.validateUrl) {
            try {
              new URL(value);
            } catch {
              return "Invalid URL format";
            }
          }
        }
        if (
          file &&
          config.maxSize &&
          file.size > config.maxSize * 1024 * 1024
        ) {
          return `File size exceeds ${config.maxSize}MB`;
        }
        if (file && config.allowedTypes?.length) {
          const fileType = file.type.toLowerCase();
          if (!config.allowedTypes.includes(fileType)) {
            return `Only ${config.allowedTypes.join(", ")} formats are allowed`;
          }
        }
      }
      if (section.type === "video" && config && (value || file)) {
        if (value) {
          if (config.validateUrl) {
            try {
              new URL(value);
            } catch {
              return "Invalid URL format";
            }
          }
        }
        if (
          file &&
          config.maxSize &&
          file.size > config.maxSize * 1024 * 1024
        ) {
          return `File size exceeds ${config.maxSize}MB`;
        }
        if (file && config.allowedTypes?.length) {
          const fileType = file.type.toLowerCase();
          if (!config.allowedTypes.includes(fileType)) {
            return `Only ${config.allowedTypes.join(", ")} formats are allowed`;
          }
        }
      }
      if (section.type === "link" && config && value) {
        if (
          config.allowedDomains?.length &&
          !config.allowedDomains.some((domain) => value.includes(domain))
        ) {
          return `Only links from ${config.allowedDomains.join(
            ", "
          )} are allowed`;
        }
        if (config.validateUrl) {
          try {
            new URL(value);
          } catch {
            return "Invalid URL format";
          }
        }
      }
      return null;
    },
    [template]
  );

  const validateVideoUrl = useCallback((sectionId, url) => {
    if (!url) return null;

    let isValidUrl = false;
    let isYouTubeUrl = false;
    let youtubeEmbedUrl = null;

    try {
      const parsedUrl = new URL(url);
      if (
        parsedUrl.hostname.includes("youtube.com") ||
        parsedUrl.hostname.includes("youtu.be")
      ) {
        isYouTubeUrl = true;
        let videoId = null;
        if (parsedUrl.hostname.includes("youtube.com")) {
          const params = new URLSearchParams(parsedUrl.search);
          videoId = params.get("v");
        } else if (parsedUrl.hostname.includes("youtu.be")) {
          videoId = parsedUrl.pathname.split("/")[1];
        }
        if (videoId) {
          youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      } else {
        const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
        isValidUrl = videoExtensions.some((ext) =>
          parsedUrl.pathname.toLowerCase().endsWith(ext)
        );
      }
    } catch {
      return "Invalid video URL. Please provide a valid video URL (e.g., YouTube or ending with .mp4, .mov, etc.).";
    }

    if (!isValidUrl && !isYouTubeUrl) {
      return "Invalid video URL. Please provide a valid video URL (e.g., YouTube or ending with .mp4, .mov, etc.).";
    }

    return { isValidUrl, isYouTubeUrl, youtubeEmbedUrl };
  }, []);

  const handleInputChange = useCallback(
    (e, key, isFile = false) => {
      const value = isFile ? e.target.files[0] : e.target.value;

      if (isFile) {
        setFormData((prev) => ({ ...prev, [key]: value }));
        const error = validateField(key, "", value);
        setErrors((prev) => ({ ...prev, [key]: error }));
        setVideoUrlErrors((prev) => ({ ...prev, [key]: null }));

        if (value) {
          const url = URL.createObjectURL(value);
          setFilePreviews((prev) => ({ ...prev, [key]: url }));
        } else {
          setFilePreviews((prev) => {
            const prevUrl = prev[key];
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return { ...prev, [key]: null };
          });
        }
      } else {
        setFormData((prev) => ({ ...prev, [key]: value }));
        const error = validateField(key, value, null);
        setErrors((prev) => ({ ...prev, [key]: error }));

        if (template?.sections?.find((s) => s.id === key)?.type === "video") {
          const videoError = validateVideoUrl(key, value);
          if (typeof videoError === "string") {
            setVideoUrlErrors((prev) => ({ ...prev, [key]: videoError }));
          } else {
            setVideoUrlErrors((prev) => ({ ...prev, [key]: null }));
          }
        } else {
          setVideoUrlErrors((prev) => ({ ...prev, [key]: null }));
        }
      }
    },
    [template, validateField, validateVideoUrl]
  );

  const handleInputTypeChange = useCallback((sectionId, type) => {
    setInputTypes((prev) => ({ ...prev, [sectionId]: type }));
    setFormData((prev) => ({ ...prev, [sectionId]: "" }));
    setFilePreviews((prev) => {
      const prevUrl = prev[sectionId];
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return { ...prev, [sectionId]: null };
    });
    setErrors((prev) => ({ ...prev, [sectionId]: null }));
    setVideoUrlErrors((prev) => ({ ...prev, [sectionId]: null }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(null);
    setVideoUrlErrors({});

    if (!userId) {
      setErrors({ global: "User not authenticated. Please log in again." });
      setSubmitting(false);
      return;
    }

    const newErrors = {};
    const newVideoUrlErrors = {};

    ["heading", "subheading", "backgroundColor"].forEach((key) => {
      const error = validateField(key, formData[key], null);
      if (error) newErrors[key] = error;
    });

    template?.sections?.forEach((section) => {
      const value = formData[section.id];
      const error = validateField(
        section.id,
        typeof value === "string" ? value : "",
        typeof value !== "string" ? value : null
      );
      if (error) newErrors[section.id] = error;

      if (section.type === "video" && typeof value === "string" && value) {
        const videoError = validateVideoUrl(section.id, value);
        if (typeof videoError === "string") {
          newVideoUrlErrors[section.id] = videoError;
        }
      }
    });

    if (
      Object.keys(newErrors).length > 0 ||
      Object.keys(newVideoUrlErrors).length > 0
    ) {
      setErrors(newErrors);
      setVideoUrlErrors(newVideoUrlErrors);
      setSubmitting(false);
      return;
    }

    try {
      const submissionData = new FormData();
      submissionData.append("templateId", templateId);
      submissionData.append("heading", formData.heading);
      submissionData.append("subheading", formData.subheading);
      submissionData.append("backgroundColor", formData.backgroundColor);
      submissionData.append("userId", userId);

      template?.sections?.forEach((section) => {
        const value = formData[section.id];
        if (value instanceof File) {
          submissionData.append(section.id, value);
        } else {
          submissionData.append(section.id, value || "");
        }
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setSuccess("Content created successfully!");
      setTimeout(() => router.push(`/publish`), 1500);
    } catch (err) {
      console.error("Error submitting content:", err);
      setErrors({
        global: err.message || "Failed to create content. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Get sections to display based on showAllSections state
  const sectionsToShow = template?.sections?.sort((a, b) => a.order - b.order) || [];
  const visibleSections = sectionsToShow.slice(0, visibleSectionCount);
  const hiddenSectionsCount = Math.max(0, sectionsToShow.length - visibleSectionCount);

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
            Loading template...
          </p>
        </motion.div>
      </div>
    );
  }

  if (errors.global && !template) {
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
            <p className="text-lg font-semibold">Error: {errors.global}</p>
          </div>
          <button
            onClick={fetchTemplateDetails}
            className="mt-6 w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600 opacity-30 rounded-full filter blur-3xl animate-pulse z-0" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600 opacity-20 rounded-full filter blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 opacity-10 rounded-full filter blur-2xl animate-pulse z-0" />
        <div className="max-w-5xl mx-auto w-full z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/user/tem"
              className="inline-flex items-center text-blue-300 hover:text-blue-200 font-semibold transition-colors duration-200"
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
              Back to Templates
            </Link>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent mt-2 drop-shadow-lg">
              {template?.name || "Create Content"}
            </h1>
            <p className="text-blue-200/80 mt-2 text-lg font-medium">
              {template?.description}
            </p>
          </motion.div>
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-xl mb-6 shadow-lg backdrop-blur-md"
              >
                {success}
              </motion.div>
            )}
            {errors.global && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 shadow-lg backdrop-blur-md"
              >
                Error: {errors.global}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-red-400 text-lg font-bold">*</span>
              <span className="text-blue-200 text-sm">Fields marked with * are required.</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 mb-8"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow">
                Content Details
              </h3>
              <div className="space-y-4">
                {/* Heading input */}
                <div>
                  <label className="block text-blue-100 mb-2 font-semibold" htmlFor="heading">
                    Heading <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="heading"
                    type="text"
                    className="w-full p-3 bg-white/20 border border-blue-400/30 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-inner placeholder-blue-300"
                    value={formData.heading}
                    onChange={(e) => handleInputChange(e, "heading")}
                    placeholder="Enter the heading for this content"
                    required
                  />
                  {errors.heading && (
                    <p className="mt-2 text-sm text-red-400">{errors.heading}</p>
                  )}
                </div>
                {/* Subheading input */}
                <div>
                  <label className="block text-blue-100 mb-2 font-semibold" htmlFor="subheading">
                    Subheading <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="subheading"
                    type="text"
                    className="w-full p-3 bg-white/20 border border-blue-400/30 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-inner placeholder-blue-300"
                    value={formData.subheading}
                    onChange={(e) => handleInputChange(e, "subheading")}
                    placeholder="Enter the subheading for this content"
                    required
                  />
                  {errors.subheading && (
                    <p className="mt-2 text-sm text-red-400">{errors.subheading}</p>
                  )}
                </div>
                {/* Background color input */}
                <div>
                  <label className="block text-blue-100 mb-2 font-semibold" htmlFor="backgroundColor">
                    Background Color <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="backgroundColor"
                      type="text"
                      className="w-full p-3 bg-white/20 border border-blue-400/30 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-inner placeholder-blue-300"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange(e, "backgroundColor")}
                      placeholder="Enter hex color code (e.g., #ffffff)"
                      required
                    />
                    <input
                      type="color"
                      className="w-12 h-12 border-2 border-blue-400/30 rounded-2xl cursor-pointer shadow"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange(e, "backgroundColor")}
                    />
                  </div>
                  {errors.backgroundColor && (
                    <p className="mt-2 text-sm text-red-400">{errors.backgroundColor}</p>
                  )}
                </div>
              </div>
            </motion.div>
            {/* Section cards: update each to use glassy blue theme, gradient headers, and modern input styles */}
            {visibleSections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: section.order * 0.1 }}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 mb-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getSectionIcon(section.type)}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent ml-2 drop-shadow">
                      {section.title}
                    </h3>
                  </div>
                  {section.required && (
                    <span className="text-red-400 text-sm">*</span>
                  )}
                </div>
                <p className="text-blue-200/80 mb-4 text-base font-medium flex items-center">
                  {section.description}
                  <InfoTooltip text={section.config?.helpText || `Fill out this section as required.`} />
                </p>
                {/* Text Section */}
                {section.type === "text" && (
                  <div>
                    <div className="flex items-center mb-1">
                      <label className="block text-blue-100 mr-2 font-semibold" htmlFor={section.id}>
                        {section.title}
                        {section.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <InfoTooltip text={section.config?.helpText || `Enter detailed text for this section. Example: \"Describe your experience...\"`} />
                    </div>
                    <textarea
                      id={section.id}
                      className="w-full p-3 bg-white/20 border border-blue-400/30 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-inner placeholder-blue-300 resize-y"
                      rows="5"
                      value={formData[section.id] || ""}
                      onChange={(e) => handleInputChange(e, section.id)}
                      required={section.required}
                      placeholder={section.config?.placeholder || `E.g., \"Describe your experience...\"`}
                    />
                    {errors[section.id] && (
                      <p className="mt-2 text-sm text-red-400">{errors[section.id]}</p>
                    )}
                  </div>
                )}

                {/* Image/Video Section */}
                {(section.type === "image" || section.type === "video") && (
                  <div>
                    <div className="flex space-x-4 mb-4">
                      <label className="flex items-center space-x-2 text-blue-100 cursor-pointer">
                        <input
                          type="radio"
                          name={`${section.id}-input-type`}
                          value="url"
                          checked={inputTypes[section.id] === "url"}
                          onChange={() =>
                            handleInputTypeChange(section.id, "url")
                          }
                          className="text-blue-400 focus:ring-blue-400"
                        />
                        <span>Enter URL</span>
                      </label>
                      <label className="flex items-center space-x-2 text-blue-100 cursor-pointer">
                        <input
                          type="radio"
                          name={`${section.id}-input-type`}
                          value="file"
                          checked={inputTypes[section.id] === "file"}
                          onChange={() =>
                            handleInputTypeChange(section.id, "file")
                          }
                          className="text-blue-400 focus:ring-blue-400"
                        />
                        <span>Upload File</span>
                      </label>
                    </div>

                    {inputTypes[section.id] === "url" ? (
                      <input
                        type="url"
                        className="w-full p-3 bg-white/20 border border-blue-400/30 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-inner placeholder-blue-300"
                        value={formData[section.id] || ""}
                        onChange={(e) => handleInputChange(e, section.id)}
                        required={section.required}
                        placeholder={
                          section.config?.placeholder ||
                          `Enter ${section.type} URL`
                        }
                      />
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-center px-6 pt-5 pb-6 border-2 border-blue-400/30 border-dashed rounded-2xl hover:bg-blue-500/10 transition-colors duration-200"
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                          <div className="flex text-sm text-blue-300">
                            <label
                              htmlFor={`${section.id}-file-upload`}
                              className="relative cursor-pointer bg-white/20 rounded-md font-medium text-blue-400 hover:text-blue-300"
                            >
                              <span>Upload a file</span>
                              <input
                                id={`${section.id}-file-upload`}
                                name={`${section.id}-file-upload`}
                                type="file"
                                accept={
                                  section.type === "image"
                                    ? "image/*"
                                    : "video/*"
                                }
                                className="sr-only"
                                onChange={(e) =>
                                  handleInputChange(e, section.id, true)
                                }
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-blue-200/60">
                            {section.type === "image"
                              ? "PNG, JPG, GIF"
                              : "MP4, MOV, AVI"}{" "}
                            up to {section.config?.maxSize || 10}MB
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {errors[section.id] && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors[section.id]}
                      </p>
                    )}
                    {videoUrlErrors[section.id] && (
                      <p className="mt-2 text-sm text-red-400">
                        {videoUrlErrors[section.id]}
                      </p>
                    )}
                    {formData[section.id] &&
                      typeof formData[section.id] === "string" &&
                      section.type === "image" && (
                        <div className="mt-4">
                          <img
                            src={formData[section.id] || fallbackImage}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-2xl"
                            onError={(e) => {
                              e.target.src = fallbackImage;
                              setErrors((prev) => ({
                                ...prev,
                                [section.id]: "Failed to load image",
                              }));
                            }}
                          />
                        </div>
                      )}
                    {formData[section.id] &&
                      typeof formData[section.id] === "string" &&
                      section.type === "video" &&
                      !videoUrlErrors[section.id] && (
                        <div className="mt-4">
                          {(() => {
                            const validation = validateVideoUrl(
                              section.id,
                              formData[section.id]
                            );
                            if (
                              validation?.isYouTubeUrl &&
                              validation.youtubeEmbedUrl
                            ) {
                              return (
                                <iframe
                                  src={validation.youtubeEmbedUrl}
                                  className="w-full h-32 rounded-2xl"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title="YouTube video"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    setVideoUrlErrors((prev) => ({
                                      ...prev,
                                      [section.id]:
                                        "Failed to load YouTube video. Please check the URL.",
                                    }));
                                  }}
                                />
                              );
                            } else if (validation?.isValidUrl) {
                              return (
                                <video
                                  src={formData[section.id]}
                                  controls
                                  className="w-full h-32 rounded-2xl"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    setVideoUrlErrors((prev) => ({
                                      ...prev,
                                      [section.id]:
                                        "Failed to load video. Please check the URL.",
                                    }));
                                  }}
                                />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    {filePreviews[section.id] && (
                      <div className="mt-4">
                        {section.type === "image" ? (
                          <img
                            src={filePreviews[section.id]}
                            alt="File Preview"
                            className="w-full h-32 object-cover rounded-2xl"
                          />
                        ) : (
                          <video
                            src={filePreviews[section.id]}
                            controls
                            className="w-full h-32 rounded-2xl"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Link Section */}
                {section.type === "link" && (
                  <div>
                    <div className="flex items-center mb-1">
                      <label className="block text-blue-100 mr-2 font-semibold" htmlFor={section.id}>
                        {section.title}
                        {section.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <InfoTooltip text={section.config?.helpText || `Paste a valid URL. Example: https://example.com`} />
                    </div>
                    <input
                      type="url"
                      className="w-full p-3 bg-white/20 border border-blue-400/30 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-inner placeholder-blue-300"
                      value={formData[section.id] || ""}
                      onChange={(e) => handleInputChange(e, section.id)}
                      required={section.required}
                      placeholder={
                        section.config?.placeholder ||
                        "Enter URL (e.g., https://example.com)"
                      }
                    />
                    {errors[section.id] && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors[section.id]}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            {/* Show more sections button */}
            {hiddenSectionsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleSectionCount((prev) => prev + 5)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Show 5 More Section{hiddenSectionsCount > 1 ? "s" : ""}
                </motion.button>
              </motion.div>
            )}
            {/* Submit button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg disabled:opacity-50 transition-all duration-300 text-lg tracking-wide"
              >
                {submitting ? "Submitting..." : "Create Content"}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
}
