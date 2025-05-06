"use client";
import React, { useEffect, useState } from "react";

export default function Page({ params }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    console.log("Profile page: UserID from localStorage:", userid); // Debug log
    console.log("Profile page: URL param ID:", params.id); // Debug log

    if (!userid || userid !== params.id) {
      console.log(
        "Profile page: Redirecting to /login due to invalid/missing userid"
      );
      window.location.href = "/login";
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log("Profile page: Fetching profile for ID:", params.id);
        const response = await fetch(`/api/user/profile/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Profile page: API response status:", response.status); // Debug log
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Profile page: API response data:", data); // Debug log
        setUserData(data.user);
      } catch (err) {
        console.error("Profile page: Fetch error:", err.message); // Debug log
        setError(err.message || "An error occurred while fetching profile");
      }
    };

    fetchUserProfile();
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-purple-500/30 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-purple-100 mb-6">
          User Profile
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <p className="text-gray-200 text-lg">{userData.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <p className="text-gray-200 text-lg">{userData.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
