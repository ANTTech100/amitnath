"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, Calendar, User, ChevronRight, Edit } from "lucide-react";

export default function AccordionPublishPage() {
  const router = useRouter();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchContents(storedUserId);
    } else {
      router.push("/user/register");
      return;
    }
  }, [router]);

  const fetchContents = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/acordial/create?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch contents");
      }

      setContents(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to load contents");
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (contentId) => {
    router.push(`/acordial/view/${contentId}`);
  };

  const handleEditContent = (e, contentId) => {
    e.stopPropagation(); // Prevent card click
    router.push(`/acordial/edit/${contentId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGuideCount = (guides) => {
    return guides ? guides.length : 0;
  };

  const getItemCount = (guides) => {
    if (!guides) return 0;
    return guides.reduce((total, guide) => total + (guide.items ? guide.items.length : 0), 0);
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
          <p className="mt-4 text-lg font-medium text-gray-600">Loading your accordion contents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Accordion Contents
          </h1>
          <p className="text-lg text-gray-600">
            Manage and view all your created accordion content
          </p>
        </motion.div>

        {/* Create New Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <button
            onClick={() => router.push("/acordial/create")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
          >
            Create New Accordion Content
          </button>
        </motion.div>

        {/* Contents Grid */}
        {contents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Eye className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Content Yet</h3>
              <p className="text-gray-600 mb-6">
                You have not created any accordion content yet. Start by creating your first one!
              </p>
              <button
                onClick={() => router.push("/acordial/create")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-all duration-300"
              >
                Create Your First Content
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content, index) => (
              <motion.div
                key={content._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform cursor-pointer overflow-hidden"
                onClick={() => handleViewContent(content._id)}
              >
                {/* Card Header */}
                <div 
                  className="h-32 p-6 flex items-center justify-center"
                  style={{ backgroundColor: content.backgroundColor }}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {content.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getGuideCount(content.guides)}
                      </div>
                      <div className="text-sm text-gray-600">Guides</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getItemCount(content.guides)}
                      </div>
                      <div className="text-sm text-gray-600">Items</div>
                    </div>
                  </div>

                  {/* Guide Preview */}
                  {content.guides && content.guides.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Guides:</h4>
                      <div className="space-y-1">
                        {content.guides.slice(0, 3).map((guide, guideIndex) => (
                          <div key={guideIndex} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                            {guide.title}
                          </div>
                        ))}
                        {content.guides.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{content.guides.length - 3} more guides
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(content.createdAt)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => handleEditContent(e, content._id)}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <div className="flex items-center text-yellow-600 font-semibold">
                        <span className="text-sm">View</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={() => router.push("/user/home")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
