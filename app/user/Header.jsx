"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const UserNavbar = () => {
  const [abc, setAbc] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check for userid in localStorage on mount
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    console.log("UserID from localStorage:", userid); // Debug log
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
        // Fallback to window.location.href if router.push fails
        window.location.href = `/user/profile/${userid}`;
      }
    } else {
      router.push("/login");
    }
  };

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Animation for links
  const linkVariants = {
    hover: { scale: 1.05, color: "#d8b4fe" },
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-blue-900 border-b border-purple-500/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-extrabold text-2xl text-purple-300 hover:text-purple-100 transition-colors duration-300"
              >
                WORK
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/user/tem", label: "Templates" },
                  { href: "/publish", label: "Uploads" },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <Link
                      href={item.href}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-100 hover:bg-purple-600/30 hover:text-purple-100 transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <motion.div variants={linkVariants} whileHover="hover">
                <button
                  onClick={handleProfileClick}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-100 hover:bg-purple-600/30 hover:text-purple-100 transition-colors duration-300"
                >
                  Profile
                </button>
              </motion.div>
              {isLoggedIn ? (
                <motion.button
                  variants={linkVariants}
                  whileHover="hover"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-700 text-white hover:bg-purple-800 transition-colors duration-300"
                >
                  Logout
                </motion.button>
              ) : (
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    href="/user/register"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
                  >
                    Register
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-purple-600/30 focus:outline-none"
            >
              <svg
                className="h-6 w-6 text-purple-300"
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
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-gray-800 border-t border-purple-500/40 shadow-inner"
          >
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
              {[
                { href: "/", label: "Home" },
                { href: "/user/tem", label: "Templates" },
                { href: "/publish", label: "Uploads" },
                { href: "#", label: "Profile", onClick: handleProfileClick },
                isLoggedIn
                  ? { href: "#", label: "Logout", onClick: handleLogout }
                  : { href: "/user/register", label: "Register" },
              ].map((item) => (
                <motion.div
                  key={item.href}
                  variants={linkVariants}
                  whileHover="hover"
                >
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={`block w-full text-left px-4 py-2 rounded-xl text-base font-semibold ${
                        item.label === "Logout"
                          ? "bg-purple-700 text-white hover:bg-purple-800"
                          : "text-gray-100 hover:bg-purple-600/30 hover:text-purple-100"
                      } transition-colors duration-300`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-2 rounded-xl text-base font-semibold text-gray-100 hover:bg-purple-600/30 hover:text-purple-100 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default UserNavbar;
