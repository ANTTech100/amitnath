"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import AdminNavbar from "../Navbar";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import useAdminAuth from "@/utils/useAdminAuth";
import apiClient from "@/utils/apiClient";

export default function AdminHome() {
  const { loading: authLoading, admin, error: authError } = useAdminAuth();
  console.log("[AdminHome] useAdminAuth loading:", authLoading, "admin:", admin, "error:", authError);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeTemplates: 0,
    pendingUploads: 0,
    totalResponses: 0,
    totalQuestions: 0,
    monthlyGrowth: 0,
    avgResponseRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [templateUsage, setTemplateUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    if (!admin) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data concurrently
        const [
          usersResponse,
          templatesResponse,
          statsResponse,
          activitiesResponse,
          responsesResponse,
          questionsResponse,
        ] = await Promise.all([
          apiClient
            .get("/api/admin/users")
            .catch(() => ({ data: { users: [] } })),
          apiClient
            .get("/api/admin/templatecreate")
            .catch(() => ({ data: { data: [] } })),
          apiClient.get("/api/admin/dashboard/stats").catch(() => ({
            data: { pendingApprovals: 0, pendingUploads: 0 },
          })),
          apiClient
            .get("/api/admin/dashboard/activities")
            .catch(() => ({ data: [] })),
          apiClient
            .get("/api/user/responses?admin=true")
            .catch(() => ({ data: { data: [] } })),
          apiClient
            .get("/api/admin/questions")
            .catch(() => ({ data: { data: [] } })),
        ]);

        const totalUsers = Array.isArray(usersResponse.data.users) ? usersResponse.data.users.length : 0;
        const totalResponses = responsesResponse.data.data?.length || 0;
        const totalQuestions = questionsResponse.data.data?.length || 0;

        setStats({
          totalUsers,
          activeTemplates: templatesResponse.data.data?.length || 0,
          pendingApprovals: statsResponse.data.pendingApprovals || 0,
          pendingUploads: statsResponse.data.pendingUploads || 0,
          totalResponses,
          totalQuestions,
          monthlyGrowth: null,
          avgResponseRate: totalUsers > 0 ? Math.round((totalResponses / totalUsers) * 100) : 0,
        });

        setRecentActivities(activitiesResponse.data || []);

        // No hardcoded analytics; leave charts empty unless backed by API
        setUserGrowth([]);
        setTemplateUsage([]);
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
  }, [admin]);

  const handleApprove = async (activityId) => {
    try {
      const response = await apiClient.post(
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-400/30 border-b-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-xl font-medium text-blue-200 animate-pulse">Loading Admin Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-blue-200/80">{authError || error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Only show dashboard if authenticated
  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Head>
        <title>Admin Dashboard | Template Hub</title>
        <meta name="description" content="Admin dashboard for template management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminNavbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-blue-200/80">Welcome back! Here&#39;s what&#39;s happening with your platform.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Total Users */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              {typeof stats.monthlyGrowth === 'number' && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-200">+{stats.monthlyGrowth}%</div>
                  <div className="text-sm text-blue-200/60">This month</div>
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers}</div>
            <div className="text-blue-200/80 mb-4">Total Users</div>
            <Link href="/admin/users" className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors">
              View all users →
            </Link>
          </div>

          {/* Active Templates */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-200">Active</div>
                <div className="text-sm text-green-200/60">Templates</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.activeTemplates}</div>
            <div className="text-blue-200/80 mb-4">Active Templates</div>
            <Link href="/admin/tempall" className="text-green-300 hover:text-green-200 text-sm font-medium transition-colors">
              Manage templates →
            </Link>
          </div>

          {/* Total Responses */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-200">{stats.avgResponseRate}%</div>
                <div className="text-sm text-purple-200/60">Response rate</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalResponses}</div>
            <div className="text-blue-200/80 mb-4">Total Responses</div>
            <Link href="/admin/responses" className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors">
              View responses →
            </Link>
          </div>

          {/* Pending Actions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-200">Pending</div>
                <div className="text-sm text-orange-200/60">Actions</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.pendingApprovals + stats.pendingUploads}</div>
            <div className="text-blue-200/80 mb-4">Pending Actions</div>
            <Link href="/admin/uploads" className="text-orange-300 hover:text-orange-200 text-sm font-medium transition-colors">
              Review pending →
            </Link>
          </div>
        </motion.div>

        {/* Charts and Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* User Growth Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              User Growth
            </h3>
            {userGrowth.length > 0 ? (
              <div className="space-y-3">
                {userGrowth.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-blue-200 font-medium">{item.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-blue-900/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(item.users / 400) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold min-w-[3rem]">{item.users}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-blue-200/60">No analytics available yet</div>
            )}
          </div>

          {/* Template Usage Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Template Usage
            </h3>
            {templateUsage.length > 0 ? (
              <div className="space-y-4">
                {templateUsage.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-blue-200 font-medium truncate mr-4">{item.template}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-green-900/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${item.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold min-w-[3rem]">{item.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-blue-200/60">No usage data available yet</div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 mb-12"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/questions" className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-xl text-white text-center hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-semibold">Manage Questions</div>
            </Link>
            <Link href="/admin/responses" className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl text-white text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="font-semibold">View Responses</div>
            </Link>
            <Link href="/admin/tempall" className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl text-white text-center hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="font-semibold">Templates</div>
            </Link>
            <Link href="/admin/users" className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-xl text-white text-center hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div className="font-semibold">Users</div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activities
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">{activity.title || 'New Activity'}</div>
                      <div className="text-blue-200/60 text-sm">{activity.description || 'Activity description'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-200/60 text-sm">{new Date(activity.createdAt || Date.now()).toLocaleDateString()}</div>
                    {activity.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(activity._id || activity.id)}
                        className="text-green-300 hover:text-green-200 text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-blue-200/60">No recent activities</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
