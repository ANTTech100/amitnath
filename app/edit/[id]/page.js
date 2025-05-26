"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditContent() {
  const [content, setContent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    sections: {},
  });
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const params = useParams();
  const router = useRouter();
  const contentId = params.id;

  // Fetch content data on mount
  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch("/api/upload");
        const result = await response.json();
        if (result.success) {
          const contentData = result.content.find(
            (item) => item._id === contentId
          );
          if (!contentData) {
            toast.error("Content not found");
            router.push("/");
            return;
          }

          // Check permission
          const userId = localStorage.getItem("userid");
          if (!userId || contentData.createdBy !== userId) {
            setHasPermission(false);
            setLoading(false);
            return;
          }

          setContent(contentData);
          setTemplate(contentData.templateId);
          setFormData({
            heading: contentData.heading,
            subheading: contentData.subheading,
            sections: contentData.sections,
          });
        } else {
          toast.error(result.message || "Failed to fetch content");
        }
      } catch (error) {
        toast.error("Error fetching content");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [contentId, router]);

  // Handle input changes for heading and subheading
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle section input changes
  const handleSectionChange = (sectionId, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], value },
      },
    }));
  };

  // Handle file input for image/video sections
  const handleFileChange = (sectionId, file) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], value: file },
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("contentId", contentId);
    data.append("templateId", content.templateId._id);
    data.append("heading", formData.heading);
    data.append("subheading", formData.subheading);
    data.append("userId", localStorage.getItem("userId"));
    Object.entries(formData.sections).forEach(([sectionId, section]) => {
      if (section.value instanceof File) {
        data.append(sectionId, section.value);
      } else {
        data.append(sectionId, section.value);
      }
    });

    try {
      const response = await fetch("/api/upload", {
        method: "PUT",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Content updated successfully");
        router.push("/");
      } else {
        toast.error(result.message || "Failed to update content");
      }
    } catch (error) {
      toast.error("Error updating content");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You don not have permission to change this content. Only the creator
            can edit this item.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!content || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 11.172a4 4 0 00-5.656 0"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Content Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The content or template you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Content
              </h1>
              <p className="text-gray-500 mt-1">
                Make your changes and save when ready
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter your main heading"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subheading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subheading"
                    value={formData.subheading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter your subheading"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Sections */}
            {template.sections && template.sections.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  Content Sections
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {template.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            {section.title}
                            {section.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            {section.type}
                          </span>
                        </div>
                      </label>

                      {section.type === "text" ? (
                        <input
                          type="text"
                          value={formData.sections[section.id]?.value || ""}
                          onChange={(e) =>
                            handleSectionChange(section.id, e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                          placeholder={`Enter ${section.title.toLowerCase()}`}
                          required={section.required}
                        />
                      ) : section.type === "image" ||
                        section.type === "video" ? (
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept={
                              section.type === "image" ? "image/*" : "video/*"
                            }
                            onChange={(e) =>
                              handleFileChange(section.id, e.target.files[0])
                            }
                            className="hidden"
                            id={`file-${section.id}`}
                            required={
                              section.required &&
                              !formData.sections[section.id]?.value
                            }
                          />
                          <label
                            htmlFor={`file-${section.id}`}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-2 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                {section.type}
                              </p>
                            </div>
                          </label>
                          {formData.sections[section.id]?.value && (
                            <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                              ✓{" "}
                              {formData.sections[section.id].value.name ||
                                "File selected"}
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Update Content</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
