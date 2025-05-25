"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { Plus } from "lucide-react";

export default function LayoutOne() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMoreSections, setShowMoreSections] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch all content
        console.log("Fetching content from /api/upload...");
        const contentResponse = await fetch("/api/upload");
        console.log("Content Response Status:", contentResponse.status);
        const contentData = await contentResponse.json();
        console.log("Content Data:", contentData);

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        console.log("All Content Entries:", contentData.content);

        // Step 2: Find the content with the specific ID
        console.log(`Filtering content for ID: ${id}`);
        const filteredContent = contentData.content.find((content) => {
          const matchesId = content._id.toString() === id;
          console.log(`Content ID: ${content._id}, Matches ID: ${matchesId}`);
          return matchesId;
        });

        if (!filteredContent) {
          console.log("No content found for this ID.");
          throw new Error("No content found for this ID");
        }

        console.log("Filtered Content:", filteredContent);
        setContent(filteredContent);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const renderVideo = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return (
      <div className="relative group">
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-2xl shadow-xl border border-gray-100 transition-transform duration-300 group-hover:scale-102"
        />
      </div>
    );
  };

  const renderImage = (url) => (
    <div className="relative group">
      <img
        src={url}
        alt="Section Image"
        width={450}
        height={300}
        className="rounded-2xl shadow-xl border border-gray-100 object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-700 mx-auto mb-4"
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
          <p className="text-xl font-medium text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <svg
            className="h-14 w-14 text-red-600 mx-auto mb-4"
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
          <p className="text-xl font-medium text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-800">No content found.</p>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const videoSection = sections.find((section) => section.type === "video");
  const imageSections = sections.filter(
    (section) => section.type === "image" && section.value
  );
  const textSections = sections.filter(
    (section) => section.type === "text" && section.value
  );

  const imageTextPairs = [];
  imageSections.forEach((image, index) => {
    const text = textSections[index] || { value: "" };
    imageTextPairs.push({ image, text });
  });

  const initialPairs = imageTextPairs.slice(0, 2);
  const additionalPairs = imageTextPairs.slice(2);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{content.heading} | Lead Magnet</title>
        <meta name="description" content={content.subheading} />
      </Head>

      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
          {content.heading}
        </h1>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-600 mb-16 leading-relaxed animate-fade-in-delayed">
          {content.subheading}
        </h2>
        {videoSection && (
          <div className="mb-20 animate-fade-in-delayed">
            {renderVideo(videoSection.value)}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto space-y-20">
        {initialPairs.map((pair, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-delayed"
          >
            <div className="order-1 lg:order-1">
              {pair.image && <div>{renderImage(pair.image.value)}</div>}
            </div>
            <div className="order-2 lg:order-2">
              {pair.text && pair.text.value ? (
                <p className="text-lg text-gray-700 leading-relaxed font-light">
                  {pair.text.value}
                </p>
              ) : (
                <p className="text-lg text-gray-500 leading-relaxed italic font-light">
                  No description available for this section.
                </p>
              )}
            </div>
          </div>
        ))}

        {additionalPairs.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => setShowMoreSections(!showMoreSections)}
              className="flex items-center mx-auto text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-300"
            >
              <Plus className="w-6 h-6 mr-2" />
              {showMoreSections ? "Hide More Sections" : "Show More Sections"}
            </button>
          </div>
        )}

        {showMoreSections &&
          additionalPairs.map((pair, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-delayed"
            >
              <div className="order-1 lg:order-1">
                {pair.image && <div>{renderImage(pair.image.value)}</div>}
              </div>
              <div className="order-2 lg:order-2">
                {pair.text && pair.text.value ? (
                  <p className="text-lg text-gray-700 leading-relaxed font-light">
                    {pair.text.value}
                  </p>
                ) : (
                  <p className="text-lg text-gray-500 leading-relaxed italic font-light">
                    No description available for this section.
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="max-w-6xl mx-auto text-center mt-20 animate-fade-in-delayed">
        <button className="px-10 py-4 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:from-indigo-800 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
          Download Your Copy Here
        </button>
      </div>
    </div>
  );
}
