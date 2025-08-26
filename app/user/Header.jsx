"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserNavbar = () => {
  const [abc, setAbc] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check for userid in localStorage on mount
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    console.log("UserID from localStorage:", userid);
    setIsLoggedIn(!!userid);
    setAbc(userid || "");
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setAbc("");
    setIsMenuOpen(false);
    router.push("/");
  };

  // Handle profile click
  const handleProfileClick = () => {
    const userid = localStorage.getItem("userid");
    console.log("Header: Profile clicked, navigating with userid:", userid);
    if (userid) {
      try {
        router.push(`/user/profile/${userid}`);
      } catch (error) {
        console.error("Header: Navigation error:", error.message);
        window.location.href = `/user/profile/${userid}`;
      }
    } else {
      router.push("/user/register");
    }
  };

  return (
    <nav className="relative bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-b border-purple-400/20 backdrop-blur-xl shadow-lg">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/8 to-pink-600/5 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-black text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-blue-300 transition-all duration-500 transform hover:scale-110"
              >
                Codeless
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-12">
              <div className="flex items-center space-x-2">
                {[
                  { href: "/", label: "Home", icon: "🏠" },
                  { href: "/user/tem", label: "Templates", icon: "📋" },
                  { href: "/publish", label: "Uploads", icon: "📤" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-4 py-2 rounded-xl text-sm font-semibold text-gray-100 hover:text-white transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 rounded-xl transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-all duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      <span className="text-xs">{item.icon}</span>
                      {item.label}
                    </span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleProfileClick}
                className="group relative px-4 py-2 rounded-xl text-sm font-semibold text-gray-100 hover:text-white transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/20 group-hover:to-teal-600/20 rounded-xl transition-all duration-300"></div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-all duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <span className="text-xs">👤</span>
                  Profile
                </span>
              </button>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="group relative px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <span className="text-xs">🚪</span>
                    Logout
                  </span>
                </button>
              ) : (
                <Link
                  href="/user/register"
                  className="group relative px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <span className="text-xs">✨</span>
                    Register
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative inline-flex items-center justify-center p-2 rounded-xl text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 rounded-xl transition-all duration-300"></div>
              <svg
                className="relative h-6 w-6 transition-transform duration-300"
                style={{
                  transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
      <div
        className={`md:hidden bg-indigo-900/90 backdrop-blur-xl border-t border-purple-400/20 shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen
          ? "max-h-96 opacity-100 visible"
          : "max-h-0 opacity-0 invisible"
          }`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/user/tem", label: "Templates", icon: "📋" },
            { href: "/publish", label: "Uploads", icon: "📤" },
            {
              href: "#",
              label: "Profile",
              icon: "👤",
              onClick: handleProfileClick,
            },
            isLoggedIn
              ? {
                href: "#",
                label: "Logout",
                icon: "🚪",
                onClick: handleLogout,
              }
              : { href: "/user/register", label: "Register", icon: "✨" },
          ].map((item, index) => (
            <div
              key={item.href}
              className="group"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isMenuOpen
                  ? "fadeInUp 0.3s ease-out forwards"
                  : "none",
              }}
            >
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${item.label === "Logout"
                    ? "bg-gradient-to-r from-red-600/80 to-pink-600/80 text-white hover:from-red-700 hover:to-pink-700 shadow-lg"
                    : "text-gray-100 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20"
                    }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${item.label === "Register"
                    ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
                    : "text-gray-100 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default UserNavbar;
