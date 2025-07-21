"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function ModernImageGallery() {
  // ========== CONFIGURATION ==========
  const TEMPLATE_NAME = "Testimonial Images"; // Change this to match your template name
  // ===================================

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  // Get template ID from content data
  const templateId = content?.templateId?._id || content?.templateId;

  useEffect(() => {
    if (!id) {
      setError("No content ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch templates
        console.log("Fetching templates from /api/admin/templatecreate...");
        const templateResponse = await fetch("/api/admin/templatecreate");
        console.log("Template Response Status:", templateResponse.status);
        const templateData = await templateResponse.json();
        console.log("Template Data:", templateData);

        if (!templateData.success) {
          throw new Error("Failed to fetch templates");
        }

        console.log("Templates List:", templateData.data);

        // Step 2: Find the specified template
        console.log(`Searching for template named '${TEMPLATE_NAME}'...`);
        const imageGalleryTemplate = templateData.data.find((template) => {
          console.log(
            `Comparing template name: "${template.name}" with "${TEMPLATE_NAME}"`
          );
          return template.name === TEMPLATE_NAME;
        });

        if (!imageGalleryTemplate) {
          console.log(`Template '${TEMPLATE_NAME}' not found in the data.`);
          throw new Error(`Template '${TEMPLATE_NAME}' not found`);
        }

        console.log("Found Template:", imageGalleryTemplate);
        const templateId = imageGalleryTemplate._id;
        console.log("Template ID:", templateId);

        // Step 3: Fetch content by ID
        console.log(`Fetching content for ID: ${id}`);
        const contentResponse = await fetch(`/api/upload`);
        console.log("Content Response Status:", contentResponse.status);
        const contentData = await contentResponse.json();
        console.log("Content Data:", contentData);

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        console.log("All Content Entries:", contentData.content);

        // Step 4: Find content matching the provided ID and templateId
        const matchedContent = contentData.content.find((content) => {
          if (!content.templateId || content.templateId === null) {
            console.log(
              `Content ID: ${content._id}, Template ID: null, Matches: false`
            );
            return false;
          }

          const contentTemplateId = content.templateId._id;
          const matches =
            content._id === id &&
            contentTemplateId.toString() === templateId.toString();
          console.log(
            `Content ID: ${content._id}, Template ID: ${contentTemplateId}, Matches: ${matches}`
          );
          return matches;
        });

        if (!matchedContent) {
          console.log(`Content with ID '${id}' not found for template.`);
          throw new Error("Content not found for this ID");
        }

        console.log("Matched Content:", matchedContent);
        setContent(matchedContent);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Helper function to extract images from sections
  const extractImages = (sections) => {
    const images = [];
    if (sections && typeof sections === "object") {
      Object.keys(sections).forEach((key) => {
        const section = sections[key];
        if (section && section.type === "image" && section.value) {
          images.push(section.value);
        }
      });
    }
    return images;
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-400 border-r-purple-400"></div>
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-pink-400 border-l-blue-400 absolute top-0 left-0 animate-reverse-spin"></div>
          </div>
          <p className="text-xl font-semibold text-white mt-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Loading your gallery...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-red-500/20">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Oops!</h3>
          <p className="text-slate-300 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            No Content Found
          </h3>
          <p className="text-slate-400 text-lg">
            No content found for this ID.
          </p>
        </div>
      </div>
    );
  }

  const images = extractImages(content.sections);

  return (
    <>
      {templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="group">
            {/* Collection Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {content.heading}
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                {content.subheading}
              </p>
              {/* <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-slate-500"> */}
              {/* <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(content.createdAt)}
                </span> */}
              {/* <span className="w-1 h-1 bg-slate-500 rounded-full"></span> */}
              {/* <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {images.length} Images
                </span> */}
              {/* </div> */}
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((imageUrl, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="group/image relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer"
                    onClick={() => openImageModal(imageUrl)}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Image ${imageIndex + 1} from ${content.heading}`}
                        className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                      {/* Hover Content */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover/image:scale-100 transition-transform duration-300">
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
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                      {/* Image Number Badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500/80 to-purple-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                        {imageIndex + 1}
                      </div>
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/image:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
