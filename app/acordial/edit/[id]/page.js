"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Upload, Link, Type, Video, MousePointer, Save } from "lucide-react";

export default function EditAccordionContent() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);
  const [originalContent, setOriginalContent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    backgroundColor: "#ffffff",
  });

  const [guides, setGuides] = useState([
    {
      title: "",
      items: [
        {
          type: "text",
          content: "",
          order: 0,
        },
      ],
      order: 0,
    },
  ]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchContent();
    } else {
      router.push("/user/register");
      return;
    }
  }, [contentId, router]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/acordial/view?id=${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch content");
      }

      const content = data.data;
      setOriginalContent(content);
      
      // Populate form with existing data
      setFormData({
        title: content.title,
        subtitle: content.subtitle,
        backgroundColor: content.backgroundColor,
      });
      
      setGuides(content.guides || [
        {
          title: "",
          items: [
            {
              type: "text",
              content: "",
              order: 0,
            },
          ],
          order: 0,
        },
      ]);
    } catch (err) {
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const addGuide = () => {
    const newGuide = {
      title: "",
      items: [
        {
          type: "text",
          content: "",
          order: 0,
        },
      ],
      order: guides.length,
    };
    setGuides([...guides, newGuide]);
  };

  const removeGuide = (guideIndex) => {
    if (guides.length > 1) {
      const updatedGuides = guides.filter((_, index) => index !== guideIndex);
      // Reorder guides
      const reorderedGuides = updatedGuides.map((guide, index) => ({
        ...guide,
        order: index,
      }));
      setGuides(reorderedGuides);
    }
  };

  const updateGuideTitle = (guideIndex, title) => {
    const updatedGuides = [...guides];
    updatedGuides[guideIndex].title = title;
    setGuides(updatedGuides);
  };

  const addItemToGuide = (guideIndex) => {
    const updatedGuides = [...guides];
    const newItem = {
      type: "text",
      content: "",
      order: updatedGuides[guideIndex].items.length,
    };
    updatedGuides[guideIndex].items.push(newItem);
    setGuides(updatedGuides);
  };

  const removeItemFromGuide = (guideIndex, itemIndex) => {
    const updatedGuides = [...guides];
    if (updatedGuides[guideIndex].items.length > 1) {
      updatedGuides[guideIndex].items.splice(itemIndex, 1);
      // Reorder items
      updatedGuides[guideIndex].items = updatedGuides[guideIndex].items.map((item, index) => ({
        ...item,
        order: index,
      }));
      setGuides(updatedGuides);
    }
  };

  const updateItem = (guideIndex, itemIndex, field, value) => {
    const updatedGuides = [...guides];
    updatedGuides[guideIndex].items[itemIndex][field] = value;
    setGuides(updatedGuides);
  };

  const handleFileUpload = async (guideIndex, itemIndex, file) => {
    if (!file) return;

    setLoading(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("upload_preset", "tempelate");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/ddyhobnzf/image/upload`,
        { method: "POST", body: uploadForm }
      );

      const data = await response.json();
      if (data.secure_url) {
        updateItem(guideIndex, itemIndex, "content", data.secure_url);
      } else {
        setError("Failed to upload image");
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.subtitle.trim()) {
      setError("Subtitle is required");
      return false;
    }

    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];
      if (!guide.title.trim()) {
        setError(`Guide ${i + 1} title is required`);
        return false;
      }

      for (let j = 0; j < guide.items.length; j++) {
        const item = guide.items[j];
        
        // Only check content for non-button items
        if (item.type !== "button" && !item.content.trim()) {
          setError(`Guide ${i + 1}, Item ${j + 1} content is required`);
          return false;
        }
        
        // Check button-specific fields
        if (item.type === "button") {
          if (!item.buttonText?.trim()) {
            setError(`Guide ${i + 1}, Button ${j + 1} text is required`);
            return false;
          }
          if (!item.buttonLink?.trim()) {
            setError(`Guide ${i + 1}, Button ${j + 1} link is required`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("subtitle", formData.subtitle);
      submissionData.append("backgroundColor", formData.backgroundColor);
      submissionData.append("userId", userId);
      submissionData.append("contentId", contentId);

      // Add guides data
      guides.forEach((guide, guideIndex) => {
        submissionData.append(`guide_${guideIndex}_title`, guide.title);
        
        guide.items.forEach((item, itemIndex) => {
          submissionData.append(`guide_${guideIndex}_item_${itemIndex}_type`, item.type);
          submissionData.append(`guide_${guideIndex}_item_${itemIndex}_content`, item.content);
          
          if (item.type === "button") {
            submissionData.append(`guide_${guideIndex}_item_${itemIndex}_buttonText`, item.buttonText || "Click Here");
            submissionData.append(`guide_${guideIndex}_item_${itemIndex}_buttonLink`, item.buttonLink || "#");
          }
        });
      });

      const response = await fetch("/api/acordial/edit", {
        method: "PUT",
        body: submissionData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update content");
      }

      setSuccess("Accordion content updated successfully!");
      setTimeout(() => {
        router.push(`/acordial/view/${contentId}`);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update content. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const itemTypeIcons = {
    text: Type,
    image: Upload,
    video: Video,
    button: MousePointer,
  };

  const itemTypeLabels = {
    text: "Text",
    image: "Image",
    video: "Video",
    button: "Button",
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edit Accordion Content
          </h1>
          <p className="text-lg text-gray-600">
            Update your interactive guides with multiple content types
          </p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter your subtitle"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                  <input
                    type="color"
                    className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guides */}
          <div className="space-y-6">
            {guides.map((guide, guideIndex) => (
              <motion.div
                key={guideIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Guide {guideIndex + 1}
                  </h3>
                  {guides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGuide(guideIndex)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guide Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={guide.title}
                    onChange={(e) => updateGuideTitle(guideIndex, e.target.value)}
                    placeholder={`Enter guide ${guideIndex + 1} title`}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Items</h4>
                    <button
                      type="button"
                      onClick={() => addItemToGuide(guideIndex)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  {guide.items.map((item, itemIndex) => {
                    const IconComponent = itemTypeIcons[item.type];
                    return (
                      <div key={itemIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-800">
                              {itemTypeLabels[item.type]} Item {itemIndex + 1}
                            </span>
                          </div>
                          {guide.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemFromGuide(guideIndex, itemIndex)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Item Type
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.type}
                              onChange={(e) => updateItem(guideIndex, itemIndex, "type", e.target.value)}
                            >
                              <option value="text">Text</option>
                              <option value="image">Image</option>
                              <option value="video">Video Link</option>
                              <option value="button">Button</option>
                            </select>
                          </div>

                          {item.type === "text" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text Content <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                                value={item.content}
                                onChange={(e) => updateItem(guideIndex, itemIndex, "content", e.target.value)}
                                placeholder="Enter your text content"
                                required
                              />
                            </div>
                          )}

                          {item.type === "image" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-4">
                                <div className="flex space-x-4">
                                  <div className="flex-1">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          handleFileUpload(guideIndex, itemIndex, file);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      type="url"
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={item.content}
                                      onChange={(e) => updateItem(guideIndex, itemIndex, "content", e.target.value)}
                                      placeholder="Or paste image URL"
                                    />
                                  </div>
                                </div>
                                {item.content && (
                                  <div className="mt-4">
                                    <img
                                      src={item.content}
                                      alt="Preview"
                                      className="max-w-xs h-32 object-cover rounded-lg border border-gray-200"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {item.type === "video" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video URL <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="url"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.content}
                                onChange={(e) => updateItem(guideIndex, itemIndex, "content", e.target.value)}
                                placeholder="Enter YouTube or video URL"
                                required
                              />
                            </div>
                          )}

                          {item.type === "button" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Button Text <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.buttonText || ""}
                                  onChange={(e) => updateItem(guideIndex, itemIndex, "buttonText", e.target.value)}
                                  placeholder="Click Here"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Button Link <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="url"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.buttonLink || ""}
                                  onChange={(e) => updateItem(guideIndex, itemIndex, "buttonLink", e.target.value)}
                                  placeholder="https://example.com"
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Guide Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addGuide}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Another Guide</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-lg shadow-sm disabled:opacity-50 transition-all duration-300 text-lg flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{submitting ? "Updating..." : "Update Accordion Content"}</span>
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
