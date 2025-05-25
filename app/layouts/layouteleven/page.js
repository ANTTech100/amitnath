"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PaymentPageCards() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

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

        // Step 2: Find the "form" template
        console.log("Searching for template named 'form'...");
        const paymentPageTemplate = templateData.data.find((template) => {
          console.log(
            `Comparing template name: "${template.name}" with "form"`
          );
          return template.name === "form";
        });

        if (!paymentPageTemplate) {
          console.log("Template 'form' not found in the data.");
          throw new Error("Template 'form' not found");
        }

        console.log("Found Template:", paymentPageTemplate);
        const templateId = paymentPageTemplate._id;
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
          const contentTemplateId = content.templateId._id;
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

  const handleCardClick = (id) => {
    router.push(`/layouts/layouteleven/${id}`);
  };

  // Array of gradient background colors for cards
  const gradientColors = [
    "bg-gradient-to-br from-teal-500 to-teal-800",
    "bg-gradient-to-br from-indigo-500 to-indigo-800",
    "bg-gradient-to-br from-purple-500 to-purple-800",
    "bg-gradient-to-br from-blue-500 to-blue-800",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
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
          <p className="text-xl Hh font-medium text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Head>
          <title>Form Pages</title>
          <meta name="description" content="Explore our Form Pages!" />
        </Head>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-12 text-center leading-tight animate-fade-in">
          Form Pages
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-delayed">
          {contents.map((content, index) => (
            <div
              key={content._id}
              className={`${
                gradientColors[index % gradientColors.length]
              } rounded-xl shadow-lg p-6 flex items-center justify-center h-48 cursor-pointer transition-transform duration-300 hover:scale-105`}
              onClick={() => handleCardClick(content._id)}
            >
              <h2 className="text-2xl font-semibold text-white text-center">
                {content.heading}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
