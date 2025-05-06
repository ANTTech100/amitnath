"use client";
// pages/admin/index.js
import { useState, useEffect } from "react";
import Head from "next/head";
import AdminNavbar from "../Navbar";
import Link from "next/link";
import axios from "axios";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeTemplates: 0,
    pendingUploads: 0,
  });

  const getusers = async () => {
    const response = await axios.get("/api/user/register").then((res) => {
      console.log(res.data.users.length);
      setStats((prevStats) => ({
        ...prevStats,

        totalUsers: res.data.users.length || 0, // Update activeTemplates with the response length
      }));
    });
  };
  useEffect(() => {
    axios
      .get("/api/admin/templatecreate")
      .then((res) => {
        setStats((prevStats) => ({
          ...prevStats,
          activeTemplates: res.data.data.length || 0, // Update activeTemplates with the response length
        }));
        getusers();
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
      });
  }, []);

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await fetch("/api/admin/dashboard/stats");
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent activities
        const activitiesResponse = await fetch(
          "/api/admin/dashboard/activities"
        );
        if (!activitiesResponse.ok) {
          throw new Error("Failed to fetch recent activities");
        }
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData);
      } catch (error) {
        setError("Error loading dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApprove = async (activityId) => {
    try {
      const response = await fetch(
        `/api/admin/activities/${activityId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve activity");
      }

      // Update the activities list
      setRecentActivities(
        recentActivities.map((activity) =>
          activity._id === activityId || activity.id === activityId
            ? { ...activity, status: "Approved" }
            : activity
        )
      );

      // Update stats
      if (stats.pendingApprovals > 0) {
        setStats({
          ...stats,
          pendingApprovals: stats.pendingApprovals - 1,
        });
      }
    } catch (error) {
      console.error("Error approving activity:", error);
      alert("Failed to approve. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //       <div className="text-center bg-white p-8 rounded-lg shadow-md">
  //         <div className="text-red-500 text-4xl mb-4">⚠️</div>
  //         <h2 className="text-xl font-semibold text-gray-900 mb-2">
  //           Something went wrong
  //         </h2>
  //         <p className="text-gray-600 mb-4">{error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard | Template Hub</title>
        <meta
          name="description"
          content="Admin dashboard for template management system"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminNavbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stats.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link
                    href="/admin/users"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all users
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Templates */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Templates
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stats.activeTemplates}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link
                    href="/admin/tempall"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Manage tempalate
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Uploads */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Uploads
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stats.pendingUploads}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link
                    href="/admin/uploads"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Review uploads
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="px-4 mt-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activities
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                A list of the most recent user activities that might require
                attention.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Activity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivities.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No recent activities found
                      </td>
                    </tr>
                  ) : (
                    recentActivities.map((activity) => (
                      <tr key={activity._id || activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {activity.user.avatar ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={activity.user.avatar}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                                  {activity.user.name?.charAt(0) ||
                                    activity.user.email?.charAt(0) ||
                                    "?"}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.user.name || "Unknown User"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {activity.user.email || "No email available"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {activity.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              activity.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : activity.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : activity.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {activity.status === "Pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleApprove(activity._id || activity.id)
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Reject
                              </button>
                              <Link
                                href={`/admin/activities/${
                                  activity._id || activity.id
                                }`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Details
                              </Link>
                            </div>
                          )}
                          {activity.status !== "Pending" && (
                            <Link
                              href={`/admin/activities/${
                                activity._id || activity.id
                              }`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
              <div className="text-sm">
                <Link
                  href="/admin/activities"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  View all activities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
