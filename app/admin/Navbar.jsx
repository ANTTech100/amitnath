"use client";
// components/admin/Navbar.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      setIsLoggedIn(!!token);
    } catch (e) {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminTokenData");
    } catch (e) {}
    setIsLoggedIn(false);
    router.push("/admin/register");
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/admin/hero" className="font-bold text-xl">
                Admin Dashboard
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/admin/hero"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  User Management
                </Link>
                <Link
                  href="/admin/tempall"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Templates
                </Link>

                <Link
                  href="/admin/feedback"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Reports
                </Link>
                <Link
                  href="/admin/questions"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Questions
                </Link>
                <Link
                  href="/admin/responses"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Responses
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
              {/* <span className="mr-4 text-sm font-medium">Super Admin</span> */}
              {/* <Link
                href="/admin/settings"
                className="p-2 rounded-full hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link> */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/admin/register"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Register
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/admin/hero"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              User Management
            </Link>
            <Link
              href="/admin/temp"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Templates
            </Link>
            <Link
              href="/admin/uploads"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              User Uploads
            </Link>
            <Link
              href="/admin/reports"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Reports
            </Link>
            <Link
              href="/admin/questions"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Questions
            </Link>
            <Link
              href="/admin/responses"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Responses
            </Link>
            <Link
              href="/admin/settings"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Settings
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/admin/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
