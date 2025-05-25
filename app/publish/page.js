// pages/ContentViewPage.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../user/Header";
import Link from "next/link";

// Template data with names, descriptions, redirects, and gradient styles
const templates = [
  {
    name: "Landing Page",
    description: "A sleek page to capture leads and drive conversions.",
    redirect: "/layouts/layoutone",
    gradient: "from-purple-900 to-blue-900",
  },
  {
    name: "Payment Page",
    description: "Showcase your pricing tiers  with stunning visuals.",
    redirect: "/layouts/layouttwo",
    gradient: "from-blue-900 to-indigo-900",
  },
  {
    name: "Thankyou page",
    description: "Thankyou greeting message .",
    redirect: "/layouts/layoutthree",
    gradient: "from-indigo-900 to-purple-900",
  },
  {
    name: "Testimonial Image",
    description: "Display customer testimonials to build trust.",

    redirect: "/layouts/layoutfour",
    gradient: "from-purple-800 to-blue-800",
  },
  {
    name: "Testimonial",
    description: "Encourage users to subscribe to your newsletter.",
    redirect: "/layouts/layoutfive",
    gradient: "from-blue-800 to-indigo-800",
  },
  {
    name: "All Products",
    description: "Advertise your upcoming event with style.",
    redirect: "/layouts/layoutsix",
    gradient: "from-indigo-800 to-purple-800",
  },
  {
    name: "Gift Page",
    description: "Showcase your best Gift in a professional layout.",
    redirect: "/layouts/layoutseven",
    gradient: "from-purple-900 to-indigo-900",
  },
  {
    name: "Video Testimonial ",
    description: "Present detailed case studies to build credibility.",
    redirect: "/layouts/layouteight",
    gradient: "from-blue-900 to-purple-900",
  },
  {
    name: "MainThankyou Page",
    description: "Display customer testimonials to boost trust.",
    redirect: "/layouts/layoutnine",
    gradient: "from-indigo-900 to-blue-900",
  },
  {
    name: "Basic",
    description: "Showcase your pricing tiers with clarity.",
    redirect: "/layouts/layoutten",
    gradient: "from-purple-800 to-indigo-800",
  },

  {
    name: "form",
    description: "Highlight your latest blog posts to engage readers.",
    redirect: "/layouts/layouteleven",
    gradient: "from-indigo-800 to-blue-800",
  },
];

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

export default function ContentViewPage() {
  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Content List
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-purple-200">
              Explore Our Templates
            </h1>
            <p className="mt-3 text-lg text-gray-400">
              Choose a template to create your next lead magnet or content page.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                  }}
                  onClick={() => (window.location.href = template.redirect)}
                  className={`bg-gradient-to-r ${template.gradient} rounded-2xl shadow-lg border border-purple-500/30 p-6 cursor-pointer transition-all duration-300 hover:border-purple-500`}
                >
                  {/* Template Name */}
                  <h2 className="text-xl font-semibold text-purple-200 mb-3">
                    {template.name}
                  </h2>
                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {template.description}
                  </p>
                  {/* Call to Action */}
                  <div className="mt-4">
                    <span className="inline-flex items-center text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">
                      Explore Template
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
