// pages/ContentViewPage.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../user/Header";
import Link from "next/link";
import {
  ArrowRight,
  Layout,
  CreditCard,
  Heart,
  Image,
  MessageSquare,
  Package,
  Gift,
  Video,
  CheckCircle,
  FileText,
  BookPlus,
} from "lucide-react";

// Template data with names, descriptions, redirects, and styling
const templates = [
  {
    name: "Landing Page",
    description: "A sleek page to capture leads and drive conversions.",
    redirect: "/layouts/layoutone",
    color: "from-purple-400 to-blue-400",
    bgColor: "bg-purple-500/20",
    iconColor: "text-purple-300",
    icon: Layout,
    type: "marketing",
    usageCount: 1250,
  },
  {
    name: "Payment Page",
    description: "Showcase your pricing tiers with stunning visuals.",
    redirect: "/layouts/layouttwo",
    color: "from-blue-400 to-indigo-400",
    bgColor: "bg-blue-500/20",
    iconColor: "text-blue-300",
    icon: CreditCard,
    type: "commerce",
    usageCount: 890,
  },
  {
    name: "Thank You Page",
    description: "Thank you greeting message for completed actions.",
    redirect: "/layouts/layoutthree",
    color: "from-indigo-400 to-purple-400",
    bgColor: "bg-indigo-500/20",
    iconColor: "text-indigo-300",
    icon: Heart,
    type: "conversion",
    usageCount: 670,
  },
  {
    name: "Testimonial Image",
    description: "Display customer testimonials to build trust.",
    redirect: "/layouts/layoutfour",
    color: "from-purple-500 to-blue-500",
    bgColor: "bg-purple-600/20",
    iconColor: "text-purple-400",
    icon: Image,
    type: "social proof",
    usageCount: 540,
  },
  {
    name: "Testimonial",
    description: "Encourage users to subscribe to your newsletter.",
    redirect: "/layouts/layoutfive",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-600/20",
    iconColor: "text-blue-400",
    icon: MessageSquare,
    type: "social proof",
    usageCount: 430,
  },
  {
    name: "All Products",
    description: "Advertise your upcoming event with style.",
    redirect: "/layouts/layoutsix",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-600/20",
    iconColor: "text-indigo-400",
    icon: Package,
    type: "catalog",
    usageCount: 720,
  },
  {
    name: "Gift Page",
    description: "Showcase your best gifts in a professional layout.",
    redirect: "/layouts/layoutseven",
    color: "from-purple-600 to-indigo-600",
    bgColor: "bg-purple-700/20",
    iconColor: "text-purple-500",
    icon: Gift,
    type: "promotion",
    usageCount: 380,
  },
  {
    name: "Video Testimonial",
    description: "Present detailed case studies to build credibility.",
    redirect: "/layouts/layouteight",
    color: "from-blue-600 to-purple-600",
    bgColor: "bg-blue-700/20",
    iconColor: "text-blue-500",
    icon: Video,
    type: "social proof",
    usageCount: 290,
  },
  {
    name: "Main Thank You",
    description: "Display customer testimonials to boost trust.",
    redirect: "/layouts/layoutnine",
    color: "from-indigo-600 to-blue-600",
    bgColor: "bg-indigo-700/20",
    iconColor: "text-indigo-500",
    icon: CheckCircle,
    type: "conversion",
    usageCount: 510,
  },
  {
    name: "Basic",
    description: "Showcase your pricing tiers with clarity.",
    redirect: "/layouts/layoutten",
    color: "from-purple-700 to-indigo-700",
    bgColor: "bg-purple-800/20",
    iconColor: "text-purple-600",
    icon: FileText,
    type: "basic",
    usageCount: 820,
  },
  {
    name: "Form",
    description: "Highlight your latest blog posts to engage readers.",
    redirect: "/layouts/layouteleven",
    color: "from-indigo-700 to-blue-700",
    bgColor: "bg-indigo-800/20",
    iconColor: "text-indigo-600",
    icon: BookPlus,
    type: "lead capture",
    usageCount: 640,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <motion.div
                    key={template.id || template._id || index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                    }}
                    className="group cursor-pointer"
                    onClick={() => (window.location.href = template.redirect)}
                  >
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>

                      {/* Content */}
                      <div className="relative p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`${template.bgColor} backdrop-blur-sm rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent
                              className={`h-8 w-8 ${template.iconColor}`}
                            />
                          </div>
                          <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                          {template.name}
                        </h3>

                        <p className="text-purple-200/70 text-sm leading-relaxed line-clamp-3">
                          {template.description}
                        </p>

                        {/* Template metadata */}
                        <div className="mt-4 flex items-center justify-between text-xs text-purple-300/60">
                          <span className="capitalize">
                            {template.type} template
                          </span>
                          {template.usageCount > 0 && (
                            <span>{template.usageCount} uses</span>
                          )}
                        </div>

                        {/* Hover effect indicators */}
                        <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs text-purple-300 font-medium">
                            Click to explore
                          </span>
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
