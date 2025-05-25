"use client";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function TestimonialImages() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
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

        // Step 2: Find the "Testimonial Images" template
        console.log("Searching for template named 'Testimonial Images'...");
        const testimonialImagesTemplate = templateData.data.find((template) => {
          console.log(
            `Comparing template name: "${template.name}" with "Testimonial Images"`
          );
          return template.name === "Testimonial Images";
        });

        if (!testimonialImagesTemplate) {
          console.log("Template 'Testimonial Images' not found in the data.");
          throw new Error("Template 'Testimonial Images' not found");
        }

        console.log("Found Template:", testimonialImagesTemplate);
        const templateId = testimonialImagesTemplate._id;
        console.log("Template ID:", templateId);

        // Step 3: Fetch content associated with this templateId
        console.log("Fetching content from /api/upload...");
        const contentResponse = await fetch("/api/upload");
        console.log("Content Response Status:", contentResponse.status);
        const contentData = await contentResponse.json();
        console.log("Content Data:", contentData);

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        console.log("All Content Entries:", contentData.content);

        // Step 4: Filter content by templateId
        console.log(`Filtering content for templateId: ${templateId}`);
        const filteredContents = contentData.content.filter((content) => {
          const contentTemplateId = content.templateId._id; // Access the _id from the populated templateId object
          const matches =
            contentTemplateId.toString() === templateId.toString();
          console.log(
            `Content ID: ${content._id}, Template ID: ${contentTemplateId}, Matches: ${matches}`
          );
          return matches;
        });

        if (filteredContents.length === 0) {
          console.log("No content found for this template.");
          throw new Error("No content found for this template");
        }

        console.log("Filtered Content:", filteredContents);
        setContents(filteredContents);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExpandImage = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setExpandedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-gray-800">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-teal-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-xl font-medium text-teal-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-gray-800">
        <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg
            className="h-14 w-14 text-red-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
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
          <p className="text-xl font-medium text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      {contents.map((content, contentIndex) => {
        const sections = Object.keys(content.sections || {}).map(
          (sectionId) => ({
            id: sectionId,
            type: content.sections[sectionId].type,
            value: content.sections[sectionId].value,
          })
        );

        const imageSections = sections.filter(
          (section) => section.type === "image" && section.value
        );

        return (
          <div key={content._id}>
            {contentIndex === 0 && (
              <Head>
                <title>{content.heading} | Testimonial Images</title>
                <meta
                  name="description"
                  content="View our testimonial images!"
                />
              </Head>
            )}

            {/* Heading */}
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-teal-100 mb-6 leading-tight animate-fade-in">
                {content.heading}
              </h1>
            </div>

            {/* Image Grid */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-delayed">
                {imageSections.length > 0 ? (
                  imageSections.map((section, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={section.value}
                        alt={`Testimonial Image ${index + 1}`}
                        className="rounded-xl shadow-lg border border-gray-300 object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => handleExpandImage(section.value)}
                        className="absolute top-2 right-2 bg-teal-500 text-white p-2 rounded-full shadow-md hover:bg-teal-600 transition"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-lg text-teal-200 italic col-span-full text-center">
                    No images available
                  </p>
                )}
              </div>
            </div>

            {/* Expanded Image Overlay */}
            {expandedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
                <div className="relative max-w-4xl w-full p-4">
                  <img
                    src={expandedImage}
                    alt="Expanded Testimonial Image"
                    className="rounded-xl shadow-lg w-full h-auto max-h-[80vh] object-contain"
                  />
                  <button
                    onClick={handleCloseImage}
                    className="absolute top-4 right-4 bg-teal-500 text-white p-2 rounded-full shadow-md hover:bg-teal-600 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 4L4 20M4 4l16 16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {contentIndex < contents.length - 1 && (
              <hr className="max-w-5xl mx-auto my-16 border-t border-gray-600" />
            )}
          </div>
        );
      })}
    </div>
  );
}
