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

  useEffect(() =>
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching content from /api/upload...");
        const contentResponse = await fetch("/api/upload");
        console.log("Content Response Status:", contentResponse.status);
        const contentData = await contentResponse.json();
        console.log("Content Data:", contentData);

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        console.log("All Content Entries:", contentData.content);
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
    console.log("Video URL:", url);
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
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
    } else if (url.includes("mux.com")) {
      return (
        <div className="relative group">
          <video
            width="100%"
            height="500"
            controls
            src={url}
            className="rounded-2xl shadow-xl border border-gray-100"
          />
        </div>
      );
    } else {
      console.error("Unsupported video platform:", url);
      return <p className="text-red-600">Unsupported video platform</p>;
    }
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
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
  const linkSection = sections.find((section) => section.type === "link");

  const imageTextPairs = [];
  imageSections.forEach((image, index) => {
    const text = textSections[index] || { value: "" };
    imageTextPairs.push({ image, text });
  });

  const initialPairs = imageTextPairs.slice(0, 2);
  const additionalPairs = imageTextPairs.slice(2);

  // Determine text color based on background color
  const isWhiteBackground =
    content.backgroundColor?.toLowerCase() === "#fff" ||
    content.backgroundColor?.toLowerCase() === "#ffffff";
  const textColorClass = isWhiteBackground
    ? {
        heading: "text-gray-900",
        subheading: "text-gray-600",
        text: "text-gray-700",
      }
    : {
        heading: "text-white",
        subheading: "text-white",
        text: "text-white",
      };

  return (
    <div
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: content.backgroundColor || "#FFFFFF" }}
    >
      <Head>
        <title>{content.heading} | Lead Magnet</title>
        <meta name="description" content={content.subheading} />
      </Head>

      <div className="max-w-6xl mx-auto text-center">
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in ${textColorClass.heading}`}
        >
          {content.heading}
        </h1>
        <h2
          className={`text-xl sm:text-2xl lg:text-3xl font-medium mb-16 leading-relaxed animate-fade-in-delayed ${textColorClass.subheading}`}
        >
          {content.subheading}
        </h2>
        {videoSection && (
          <div className="mb-20 animate-fade-in-delayed">
            {renderVideo(videoSection.value)}
          </div>
        )}
        <div className="space-y-20">
          {initialPairs.map((pair, index) => (
            <div
              key={pair.image.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-10 animate-fade-in-delayed`}
            >
              <div className="w-full md:w-1/2">
                {renderImage(pair.image.value)}
              </div>
              <div className="w-full md:w-1/2">
                <p className={`text-lg leading-relaxed ${textColorClass.text}`}>
                  {pair.text.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        {additionalPairs.length > 0 && (
          <div className="mt-20">
            <button
              onClick={() => setShowMoreSections(!showMoreSections)}
              className="flex items-center mx-auto px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 transition"
            >
              <Plus className="mr-2" />
              {showMoreSections ? "Show Less" : "Show More"}
            </button>
            {showMoreSections && (
              <div className="space-y-20 mt-20">
                {additionalPairs.map((pair, index) => (
                  <div
                    key={pair.image.id}
                    className={`flex flex-col ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-10 animate-fade-in-delayed`}
                  >
                    <div className="w-full md:w-1/2">
                      {renderImage(pair.image.value)}
                    </div>
                    <div className="w-full md:w-1/2">
                      <p
                        className={`text-lg leading-relaxed ${textColorClass.text}`}
                      >
                        {pair.text.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {linkSection && linkSection.value && (
          <div className="mt-20">
            <a
              href={linkSection.value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 transition"
            >
              Click Here
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
