// Your Published Content Page
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
  Eye,
  Share2,
  Edit,
} from "lucide-react";

// Your Published Content Templates
const templates = [
  {
    name: "Landing Page",
    description: "A sleek page to capture leads and drive conversions.",
    redirect: "/layouts/layoutone",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    icon: Layout,
    type: "marketing",
    usageCount: 1250,
    views: 5420,
    publishedDate: "2024-01-15",
  },
  {
    name: "Payment Page",
    description: "Showcase your pricing tiers with stunning visuals.",
    redirect: "/layouts/layouttwo",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-500/10",
    iconColor: "text-rose-400",
    icon: CreditCard,
    type: "commerce",
    usageCount: 890,
    views: 3840,
    publishedDate: "2024-01-20",
  },
  {
    name: "Thank You Page",
    description: "Thank you greeting message for completed actions.",
    redirect: "/layouts/layoutthree",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-400",
    icon: Heart,
    type: "conversion",
    usageCount: 670,
    views: 2890,
    publishedDate: "2024-01-25",
  },
  {
    name: "Testimonial Image",
    description: "Display customer testimonials to build trust.",
    redirect: "/layouts/layoutfour",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-400",
    icon: Image,
    type: "social proof",
    usageCount: 540,
    views: 2150,
    publishedDate: "2024-02-01",
  },
  {
    name: "Testimonial",
    description: "Encourage users to subscribe to your newsletter.",
    redirect: "/layouts/layoutfive",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    icon: MessageSquare,
    type: "social proof",
    usageCount: 430,
    views: 1780,
    publishedDate: "2024-02-05",
  },
  {
    name: "All Products",
    description: "Advertise your upcoming event with style.",
    redirect: "/layouts/layoutsix",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    icon: Package,
    type: "catalog",
    usageCount: 720,
    views: 3120,
    publishedDate: "2024-02-10",
  },
  {
    name: "Gift Page",
    description: "Showcase your best gifts in a professional layout.",
    redirect: "/layouts/layoutseven",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    iconColor: "text-pink-400",
    icon: Gift,
    type: "promotion",
    usageCount: 380,
    views: 1650,
    publishedDate: "2024-02-15",
  },
  {
    name: "Video Testimonial",
    description: "Present detailed case studies to build credibility.",
    redirect: "/layouts/layouteight",
    color: "from-sky-500 to-cyan-600",
    bgColor: "bg-sky-500/10",
    iconColor: "text-sky-400",
    icon: Video,
    type: "social proof",
    usageCount: 290,
    views: 1280,
    publishedDate: "2024-02-20",
  },
  {
    name: "Main Thank You",
    description: "Display customer testimonials to boost trust.",
    redirect: "/layouts/layoutnine",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-400",
    icon: CheckCircle,
    type: "conversion",
    usageCount: 510,
    views: 2210,
    publishedDate: "2024-02-25",
  },
  {
    name: "Basic",
    description: "Showcase your pricing tiers with clarity.",
    redirect: "/layouts/layoutten",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-400",
    icon: FileText,
    type: "basic",
    usageCount: 820,
    views: 3560,
    publishedDate: "2024-03-01",
  },
  {
    name: "Form",
    description: "Highlight your latest blog posts to engage readers.",
    redirect: "/layouts/layouteleven",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-400",
    icon: BookPlus,
    type: "lead capture",
    usageCount: 640,
    views: 2780,
    publishedDate: "2024-03-05",
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

export default function YourPublishedContent() {
  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
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
              Back to Dashboard
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-cyan-200 mb-4">
              Your Published Content
            </h1>
            <p className="mt-3 text-xl text-slate-200/80 max-w-3xl mx-auto">
              Manage and view all your published templates. Track performance and engagement metrics.
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
                      scale: 1.03,
                      y: -8,
                    }}
                    className="group cursor-pointer"
                    onClick={() => (window.location.href = template.redirect)}
                  >
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/10 transition-all duration-500 group-hover:border-white/20">
                      {/* Animated gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      ></div>

                      {/* Content */}
                      <div className="relative p-6">
                        {/* Header with icon and actions */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`${template.bgColor} backdrop-blur-sm rounded-xl p-3 group-hover:scale-110 transition-transform duration-300 border border-white/10`}
                          >
                            <IconComponent
                              className={`h-6 w-6 ${template.iconColor}`}
                            />
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                              <Eye className="h-4 w-4 text-white/70" />
                            </button>
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                              <Share2 className="h-4 w-4 text-white/70" />
                            </button>
                          </div>
                        </div>

                        {/* Title and description */}
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-200 group-hover:to-cyan-200 transition-all duration-300">
                          {template.name}
                        </h3>

                        <p className="text-slate-300/70 text-sm leading-relaxed mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Stats and metadata */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-1 bg-white/10 rounded-full text-slate-300 capitalize">
                              {template.type}
                            </span>
                            <span className="text-emerald-400 font-medium">
                              Published {new Date(template.publishedDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-slate-400">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {template.views.toLocaleString()} views
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {template.usageCount} uses
                              </div>
                            </div>
                          </div>

                          {/* Progress bar for engagement */}
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full bg-gradient-to-r ${template.color} transition-all duration-1000`}
                              style={{ width: `${Math.min((template.views / 5000) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Hover action indicator */}
                        <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs text-emerald-300 font-medium">
                            Click to manage
                          </span>
                          <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform duration-300" />
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
