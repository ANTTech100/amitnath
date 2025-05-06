"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, FileText, Trash2, Edit } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      let data;

      switch (tab) {
        case "users":
          response = await axios.get("/api/user/register");
          data = response.data.users;
          console.log("Users data:", data); // Debugging line
          setUsers(Array.isArray(data) ? data : []);
          break;
        case "admins":
          response = await axios.get("/api/admin/register");
          data = response.data;
          setAdmins(Array.isArray(data) ? data : []);
          break;
        case "templates":
          response = await axios.get("/api/admin/templatecreate");
          data = response.data?.data;
          console.log("Templates data:", data); // Debugging line
          setTemplates(Array.isArray(data) ? data : []);
          break;
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email) => {
    try {
      await axios.delete(`/api/user/register?`, { data: { email } });
      fetchData("users");
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleDeleteAdmin = async (email) => {
    try {
      await axios.delete("/api/admin/register", {
        data: { email }, // Send email in the request body
      });
      fetchData("admins");
    } catch (err) {
      setError("Failed to delete admin");
      console.error("Error deleting admin:", err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-purple-200 animate-pulse">
          Loading data...
        </div>
      );
    }

    if (error) {
      return <div className="text-red-400 text-center py-8">{error}</div>;
    }

    switch (activeTab) {
      case "users":
        return (
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              User Management
            </h2>
            {users.length === 0 ? (
              <p className="text-purple-200">No users found</p>
            ) : (
              <table className="min-w-full bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-800">
                  <tr>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      ID
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-purple-700/30 hover:bg-purple-900/20 transition-colors"
                    >
                      <td className="py-4 px-6 text-purple-200">{user._id}</td>
                      <td className="py-4 px-6 text-purple-200">
                        {user.fullName}
                      </td>
                      <td className="py-4 px-6 text-purple-200">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-all duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "admins":
        return (
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Admin Management
            </h2>
            {admins.length === 0 ? (
              <p className="text-purple-200">No admins found</p>
            ) : (
              <table className="min-w-full bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-800">
                  <tr>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      ID
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Admin Code
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-purple-700/30 hover:bg-purple-900/20 transition-colors"
                    >
                      <td className="py-4 px-6 text-purple-200">{admin._id}</td>
                      <td className="py-4 px-6 text-purple-200">
                        {admin.name}
                      </td>
                      <td className="py-4 px-6 text-purple-200">
                        {admin.email}
                      </td>
                      <td className="py-4 px-6 text-purple-200">
                        {admin.adminCode}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteAdmin(admin.email)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-all duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "templates":
        return (
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Template Management
            </h2>
            {templates.length === 0 ? (
              <p className="text-purple-200">No templates found</p>
            ) : (
              <table className="min-w-full bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-800">
                  <tr>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      ID
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Description
                    </th>
                    <th className="py-3 px-6 text-left text-purple-100 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr
                      key={template.id}
                      className="border-b border-purple-700/30 hover:bg-purple-900/20 transition-colors"
                    >
                      <td className="py-4 px-6 text-purple-200">
                        {template.id}
                      </td>
                      <td className="py-4 px-6 text-purple-200">
                        {template.name}
                      </td>
                      <td className="py-4 px-6 text-purple-200">
                        {template.description}
                      </td>
                      <td
                        className="py-4 px-6"
                        onClick={() =>
                          (window.location.href = `/admin/tempall/${template.id}`)
                        }
                      >
                        <button className="p-2 text-purple-300 hover:text-purple-200 hover:bg-purple-700/20 rounded-full transition-all duration-200">
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">
        Admin Dashboard
      </h1>

      <div className="mb-8">
        <div className="flex border-b border-purple-600/30">
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 ${
              activeTab === "users"
                ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg"
                : "text-purple-300 hover:text-white hover:bg-purple-700/30"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} className="mr-3" />
            Users
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 ${
              activeTab === "admins"
                ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg"
                : "text-purple-300 hover:text-white hover:bg-purple-700/30"
            }`}
            onClick={() => setActiveTab("admins")}
          >
            <Shield size={20} className="mr-3" />
            Admins
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-lg transition-all duration-200 ${
              activeTab === "templates"
                ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg"
                : "text-purple-300 hover:text-white hover:bg-purple-700/30"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            <FileText size={20} className="mr-3" />
            Templates
          </button>
        </div>
      </div>

      <div className="bg-purple-950/30 p-8 rounded-xl shadow-2xl backdrop-blur-lg border border-purple-700/30 transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}
