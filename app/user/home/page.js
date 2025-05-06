"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Image,
  Video,
  ExternalLink,
  Search,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../Header";

export default function UserDashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Navbar */}
      <UserNavbar />

      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-purple-100 sm:text-4xl">
              Welcome to SSWORK
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-purple-200 sm:text-lg">
              Create content using the templates available to you
            </p>
            <div className="mt-6">
              <Link
                href="/user/tem"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-300"
              >
                Browse Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Available Templates Section */}
      <div
        id="templates"
        className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-purple-100 mb-6"
        >
          Available Templates
        </motion.h2>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-12 py-3 bg-gray-800 border border-purple-500/30 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Search templates..."
            />
          </div>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Blog Post",
              icon: FileText,
              description:
                "Create a text-based blog post with title, content and optional image",
              id: "blog-post",
            },
            {
              name: "Photo Gallery",
              icon: Image,
              description:
                "Upload multiple images with captions in a gallery format",
              id: "gallery",
            },
            {
              name: "Video Content",
              icon: Video,
              description: "Upload a video with title, description and tags",
              id: "video",
            },
          ].map((template) => (
            <motion.div
              key={template.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-xl shadow-lg border border-purple-500/30 cursor-pointer hover:shadow-purple-500/20 transition-all duration-300"
              onClick={() => (window.location.href = "/user/tem")}
            >
              <div className="px-4 py-5 sm:p-6 flex items-center">
                <div className="flex-shrink-0 bg-purple-500/20 rounded-md p-3">
                  <template.icon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-purple-100">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {template.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template Cards */}
      </div>

      {/* Selected Template Form */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-purple-100 mb-4">
                  {selectedTemplate === "blog-post" && "Create Blog Post"}
                  {selectedTemplate === "gallery" && "Create Photo Gallery"}
                  {selectedTemplate === "video" && "Upload Video Content"}
                </h3>

                {/* Dynamic Form Based on Template */}
                {selectedTemplate === "blog-post" && (
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full bg-gray-900 border border-purple-500/30 rounded-xl py-2 px-3 text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Content
                      </label>
                      <textarea
                        id="content"
                        rows="6"
                        className="mt-1 block w-full bg-gray-900 border border-purple-500/30 rounded-xl py-2 px-3 text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Featured Image
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/30 border-dashed rounded-xl">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-purple-400" />
                          <div className="flex text-sm text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-purple-500/30 rounded-xl hover:bg-gray-800"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {selectedTemplate === "gallery" && (
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="gallery-title"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Gallery Title
                      </label>
                      <input
                        type="text"
                        id="gallery-title"
                        className="mt-1 block w-full bg-gray-900 border border-purple-500/30 rounded-xl py-2 px-3 text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Upload Images
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/30 border-dashed rounded-xl">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-purple-400" />
                          <div className="flex text-sm text-gray-400">
                            <label
                              htmlFor="images-upload"
                              className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300"
                            >
                              <span>Upload files</span>
                              <input
                                id="images-upload"
                                name="images-upload"
                                type="file"
                                multiple
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-purple-500/30 rounded-xl hover:bg-gray-800"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {selectedTemplate === "video" && (
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="video-title"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Video Title
                      </label>
                      <input
                        type="text"
                        id="video-title"
                        className="mt-1 block w-full bg-gray-900 border border-purple-500/30 rounded-xl py-2 px-3 text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="video-description"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="video-description"
                        rows="3"
                        className="mt-1 block w-full bg-gray-900 border border-purple-500/30 rounded-xl py-2 px-3 text-gray-200 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Upload Video
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/30 border-dashed rounded-xl">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-purple-400" />
                          <div className="flex text-sm text-gray-400">
                            <label
                              htmlFor="video-upload"
                              className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300"
                            >
                              <span>Upload a video</span>
                              <input
                                id="video-upload"
                                name="video-upload"
                                type="file"
                                accept="video/*"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            MP4, MOV, AVI up to 500MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-purple-500/30 rounded-xl hover:bg-gray-800"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Content Section */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-purple-100 mb-6"
        >
          My Content
        </motion.h2>

        {/* Empty State */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-12 bg-gray-800 rounded-xl shadow-lg border border-purple-500/30"
        >
          <FileText className="mx-auto h-12 w-12 text-purple-400" />
          <h3 className="mt-2 text-sm font-medium text-purple-100">
            No content yet
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Get started by creating content from a template.
          </p>
          <div className="mt-6">
            <Link
              href="/user/tem"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-300"
            >
              Browse Templates
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
