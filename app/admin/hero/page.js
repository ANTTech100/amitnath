"use client";
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
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // Check local storage for authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    if (authStatus) {
      const { timestamp } = JSON.parse(authStatus);
      const currentTime = new Date().getTime();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      if (currentTime - timestamp < oneHour) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminAuth");
      }
    }
  }, []);

  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/password", { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            status: "Access Granted",
            timestamp: new Date().getTime(),
          })
        );
        window.location.href = "/admin/register";
        setPasswordError(null);
      } else {
        setPasswordError("Access Denied: Incorrect password");
        setPassword("");
      }
      // route.push("/admin/dashboard");
      // window.location.href = "/admin/register";
    } catch (error) {
      setPasswordError("Error verifying password. Please try again.");
      console.error("Password verification error:", error);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data concurrently
        const [
          usersResponse,
          templatesResponse,
          statsResponse,
          activitiesResponse,
        ] = await Promise.all([
          axios
            .get("/api/user/register")
            .catch(() => ({ data: { users: [] } })),
          axios
            .get("/api/admin/templatecreate")
            .catch(() => ({ data: { data: [] } })),
          axios.get("/api/admin/dashboard/stats").catch(() => ({
            data: { pendingApprovals: 0, pendingUploads: 0 },
          })),
          axios
            .get("/api/admin/dashboard/activities")
            .catch(() => ({ data: [] })),
        ]);

        setStats({
          totalUsers: usersResponse.data.users?.length || 0,
          activeTemplates: templatesResponse.data.data?.length || 0,
          pendingApprovals: statsResponse.data.pendingApprovals || 0,
          pendingUploads: statsResponse.data.pendingUploads || 0,
        });
        setRecentActivities(activitiesResponse.data || []);
      } catch (error) {
        setError(
          "Error loading dashboard data. Please check API endpoints or try again later."
        );
        console.error("Fetch dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  const handleApprove = async (activityId) => {
    try {
      const response = await axios.post(
        `/api/admin/activities/${activityId}/approve`
      );
      if (response.status !== 200) {
        throw new Error("Failed to approve activity");
      }

      setRecentActivities(
        recentActivities.map((activity) =>
          activity._id === activityId || activity.id === activityId
            ? { ...activity, status: "Approved" }
            : activity
        )
      );

      if (stats.pendingApprovals > 0) {
        setStats((prev) => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
        }));
      }
    } catch (error) {
      console.error("Error approving activity:", error);
      alert("Failed to approve. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Access
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard | Template Hub</title>
        <meta
          name="description"
          content="Admin dashboard for template management system"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminNavbar />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-blue-600"
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
                      <dt className="text-sm font-medium text-gray-500">
                        Total Users
                      </dt>
                      <dd className="text-3xl font-bold text-gray-900">
                        {stats.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all users
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 bg-green

-100 rounded-md p-3"
                  >
                    <svg
                      className="h-6 w-6 text-green-600"
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
                      <dt className="text-sm font-medium text-gray-500">
                        Active Templates
                      </dt>
                      <dd className="text-3xl font-bold text-gray-900">
                        {stats.activeTemplates}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <Link
                  href="/admin/tempall"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Manage templates
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-purple-600"
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
                      <dt className="text-sm font-medium text-gray-500">
                        Pending Uploads
                      </dt>
                      <dd className="text-3xl font-bold text-gray-900">
                        {stats.pendingUploads}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <Link
                  href="/admin/uploads"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Review uploads
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
