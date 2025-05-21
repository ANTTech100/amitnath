// pages/layoutone.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Head from "next/head";

export default function LayoutOne() {
  const [templateData, setTemplateData] = useState({
    heading: "",
    subheading: "",
  });
  const [contentData, setContentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // IDs provided
  const templateId = "682cb700051ac17f87283deb";
  const contentId = "682cb820051ac17f87283df8";

  // Fetch template data (heading and subheading)
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axios.get(
          `/api/admin/templatecreate/${templateId}`
        );
        if (response.data.success) {
          setTemplateData({
            heading: response.data.data.heading || "Default Heading",
            subheading: response.data.data.subheading || "Default Subheading",
          });
        } else {
          setError("Failed to fetch template data");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError("Failed to fetch template data");
      }
    };

    // Fetch content data (video, image, text)
    const fetchContentData = async () => {
      try {
        const response = await axios.get(`/api/upload`);
        const contents = response.data.content;
        const content = contents.find((item) => item._id === contentId);
        if (content) {
          setContentData(content.sections || {});
        } else {
          setError("Content not found");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to fetch content data");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTemplateData(), fetchContentData()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper to render YouTube video
  const renderVideo = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return (
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg shadow-lg"
      />
    );
  };

  // Helper to render image
  const renderImage = (url) => (
    <Image
      src={url}
      alt="Section Image"
      width={600}
      height={400}
      className="rounded-lg shadow-lg object-cover"
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>{templateData.heading} | Lead Magnet</title>
        <meta name="description" content={templateData.subheading} />
      </Head>

      {/* Header Section */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-indigo-600">LeadMagnet</div>
          {/* Navigation */}
          <nav className="space-x-6">
            <a href="#features" className="text-gray-600 hover:text-indigo-600">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Heading (H1) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
            {templateData.heading}
          </h1>
          {/* Subheading (H2/H3) */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-600 mb-8">
            {templateData.subheading}
          </h2>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Mockup Image/Video */}
          <div className="space-y-6">
            {contentData["section-1747760809203"]?.type === "video" && (
              <div>
                {renderVideo(contentData["section-1747760809203"].value)}
              </div>
            )}
            {contentData["section-1747760847335"]?.type === "image" && (
              <div>
                {renderImage(contentData["section-1747760847335"].value)}
              </div>
            )}
          </div>

          {/* Right: Text and Buttons */}
          <div className="space-y-6">
            {/* Text */}
            {contentData["section-1747760851855"]?.type === "text" && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {contentData["section-1747760851855"].value}
              </p>
            )}
            {/* Additional Image */}
            {contentData["section-1747760868285"]?.type === "image" && (
              <div>
                {renderImage(contentData["section-1747760868285"].value)}
              </div>
            )}
            {/* Buttons */}
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
                Download Your Copy Here
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 LeadMagnet. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
