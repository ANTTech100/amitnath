"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../../Header";
import React from "react";
import InfoTooltip from "../../../components/InfoTooltip";
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaImage, FaLink, FaRegFileAlt, FaSpinner } from "react-icons/fa";

console.log('Loaded: app/user/tem/[templateId]/page.js');

export default function ContentUploadPage({ params }) {
  const router = useRouter();
  const { templateId } = React.use(params);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [filePreviews, setFilePreviews] = useState({});
  const [inputTypes, setInputTypes] = useState({});
  const [userId, setUserId] = useState(null);
  const [videoUrlErrors, setVideoUrlErrors] = useState({});
  const [visibleSectionCount, setVisibleSectionCount] = useState(5);
  const [imageInputModes, setImageInputModes] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [askUserDetails, setAskUserDetails] = useState(false);
  const setImageMode = (sectionId, mode) => {
    setImageInputModes(prev => ({ ...prev, [sectionId]: mode }));
    console.log(`Image section [${sectionId}] mode set to:`, mode);
  };

  const fallbackImage =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";


  // Helper to set mode for a section
  const getSectionIcon = (type) => {
    const iconClass = "w-5 h-5 mr-2 text-gray-600";
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
        label = "Link Section for button";
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
      <div className="flex items-center text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  const getSectionHelpText = (section) => {
    // Use custom help text if provided in section config
    if (section.config?.helpText) {
      return section.config.helpText;
    }

    // Provide specific help text based on section type
    switch (section.type) {
      case "text":
        return "Enter text content for this section. You can provide descriptions, instructions, or any textual information.";
      case "image":
        return "Upload an image file or provide a direct image URL. Supported formats: JPG, PNG, GIF. You can switch between file upload and URL input.";
      case "video":
        return "Upload a video file or provide a video URL (YouTube or direct video file). Supported formats: MP4, MOV, AVI, MKV, WEBM.";
      case "audio":
        return "Upload an audio file or provide a direct audio URL. Supported formats: MP3, WAV, AAC, OGG.";
      case "link":
        return "Enter a valid URL that will be used as a button link. Make sure the URL starts with http:// or https://";
      default:
        return `Provide content for the ${section.title} section.`;
    }
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
  }, [templateId, router]);

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
      console.log('Template data:', data.data);

      const initialFormData = {};
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
    
    // Show confirmation dialog first
    setShowConfirmationDialog(true);
  };

  const handleConfirmationResponse = (response) => {
    setAskUserDetails(response);
    setShowConfirmationDialog(false);
    // Proceed with actual submission
    proceedWithSubmission(response);
  };

  const proceedWithSubmission = async (askUserDetailsValue = askUserDetails) => {
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

    // Validate all sections
    await Promise.all(template?.sections?.map(async (section) => {
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
    }));

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
      // 4. On submit, send all formData (files and URLs) to the backend as FormData
      const submissionData = new FormData();
      submissionData.append("templateId", templateId);
      submissionData.append("heading", formData.heading);
      submissionData.append("subheading", formData.subheading);
      submissionData.append("backgroundColor", formData.backgroundColor);
      submissionData.append("userId", userId);
      submissionData.append("askUserDetails", askUserDetailsValue);
      console.log("Sending askUserDetailsValue:", askUserDetailsValue);
      template?.sections?.forEach((section) => {
        if (selectedFiles[section.id]) {
          submissionData.append(section.id, selectedFiles[section.id]);
        } else {
          submissionData.append(section.id, formData[section.id] || "");
        }
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setSuccess("Content created successfully!");
      setTimeout(() => router.push(`/publish`), 1500);
    } catch (err) {
      setErrors({
        global: err.message || "Failed to create content. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image upload to Cloudinary
  // const handleCloudinaryUpload = async (file, sectionId) => {
  //   if (!file) return;
  //   setUploadingSections(prev => ({ ...prev, [sectionId]: true }));
  //   setErrors((prev) => ({ ...prev, [sectionId]: null }));
  //   setFormData((prev) => ({ ...prev, [sectionId]: "Uploading..." }));
  //   try {
  //     const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  //     const formDataCloud = new FormData();
  //     formDataCloud.append("file", file);
  //     formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  //     const res = await fetch(url, { method: "POST", body: formDataCloud });
  //     const data = await res.json();
  //     if (data.secure_url) {
  //       setFormData((prev) => ({ ...prev, [sectionId]: data.secure_url }));
  //       setFilePreviews((prev) => ({ ...prev, [sectionId]: data.secure_url }));
  //     } else {
  //       setErrors((prev) => ({ ...prev, [sectionId]: "Cloudinary upload failed" }));
  //     }
  //   } catch (err) {
  //     setErrors((prev) => ({ ...prev, [sectionId]: "Cloudinary upload error" }));
  //   } finally {
  //     setUploadingSections(prev => ({ ...prev, [sectionId]: false }));
  //   }
  // };

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

  // Remove stepper/accordion logic and SectionCard, restore open layout
  // Remove FloatingInput and use previous input style with modern touches

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

  console.log('Rendering ContentUploadPage');

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/user/tem"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
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
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
              {template?.name || "Create Content"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              {template?.description}
            </p>
          </motion.div>
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 shadow-sm"
              >
                {success}
              </motion.div>
            )}
            {errors.global && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 shadow-sm"
              >
                Error: {errors.global}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={e => { e.preventDefault(); handleSubmit(e); }}
            className="space-y-8"
          >
            <div className="mb-6 flex items-center gap-2">
              <span className="text-red-500 text-lg font-bold">*</span>
              <span className="text-gray-600 text-sm">Fields marked with * are required.</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-100 p-8 rounded-lg shadow-sm border border-blue-300 mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Content Details
              </h3>
              <div className="space-y-6">
                {/* Heading input */}
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold" htmlFor="heading">
                    Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="heading"
                    type="text"
                    className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400"
                    value={formData.heading}
                    onChange={(e) => handleInputChange(e, "heading")}
                    placeholder="Enter the heading for this content"
                    required
                  />
                  {errors.heading && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.heading}
                    </p>
                  )}
                </div>
                {/* Subheading input */}
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold" htmlFor="subheading">
                    Subheading <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subheading"
                    type="text"
                    className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400"
                    value={formData.subheading}
                    onChange={(e) => handleInputChange(e, "subheading")}
                    placeholder="Enter the subheading for this content"
                    required
                  />
                  {errors.subheading && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.subheading}
                    </p>
                  )}
                </div>
                {/* Background color input */}
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold" htmlFor="backgroundColor">
                    Background Color <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="backgroundColor"
                      type="text"
                      className="flex-1 p-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange(e, "backgroundColor")}
                      placeholder="Enter hex color code (e.g., #ffffff)"
                      required
                    />
                    <input
                      type="color"
                      className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer shadow-sm"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange(e, "backgroundColor")}
                    />
                  </div>
                  {errors.backgroundColor && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {errors.backgroundColor}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
            {/* Section cards: all visible, modernized but open layout */}
            {visibleSections.map((section, idx) => (
              <motion.div
                key={section.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: section.order * 0.1 }}
                className="bg-blue-100 p-8 rounded-lg shadow-sm border border-blue-300 mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getSectionIcon(section.type)}
                    <h3 className="text-sm  text-gray-900 ml-2">
                      {section.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <InfoTooltip text={getSectionHelpText(section)} />
                    {section.required && (
                      <span className="text-red-500 text-sm font-medium">*</span>
                    )}
                  </div>
                </div>
               
                {/* Text Section */}
                {section.type === "text" && (
                  <div>
                    <textarea
                      id={section.id}
                      className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400 resize-y"
                      rows="5"
                      value={formData[section.id] || ""}
                      onChange={(e) => handleInputChange(e, section.id)}
                      required={section.required}
                      placeholder={section.config?.placeholder || `E.g., \"Describe your experience...\"`}
                    />
                    {errors[section.id] && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {errors[section.id]}
                      </p>
                    )}
                  </div>
                )}
                {/* Image Section */}
                {section.type === "image" && (
                  <div className="bg-blue-200 rounded-lg p-6 border border-blue-400">
                    {/* Tabbed interface for upload vs URL */}
                    <div className="flex space-x-1 mb-4 bg-gray-200 rounded-lg p-1">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none ${imageInputModes[section.id] !== 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => setImageMode(section.id, "file")}
                      >
                        <svg className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Upload
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none ${imageInputModes[section.id] === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => setImageMode(section.id, "url")}
                      >
                        <svg className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                        Image URL
                      </button>
                    </div>
                    
                    {/* Upload from device */}
                    {imageInputModes[section.id] !== 'url' && (
                      <div className="mb-4">
                        <input
                          id={`${section.id}-file-upload`}
                          name={`${section.id}-file-upload`}
                          type="file"
                          accept="image/*"
                          autoComplete="off"
                          className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                setErrors(prev => ({ ...prev, [section.id]: 'Please select a valid image file.' }));
                                return;
                              }
                              setErrors(prev => ({ ...prev, [section.id]: null }));
                              setSelectedFiles(prev => ({ ...prev, [section.id]: file }));
                              setFilePreviews(prev => ({ ...prev, [section.id]: URL.createObjectURL(file) }));
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to {section.config?.maxSize || 10}MB</p>
                      </div>
                    )}
                    
                    {/* Enter image URL */}
                    {imageInputModes[section.id] === 'url' && (
                      <div className="mb-4">
                        <input
                          type="url"
                          className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                          value={formData[section.id] || ""}
                          onChange={e => handleInputChange(e, section.id)}
                          placeholder="Paste image URL (https://...)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste a direct image link (JPG, PNG, GIF, etc.)</p>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {errors[section.id] && (
                      <div className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {errors[section.id]}
                      </div>
                    )}
                    
                    {/* Preview for uploaded or URL image */}
                    {filePreviews[section.id] && (
                      <div className="mt-4">
                        <span className="text-gray-600 text-sm mb-2 block">Image Preview:</span>
                        <div className="flex justify-center">
                          <img
                            src={filePreviews[section.id]}
                            alt="Preview"
                            className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={e => { e.target.onerror = null; e.target.src = fallbackImage; }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Video Section */}
                {section.type === "video" && (
                  <div className="bg-blue-200 rounded-lg p-6 border border-blue-400">
                    {/* Tabbed interface for upload vs URL */}
                    <div className="flex space-x-1 mb-4 bg-gray-200 rounded-lg p-1">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none ${inputTypes[section.id] !== 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => handleInputTypeChange(section.id, "file")}
                      >
                        <svg className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        Upload
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none ${inputTypes[section.id] === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => handleInputTypeChange(section.id, "url")}
                      >
                        <svg className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                        Video URL
                      </button>
                    </div>
                    
                    {/* Upload from device */}
                    {inputTypes[section.id] !== 'url' && (
                      <div className="mb-4">
                        <input
                          id={`${section.id}-file-upload`}
                          name={`${section.id}-file-upload`}
                          type="file"
                          accept="video/*"
                          autoComplete="off"
                          className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              if (!file.type.startsWith('video/')) {
                                setErrors(prev => ({ ...prev, [section.id]: 'Please select a valid video file.' }));
                                return;
                              }
                              setErrors(prev => ({ ...prev, [section.id]: null }));
                              setSelectedFiles(prev => ({ ...prev, [section.id]: file }));
                              setFilePreviews(prev => ({ ...prev, [section.id]: URL.createObjectURL(file) }));
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500">MP4, MOV, AVI, MKV, WEBM up to {section.config?.maxSize || 50}MB</p>
                      </div>
                    )}
                    
                    {/* Enter video URL */}
                    {inputTypes[section.id] === 'url' && (
                      <div className="mb-4">
                        <input
                          type="url"
                          className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                          value={formData[section.id] || ""}
                          onChange={e => handleInputChange(e, section.id)}
                          placeholder="Paste video URL (YouTube or direct .mp4, .mov, etc.)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste a YouTube link or direct video file link</p>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {errors[section.id] && (
                      <div className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {errors[section.id]}
                      </div>
                    )}
                    
                    {/* Preview for uploaded or URL video */}
                    {(formData[section.id] && typeof formData[section.id] === "string" && formData[section.id].startsWith("http")) && (
                      <div className="mt-4">
                        <span className="text-gray-600 text-sm mb-2 block">Video Preview:</span>
                        <div className="flex justify-center">
                          {/* YouTube embed */}
                          {(() => {
                            const value = formData[section.id];
                            let youtubeEmbedUrl = null;
                            try {
                              const parsedUrl = new URL(value);
                              if (
                                parsedUrl.hostname.includes("youtube.com") ||
                                parsedUrl.hostname.includes("youtu.be")
                              ) {
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
                              }
                            } catch {}
                            if (youtubeEmbedUrl) {
                              return (
                                <iframe
                                  width="400"
                                  height="225"
                                  src={youtubeEmbedUrl}
                                  title="YouTube video preview"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="rounded-lg border border-gray-200 shadow-sm"
                                ></iframe>
                              );
                            } else {
                              // Direct video file
                              return (
                                <video
                                  src={formData[section.id]}
                                  controls
                                  className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                                />
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Link Section */}
                {section.type === "link" && (
                  <div>
                    <input
                      type="url"
                      className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400"
                      value={formData[section.id] || ""}
                      onChange={(e) => handleInputChange(e, section.id)}
                      required={section.required}
                      placeholder={
                        section.config?.placeholder ||
                        "Enter URL (e.g., https://example.com)"
                      }
                    />
                    {errors[section.id] && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
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
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleSectionCount((prev) => prev + 5)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-all duration-300 flex items-center"
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm disabled:opacity-50 transition-all duration-300 text-lg"
              >
                {submitting ? "Submitting..." : "Create Content"}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmationDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  User Details Collection
                </h2>
                <p className="text-gray-600">
                  Do you want to collect user details and show a quiz popup when users view this content?
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleConfirmationResponse(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  No
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleConfirmationResponse(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Yes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
