"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminFeedback from "../Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNonValidated, setShowNonValidated] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/register");

        const fetchedUsers = response.data.users;

        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleValidationChange = async (email, validated) => {
    try {
      await axios.put("/api/user/register", { email, validated });

      setUsers(
        users.map((user) =>
          user.email === email ? { ...user, validated } : user
        )
      );
    } catch (err) {
      setError("Failed to update user validation status.");
      console.error("Error updating user validation:", err);
    }
  };

  const toggleShowNonValidated = () => {
    setShowNonValidated(!showNonValidated);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-blue-400 text-xl font-medium">
          Loading users...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl font-medium">{error}</div>
      </div>
    );

  const displayedUsers = showNonValidated
    ? users.filter((user) => !user.validated)
    : users;

  return (
    <>
      <AdminFeedback></AdminFeedback>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-blue-400">
              User Management Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage all registered users and their validation status
            </p>
          </header>

          <button
            onClick={toggleShowNonValidated}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer mb-4"
          >
            {showNonValidated ? "Show All Users" : "Show Non-Validated"}
          </button>

          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-400">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-400">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-400">
                      Password
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {displayedUsers.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-12 text-center text-gray-400"
                        colSpan={5}
                      >
                        No users found in the database.
                      </td>
                    </tr>
                  ) : (
                    displayedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                            {user.password}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.validated
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {user.validated ? "Validated" : "Not Validated"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleValidationChange(
                                user.email,
                                !user.validated
                              )
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              user.validated
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {user.validated ? "Revoke Access" : "Validate User"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
