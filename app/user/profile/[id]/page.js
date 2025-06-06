"use client";
import React, { useEffect, useState, use } from "react";
import UserNavbar from "../../Header";

export default function Page({ params }) {
  // Unwrap params Promise using React.use()
  const unwrappedParams = use(params);

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authorization without localStorage
    const checkAuth = () => {
      // For now, we'll assume the user is authorized if they can access this page
      // In a real app, you'd want to implement proper session management
      // using cookies, JWT tokens, or a proper auth library
      setIsAuthorized(true);
    };

    const fetchUserProfile = async () => {
      try {
        console.log(
          "Profile page: Fetching profile for ID:",
          unwrappedParams.id
        );
        const response = await fetch(
          `/api/user/profile/${unwrappedParams.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Profile page: API response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Profile page: API response data:", data);
        setUserData(data.user);
      } catch (err) {
        console.error("Profile page: Fetch error:", err.message);
        setError(err.message || "An error occurred while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchUserProfile();
  }, [unwrappedParams.id]);

  // Loading state
  if (loading) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300 text-lg">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 text-red-200 px-6 py-4 rounded-xl shadow-2xl max-w-md w-full text-center">
            <div className="flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-red-400"
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
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Profile
            </h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // Main profile view
  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              User Profile
            </h1>
            <p className="text-gray-400">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Profile Header Section */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-8 border-b border-purple-500/20">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {userData?.fullName || "User"}
                  </h2>
                  <p className="text-purple-200 text-lg">
                    {userData?.email || "No email provided"}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-purple-100 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Account Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3">
                    <p className="text-gray-100 text-lg font-medium">
                      {userData?.fullName || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3">
                    <p className="text-gray-100 text-lg font-medium">
                      {userData?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                    User ID
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3">
                    <p className="text-gray-100 text-lg font-medium font-mono">
                      {unwrappedParams.id}
                    </p>
                  </div>
                </div>

                {/* Join Date (if available) */}
                {userData?.createdAt && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Member Since
                    </label>
                    <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3">
                      <p className="text-gray-100 text-lg font-medium">
                        {new Date(userData.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  Edit Profile
                </button>
                <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-lg border border-gray-600 transition-all duration-200">
                  Change Password
                </button>
                <button className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold rounded-lg border border-red-500/30 transition-all duration-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Security Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-100 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Security
              </h4>
              <p className="text-gray-300 mb-4">
                Manage your account security settings
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Security Settings →
              </button>
            </div>

            {/* Privacy Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-100 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Privacy
              </h4>
              <p className="text-gray-300 mb-4">
                Control your privacy and data preferences
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Privacy Settings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
