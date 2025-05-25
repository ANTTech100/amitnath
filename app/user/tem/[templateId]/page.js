"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../../Header";
import React from "react";

export default function ContentUploadPage({ params }) {
  const router = useRouter();
  const { templateId } = React.use(params); // Unwrap params with React.use()

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({ heading: "", subheading: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [filePreviews, setFilePreviews] = useState({});
  const [inputTypes, setInputTypes] = useState({});

  const fallbackImage =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  useEffect(() => {
    if (templateId) {
      fetchTemplateDetails();
    }
    return () => {
      Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [templateId]);

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

      const initialFormData = { heading: "", subheading: "" };
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

  const validateField = (key, value, file) => {
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

    const section = template.sections.find((s) => s.id === key);
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
      if (file && config.maxSize && file.size > config.maxSize * 1024 * 1024) {
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
      if (file && config.maxSize && file.size > config.maxSize * 1024 * 1024) {
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
  };

  const handleInputChange = (e, key, isFile = false) => {
    const value = isFile ? e.target.files[0] : e.target.value;

    if (isFile) {
      setFormData({ ...formData, [key]: value });
      const error = validateField(key, "", value);
      setErrors((prev) => ({ ...prev, [key]: error }));

      if (value) {
        const url = URL.createObjectURL(value);
        setFilePreviews((prev) => ({ ...prev, [key]: url }));
      } else {
        setFilePreviews((prev) => ({ ...prev, [key]: null }));
      }
    } else {
      setFormData({ ...formData, [key]: value });
      const error = validateField(key, value, null);
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const handleInputTypeChange = (sectionId, type) => {
    setInputTypes({ ...inputTypes, [sectionId]: type });
    setFormData({ ...formData, [sectionId]: "" });
    setFilePreviews((prev) => ({ ...prev, [sectionId]: null }));
    setErrors((prev) => ({ ...prev, [sectionId]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(null);

    const newErrors = {};

    // Validate heading and subheading
    ["heading", "subheading"].forEach((key) => {
      const error = validateField(key, formData[key], null);
      if (error) newErrors[key] = error;
    });

    // Validate sections
    template.sections.forEach((section) => {
      const value = formData[section.id];
      const error = validateField(
        section.id,
        typeof value === "string" ? value : "",
        typeof value !== "string" ? value : null
      );
      if (error) newErrors[section.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const submissionData = new FormData();
      submissionData.append("templateId", templateId);
      submissionData.append("heading", formData.heading);
      submissionData.append("subheading", formData.subheading);

      template.sections.forEach((section) => {
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
      setTimeout(() => router.push(`/publish`), 1500); // Redirect to layoutone with contentId
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/templates"
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
              Back to Templates
            </Link>
            <h1 className="text-3xl font-bold text-purple-100 mt-2">
              {template?.name || "Create Content"}
            </h1>
            <p className="text-gray-400">{template?.description}</p>
          </motion.div>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-xl mb-6"
              >
                {success}
              </motion.div>
            )}
            {errors.global && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6"
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
            className="space-y-6"
          >
            {/* Heading and Subheading Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/30"
            >
              <h3 className="text-xl font-semibold text-purple-200 mb-4">
                Content Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="heading">
                    Heading
                  </label>
                  <input
                    id="heading"
                    type="text"
                    className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.heading}
                    onChange={(e) => handleInputChange(e, "heading")}
                    placeholder="Enter the heading for this content"
                    required
                  />
                  {errors.heading && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.heading}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="subheading"
                  >
                    Subheading
                  </label>
                  <input
                    id="subheading"
                    type="text"
                    className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.subheading}
                    onChange={(e) => handleInputChange(e, "subheading")}
                    placeholder="Enter the subheading for this content"
                    required
                  />
                  {errors.subheading && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.subheading}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            {template?.sections
              ?.sort((a, b) => a.order - b.order)
              .map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: section.order * 0.1 }}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/30"
                >
                  <h3 className="text-xl font-semibold text-purple-200 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{section.description}</p>

                  {section.type === "text" && (
                    <div>
                      <textarea
                        className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500 resize-y"
                        rows="5"
                        value={formData[section.id] || ""}
                        onChange={(e) => handleInputChange(e, section.id)}
                        required={section.required}
                        placeholder={
                          section.config?.placeholder ||
                          `Enter ${section.title.toLowerCase()}`
                        }
                      />
                      {errors[section.id] && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors[section.id]}
                        </p>
                      )}
                    </div>
                  )}

                  {(section.type === "image" || section.type === "video") && (
                    <div>
                      <div className="flex space-x-4 mb-4">
                        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                          <input
                            type="radio"
                            name={`${section.id}-input-type`}
                            value="url"
                            checked={inputTypes[section.id] === "url"}
                            onChange={() =>
                              handleInputTypeChange(section.id, "url")
                            }
                            className="text-purple-500 focus:ring-purple-500"
                          />
                          <span>Enter URL</span>
                        </label>
                        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                          <input
                            type="radio"
                            name={`${section.id}-input-type`}
                            value="file"
                            checked={inputTypes[section.id] === "file"}
                            onChange={() =>
                              handleInputTypeChange(section.id, "file")
                            }
                            className="text-purple-500 focus:ring-purple-500"
                          />
                          <span>Upload File</span>
                        </label>
                      </div>

                      {inputTypes[section.id] === "url" ? (
                        <input
                          type="url"
                          className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500"
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
                          className="flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/30 border-dashed rounded-xl hover:bg-purple-500/10 transition-colors duration-200"
                        >
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-purple-400"
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
                            <div className="flex text-sm text-gray-400">
                              <label
                                htmlFor={`${section.id}-file-upload`}
                                className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300"
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
                            <p className="text-xs text-gray-500">
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

                      {filePreviews[section.id] && (
                        <div className="mt-4">
                          {section.type === "image" ? (
                            <img
                              src={filePreviews[section.id]}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-xl"
                            />
                          ) : (
                            <video
                              src={filePreviews[section.id]}
                              controls
                              className="w-full h-32 rounded-xl"
                            />
                          )}
                        </div>
                      )}
                      {formData[section.id] &&
                        typeof formData[section.id] === "string" && (
                          <div className="mt-4">
                            {section.type === "image" ? (
                              <img
                                src={formData[section.id]}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-xl"
                                onError={(e) => {
                                  e.target.src = fallbackImage;
                                  setErrors((prev) => ({
                                    ...prev,
                                    [section.id]: "Failed to load image",
                                  }));
                                }}
                              />
                            ) : (
                              <video
                                src={formData[section.id]}
                                controls
                                className="w-full h-32 rounded-xl"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  setErrors((prev) => ({
                                    ...prev,
                                    [section.id]: "Failed to load video",
                                  }));
                                }}
                              />
                            )}
                          </div>
                        )}
                    </div>
                  )}

                  {section.type === "link" && (
                    <div>
                      <input
                        type="url"
                        className="w-full p-3 bg-gray-900 border border-purple-500/30 rounded-xl text-gray-200 focus:ring-purple-500 focus:border-purple-500"
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

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 transition-colors duration-300"
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
