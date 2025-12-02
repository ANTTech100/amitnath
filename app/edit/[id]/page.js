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
    backgroundColor: "#ffffff",
    askUserDetails: false,
  });
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const params = useParams();
  const router = useRouter();
  const contentId = params.id;

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
            router.push("/publish");
            return;
          }

          const isSuperadmin = localStorage.getItem("superadminAuth") === "true";
          const userId = localStorage.getItem("userid");
          const createdById = (contentData.createdBy || "").toString();
          if (!isSuperadmin && (!userId || createdById !== userId)) {
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
            backgroundColor: contentData.backgroundColor || "#ffffff",
            askUserDetails: contentData.askUserDetails || false,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, askUserDetails: e.target.checked }));
  };

  const handleColorChange = (e) => {
    setFormData((prev) => ({ ...prev, backgroundColor: e.target.value }));
  };

  const handleSectionChange = (sectionId, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], value },
      },
    }));
  };

  const handleFileChange = (sectionId, file) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { 
          type: prev.sections[sectionId]?.type || "image",
          value: file 
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSuperadmin = localStorage.getItem("superadminAuth") === "true";
    const userIdLocal = localStorage.getItem("userid");
    const effectiveUserId = isSuperadmin
      ? (content?.createdBy ? content.createdBy.toString() : userIdLocal)
      : userIdLocal;
    if (!effectiveUserId || effectiveUserId === "null") {
      toast.error("Please log in to update content");
      router.push("/user/register");
      return;
    }

    const data = new FormData();
    data.append("contentId", contentId);
    data.append("templateId", content.templateId._id);
    data.append("heading", formData.heading);
    data.append("subheading", formData.subheading);
    data.append("backgroundColor", formData.backgroundColor);
    data.append("askUserDetails", formData.askUserDetails);
    data.append("userId", effectiveUserId);
    
    // Handle sections - properly send files and text
    Object.entries(formData.sections).forEach(([sectionId, section]) => {
      if (section.value instanceof File) {
        // Send file directly
        data.append(sectionId, section.value);
      } else if (typeof section.value === 'string') {
        // Send string value (URL or text)
        data.append(sectionId, section.value);
      }
    });

    try {
      const response = await fetch("/api/upload", {
        method: "PUT",
        body: data,
        headers: isSuperadmin ? { "x-superadmin": "true" } : undefined,
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

  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const renderTextPreview = (text) => {
    if (!text) return null;
    
    if (isUrl(text)) {
      return (
        <a 
          href={text} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 underline break-all"
        >
          {text}
        </a>
      );
    }

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <li key={idx} className="ml-4">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      return <p key={idx} className="mb-2">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to edit this content. Only the creator can modify it.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!content || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full border border-gray-200">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-6">The content or template you are looking for does not exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
              <p className="text-gray-500 text-sm mt-0.5">Update your content and preview changes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col h-[80vh]">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Content Editor
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Enter your heading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subheading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subheading"
                    value={formData.subheading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Enter your subheading"
                    required
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={handleColorChange}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={handleColorChange}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="askUserDetails"
                      checked={formData.askUserDetails}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="askUserDetails" className="text-sm text-gray-700 font-medium">
                      Ask for user details
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic Sections */}
              {template.sections && template.sections.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Content Sections
                  </h3>

                  {template.sections.map((section) => (
                    <div key={section.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {section.title}
                        {section.required && <span className="text-red-500 ml-1">*</span>}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {section.type}
                        </span>
                      </label>

                      {section.type === "text" ? (
                        <textarea
                          value={formData.sections[section.id]?.value || ""}
                          onChange={(e) => handleSectionChange(section.id, e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none min-h-[100px]"
                          placeholder={`Enter ${section.title.toLowerCase()}`}
                          required={section.required}
                        />
                      ) : section.type === "link" ? (
                        <input
                          type="url"
                          value={formData.sections[section.id]?.value || ""}
                          onChange={(e) => handleSectionChange(section.id, e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          placeholder={`Enter ${section.title.toLowerCase()} URL`}
                          required={section.required}
                        />
                      ) : (section.type === "image" || section.type === "video") ? (
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept={section.type === "image" ? "image/*" : "video/*"}
                            onChange={(e) => handleFileChange(section.id, e.target.files[0])}
                            className="hidden"
                            id={`file-${section.id}`}
                            required={section.required && !formData.sections[section.id]?.value}
                          />
                          
                          {formData.sections[section.id]?.value ? (
                            <div className="space-y-2">
                              {section.type === "image" && formData.sections[section.id].value instanceof File ? (
                                <div className="relative group">
                                  <img 
                                    src={URL.createObjectURL(formData.sections[section.id].value)} 
                                    alt={section.title}
                                    className="w-full h-auto rounded-lg border border-gray-200"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <label
                                      htmlFor={`file-${section.id}`}
                                      className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg cursor-pointer font-medium shadow-lg"
                                    >
                                      Change Image
                                    </label>
                                  </div>
                                </div>
                              ) : section.type === "video" && formData.sections[section.id].value instanceof File ? (
                                <div className="space-y-2">
                                  <video 
                                    src={URL.createObjectURL(formData.sections[section.id].value)} 
                                    controls
                                    className="w-full h-auto rounded-lg border border-gray-200"
                                  />
                                  <label
                                    htmlFor={`file-${section.id}`}
                                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer font-medium"
                                  >
                                    Change Video
                                  </label>
                                </div>
                              ) : typeof formData.sections[section.id].value === 'string' ? (
                                <div className="space-y-2">
                                  {section.type === "image" ? (
                                    <div className="relative group">
                                      <img 
                                        src={formData.sections[section.id].value} 
                                        alt={section.title}
                                        className="w-full h-auto rounded-lg border border-gray-200"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <label
                                          htmlFor={`file-${section.id}`}
                                          className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg cursor-pointer font-medium shadow-lg"
                                        >
                                          Change Image
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <video 
                                        src={formData.sections[section.id].value} 
                                        controls
                                        className="w-full h-auto rounded-lg border border-gray-200"
                                      />
                                      <label
                                        htmlFor={`file-${section.id}`}
                                        className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer font-medium"
                                      >
                                        Change Video
                                      </label>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <label
                                  htmlFor={`file-${section.id}`}
                                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                                >
                                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="text-sm text-gray-500">
                                    <span className="font-medium">Click to upload</span> {section.type}
                                  </p>
                                </label>
                              )}
                            </div>
                          ) : (
                            <label
                              htmlFor={`file-${section.id}`}
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Click to upload</span> {section.type}
                              </p>
                            </label>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Update Content</span>
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col h-[80vh]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h2>
            </div>

            <div className="p-6 bg-gray-50 flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Heading</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-gray-900 font-bold text-xl">
                      {renderTextPreview(formData.heading) || <span className="text-gray-400">No heading</span>}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subheading</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-gray-700 text-base">
                      {renderTextPreview(formData.subheading) || <span className="text-gray-400">No subheading</span>}
                    </div>
                  </div>
                </div>

                {Object.entries(formData.sections).map(([sectionId, section]) => {
                  const sectionDef = template.sections.find(s => s.id === sectionId);
                  if (!sectionDef || !section.value) return null;

                  return (
                    <div key={sectionId}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {sectionDef.title}
                      </h3>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        {sectionDef.type === "text" ? (
                          <div className="prose prose-sm max-w-none text-gray-700">
                            {renderTextPreview(section.value)}
                          </div>
                        ) : sectionDef.type === "link" ? (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <a 
                              href={section.value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline break-all"
                            >
                              {section.value}
                            </a>
                          </div>
                        ) : sectionDef.type === "image" && section.value instanceof File ? (
                          <div>
                            <img 
                              src={URL.createObjectURL(section.value)} 
                              alt={sectionDef.title}
                              className="w-full h-auto rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-2">{section.value.name}</p>
                          </div>
                        ) : sectionDef.type === "video" && section.value instanceof File ? (
                          <div>
                            <video 
                              src={URL.createObjectURL(section.value)} 
                              controls
                              className="w-full h-auto rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-2">{section.value.name}</p>
                          </div>
                        ) : typeof section.value === 'string' && section.value.startsWith('http') ? (
                          <div>
                            {sectionDef.type === "image" ? (
                              <img 
                                src={section.value} 
                                alt={sectionDef.title}
                                className="w-full h-auto rounded-lg"
                              />
                            ) : sectionDef.type === "video" ? (
                              <video 
                                src={section.value} 
                                controls
                                className="w-full h-auto rounded-lg"
                              />
                            ) : null}
                            <p className="text-xs text-gray-500 mt-2 break-all">{section.value}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {section.value.name || "File uploaded"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
