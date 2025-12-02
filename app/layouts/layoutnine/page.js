"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PaymentPageCards() {
  // ========== CONFIGURATION ==========
  const TEMPLATE_NAME = "MainThankyou Page"; // Change this to match different templates
  // ===================================

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Add this state at the top with your other states
  const [currentUserId, setCurrentUserId] = useState(null);

  // Modified useEffect with user filtering logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user ID from localStorage
        const userIdFromStorage = localStorage.getItem("userid");
        if (!userIdFromStorage) {
          throw new Error("User not logged in");
        }
        setCurrentUserId(userIdFromStorage);

        // Step 1: Fetch templates (existing code)
        console.log("Fetching templates from /api/admin/templatecreate...");
       const templateResponse = await fetch("/api/templatecreate");
        const templateData = await templateResponse.json();

        if (!templateData.success) {
          throw new Error("Failed to fetch templates");
        }

        // Step 2: Find the specified template (existing code)
        const paymentPageTemplate = templateData.data.find((template) => {
          return template.name === TEMPLATE_NAME;
        });

        if (!paymentPageTemplate) {
          throw new Error(`Template '${TEMPLATE_NAME}' not found`);
        }

        const templateId = paymentPageTemplate._id;

        // Step 3: Fetch content (existing code)
        const contentResponse = await fetch("/api/upload");
        const contentData = await contentResponse.json();

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        // Step 4: Filter content by templateId AND createdBy userId
        const filteredContents = contentData.content.filter((content) => {
          // Check if templateId exists and matches
          if (!content.templateId || content.templateId === null) {
            return false;
          }

          const contentTemplateId = content.templateId._id;
          const templateMatches =
            contentTemplateId.toString() === templateId.toString();

          // Check if createdBy matches current user
          const createdByUserId = content.createdBy
            ? content.createdBy.toString()
            : null;
          const userMatches = createdByUserId === userIdFromStorage;

          console.log(`Content ID: ${content._id}`);
          console.log(`Template matches: ${templateMatches}`);
          console.log(
            `User matches: ${userMatches} (${createdByUserId} vs ${userIdFromStorage})`
          );

          // Return true only if both template and user match
          return templateMatches && userMatches;
        });

        if (filteredContents.length === 0) {
          console.log("No content found for this template and user.");
          setContents([]); // Set empty array instead of throwing error
        } else {
          console.log("Filtered Content for user:", filteredContents);
          setContents(filteredContents);
        }
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
    window.open(`/layouts/layoutnine/${id}`, "_blank");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading payment pages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {TEMPLATE_NAME} Templates
            </h1>
            <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto">
              Browse and manage your payment page templates with ease.
            </p>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={() => (window.location.href = "/publish")}
          className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to previous page
        </button>
      </div>
      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((content, index) => (
            <div
              key={content._id}
              className="bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/30 p-6 hover:shadow-xl hover:bg-slate-800/80 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
              onClick={() => handleCardClick(content._id)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100/80 rounded-lg flex items-center justify-center group-hover:bg-blue-200/80 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-slate-300 bg-green-600/80 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              {/* Card Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {content.heading}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-2">
                  {TEMPLATE_NAME} template for seamless transactions and user
                  experience.
                </p>
              </div>

              {/* Card Footer */}
              <div className="space-y-3 pt-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Created
                  </span>
                  <span className="font-medium text-slate-200">
                    {formatDate(content.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center">
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Updated
                  </span>
                  <span className="font-medium text-slate-200">
                    {formatDate(content.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Edit Button - Only show if user is the creator */}
              {currentUserId && content.createdBy && content.createdBy.toString() === currentUserId && (
                <div className="mt-3 pt-3 border-t border-slate-600/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      window.location.href = `/edit/${content._id}`;
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Edit Content
                  </button>
                </div>
              )}

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-blue-400 font-medium mr-1">
                  View Page
                </span>
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {contents.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-700/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No {TEMPLATE_NAME.toLowerCase()}s found
            </h3>
            <p className="text-slate-300">
              Create your first {TEMPLATE_NAME.toLowerCase()} to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
