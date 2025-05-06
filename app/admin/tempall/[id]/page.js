// pages/admin/tempall/[id].js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import {
  CheckCircle,
  Trash,
  Plus,
  Save,
  Upload,
  Edit3,
  ArrowRight,
  X,
  ArrowLeft,
} from "lucide-react";

export default function EditTemplate({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [templateId, setTemplateId] = useState("");

  const [template, setTemplate] = useState({
    name: "",
    description: "",
    type: "basic",
    status: "draft",
    sections: [],
  });

  // Available section types
  const sectionTypes = [
    { id: "text", label: "Text Block", icon: "Edit3" },
    { id: "image", label: "Image Upload", icon: "Image" },
    { id: "video", label: "Video Embed", icon: "Video" },
    { id: "file", label: "File Upload", icon: "File" },
    { id: "link", label: "External Link", icon: "Link" },
  ];

  // Template types
  const templateTypes = [
    { id: "basic", label: "Basic Template" },
    { id: "article", label: "Article Template" },
    { id: "gallery", label: "Gallery Template" },
    { id: "portfolio", label: "Portfolio Template" },
    { id: "report", label: "Report Template" },
  ];

  // Fetch template data when component mounts
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Get template ID from URL
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[pathParts.length - 1];
        setTemplateId(id);

        const response = await axios.get(`/api/admin/templatecreate/${id}`);

        if (response.data.success) {
          setTemplate(response.data.data);
        } else {
          setError("Failed to load template");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError(err.response?.data?.message || "Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  // Add a new section to the template
  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      title: "",
      description: "",
      required: false,
      order: template.sections.length,
      config: {},
    };

    // Add specific configuration based on section type
    switch (type) {
      case "text":
        newSection.config = {
          minLength: 0,
          maxLength: 1000,
          placeholder: "Enter text here...",
          format: "plain", // plain, markdown, html
        };
        break;
      case "image":
        newSection.config = {
          maxSize: 5, // MB
          allowedTypes: ["jpg", "jpeg", "png", "gif"],
          width: 800,
          height: 600,
          aspectRatio: "4:3",
        };
        break;
      case "video":
        newSection.config = {
          maxDuration: 300, // seconds
          maxSize: 100, // MB
          allowedSources: ["upload", "youtube", "vimeo"],
        };
        break;
      case "file":
        newSection.config = {
          maxSize: 10, // MB
          allowedTypes: ["pdf", "doc", "docx", "xls", "xlsx"],
        };
        break;
      case "link":
        newSection.config = {
          validateUrl: true,
          allowedDomains: [],
        };
        break;
    }

    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
    });
  };

  // Remove a section from the template
  const removeSection = (sectionId) => {
    setTemplate({
      ...template,
      sections: template.sections.filter((section) => section.id !== sectionId),
    });
  };

  // Update a section's properties
  const updateSection = (sectionId, field, value) => {
    setTemplate({
      ...template,
      sections: template.sections.map((section) => {
        if (section.id === sectionId) {
          return { ...section, [field]: value };
        }
        return section;
      }),
    });
  };

  // Update section config
  const updateSectionConfig = (sectionId, configField, value) => {
    setTemplate({
      ...template,
      sections: template.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            config: {
              ...section.config,
              [configField]: value,
            },
          };
        }
        return section;
      }),
    });
  };

  // Reorder sections using drag and drop (simplified version)
  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...template.sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);

    // Update order property
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    setTemplate({
      ...template,
      sections: updatedSections,
    });
  };

  // Handle template form field changes
  const handleTemplateChange = (field, value) => {
    setTemplate({
      ...template,
      [field]: value,
    });
  };

  // Save template (draft or publish)
  const saveTemplate = async (status = template.status) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      // Validate template
      if (!template.name.trim()) {
        setError("Template name is required");
        setSaving(false);
        return;
      }

      // Update status
      const templateToSave = {
        ...template,
        status: status,
      };

      // Send to API
      const response = await axios.put(
        `/api/admin/templatecreate/${templateId}`,
        templateToSave
      );

      if (response.data.success) {
        setMessage(
          status === "published"
            ? "Template published successfully!"
            : "Template updated successfully!"
        );

        // Refresh template data
        setTemplate(response.data.data);
      }
    } catch (err) {
      console.error("Error saving template:", err);
      setError(err.response?.data?.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  // Change template status
  const changeStatus = async (newStatus) => {
    await saveTemplate(newStatus);
  };

  // Render section configuration form based on type
  const renderSectionConfig = (section) => {
    switch (section.type) {
      case "text":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Length
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.minLength}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "minLength",
                    parseInt(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Length
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.maxLength}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "maxLength",
                    parseInt(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Placeholder Text
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.placeholder}
                onChange={(e) =>
                  updateSectionConfig(section.id, "placeholder", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.format}
                onChange={(e) =>
                  updateSectionConfig(section.id, "format", e.target.value)
                }
              >
                <option value="plain">Plain Text</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </select>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Size (MB)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.maxSize}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "maxSize",
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Width (px)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.width}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "width",
                    parseInt(e.target.value) || 800
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (px)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.height}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "height",
                    parseInt(e.target.value) || 600
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aspect Ratio
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.aspectRatio}
                onChange={(e) =>
                  updateSectionConfig(section.id, "aspectRatio", e.target.value)
                }
              >
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="1:1">1:1</option>
                <option value="free">Free Form</option>
              </select>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Duration (seconds)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.maxDuration}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "maxDuration",
                    parseInt(e.target.value) || 300
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Size (MB)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.maxSize}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "maxSize",
                    parseInt(e.target.value) || 100
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allowed Sources
              </label>
              <div className="mt-2 space-y-2">
                {["upload", "youtube", "vimeo"].map((source) => (
                  <div key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`source-${source}`}
                      checked={section.config.allowedSources?.includes(source)}
                      onChange={(e) => {
                        const currentSources = [
                          ...(section.config.allowedSources || []),
                        ];
                        if (e.target.checked) {
                          if (!currentSources.includes(source)) {
                            updateSectionConfig(section.id, "allowedSources", [
                              ...currentSources,
                              source,
                            ]);
                          }
                        } else {
                          updateSectionConfig(
                            section.id,
                            "allowedSources",
                            currentSources.filter((s) => s !== source)
                          );
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label
                      htmlFor={`source-${source}`}
                      className="ml-2 block text-sm text-gray-700 capitalize"
                    >
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "file":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Size (MB)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.config.maxSize}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "maxSize",
                    parseInt(e.target.value) || 10
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allowed File Types
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["pdf", "doc", "docx", "xls", "xlsx", "txt", "zip"].map(
                  (fileType) => (
                    <div key={fileType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filetype-${fileType}`}
                        checked={section.config.allowedTypes?.includes(
                          fileType
                        )}
                        onChange={(e) => {
                          const currentTypes = [
                            ...(section.config.allowedTypes || []),
                          ];
                          if (e.target.checked) {
                            if (!currentTypes.includes(fileType)) {
                              updateSectionConfig(section.id, "allowedTypes", [
                                ...currentTypes,
                                fileType,
                              ]);
                            }
                          } else {
                            updateSectionConfig(
                              section.id,
                              "allowedTypes",
                              currentTypes.filter((t) => t !== fileType)
                            );
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                      />
                      <label
                        htmlFor={`filetype-${fileType}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {fileType.toUpperCase()}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "link":
        return (
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`validate-url-${section.id}`}
                checked={section.config.validateUrl}
                onChange={(e) =>
                  updateSectionConfig(
                    section.id,
                    "validateUrl",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <label
                htmlFor={`validate-url-${section.id}`}
                className="ml-2 block text-sm text-gray-700"
              >
                Validate URL format
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allowed Domains (leave empty to allow all)
              </label>
              <div className="mt-2">
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows="3"
                  placeholder="example.com, another-site.org"
                  value={section.config.allowedDomains?.join(", ") || ""}
                  onChange={(e) => {
                    const domains = e.target.value
                      .split(",")
                      .map((domain) => domain.trim())
                      .filter((domain) => domain);
                    updateSectionConfig(section.id, "allowedDomains", domains);
                  }}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter domains separated by commas
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Edit Template | Admin Dashboard</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => router.push("/admin/tempall")}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to templates
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Template
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/admin/tempall")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>

              {/* Status change buttons based on current status */}
              {template.status === "draft" && (
                <button
                  onClick={() => changeStatus("published")}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish
                </button>
              )}

              {template.status === "published" && (
                <button
                  onClick={() => changeStatus("archived")}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <X className="mr-2 h-4 w-4" />
                  Archive
                </button>
              )}

              {template.status === "archived" && (
                <button
                  onClick={() => changeStatus("published")}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Restore & Publish
                </button>
              )}

              <button
                onClick={() => saveTemplate(template.status)}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Template status badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${
                template.status === "published"
                  ? "bg-green-100 text-green-800"
                  : template.status === "draft"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {template.status.charAt(0).toUpperCase() +
                template.status.slice(1)}
            </span>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Template Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Basic information about the template.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Template Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={template.name}
                    onChange={(e) =>
                      handleTemplateChange("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Template Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-blue-500 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={template.type}
                    onChange={(e) =>
                      handleTemplateChange("type", e.target.value)
                    }
                  >
                    {templateTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={template.description || ""}
                    onChange={(e) =>
                      handleTemplateChange("description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Template Sections
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Add, remove, or configure sections for this template.
                </p>
              </div>
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="section-menu"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </button>
                </div>

                <div
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="section-menu"
                >
                  <div className="py-1" role="none">
                    {sectionTypes.map((sectionType) => (
                      <button
                        key={sectionType.id}
                        onClick={() => addSection(sectionType.id)}
                        className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                      >
                        {sectionType.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {template.sections.length === 0 ? (
                <p className="text-gray-500">No sections added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {template.sections.map((section, index) => (
                    <li
                      key={section.id}
                      className="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-700 font-medium">{`Section ${
                          index + 1
                        }: ${section.type}`}</span>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="ml-auto flex items-center space-x-2">
                        <button
                          onClick={() => moveSection(index, index - 1)}
                          disabled={index === 0}
                          className={`${
                            index === 0 ? "opacity-50 cursor-not-allowed" : ""
                          } text-gray-500 hover:text-gray-700`}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveSection(index, index + 1)}
                          disabled={index === template.sections.length - 1}
                          className={`${
                            index === template.sections.length - 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          } text-gray-500 hover:text-gray-700`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
