// app/layouts/wireframe/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import DynamicPopup from "@/app/components/DynamicPopup";

// Animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function WireframeLayout() {
  const params = useParams();
  const id = params?.id;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Get template ID from content data
  const templateId = content?.templateId?._id || content?.templateId;

  useEffect(() => {
    if (!id) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/upload`);
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error("Failed to fetch content");
        }

        const matchedContent = data.content.find((item) => item._id === id);
        if (!matchedContent) {
          throw new Error("Content not found");
        }

        setContent(matchedContent);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-blue-600 animate-pulse">
            Loading content...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-200"
        >
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Process sections based on wireframe structure
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const images = sections.filter((section) => section.type === "image");
  const texts = sections.filter((section) => section.type === "text");
  const links = sections.filter((section) => section.type === "link");

  // Background image (first image)
  const backgroundImage = images[0]?.value || "";

  // Brief text sections (all text sections for full width display)
  const briefTexts = texts;

  // Featured image (second image)
  const featuredImage = images[1]?.value || "";

  // Button link (first link section)
  const buttonLink = links[0]?.value || "#";

  // Small gift images (remaining images for bottom section)
  const giftImages = images.slice(2); // All remaining images as small gifts

  // Create linkCards from gift images and remaining links
  const linkCards = [
    ...giftImages.map((img, index) => ({
      id: `gift-${img.id}`,
      value: img.value,
      title: `Gift ${index + 1}`,
      description: "Discover more content",
    })),
    ...links.slice(1).map((link, index) => ({
      id: `link-${link.id}`,
      value: link.value,
      title: `Link ${index + 1}`,
      description: "Explore this resource",
    })),
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, Math.ceil(linkCards.length / 4))
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, Math.ceil(linkCards.length / 4))) %
        Math.max(1, Math.ceil(linkCards.length / 4))
    );
  };

  return (
    <>
      {templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-white">
        <Head>
          <title>{content.heading}</title>
          <meta name="description" content={content.subheading} />
        </Head>

        {/* Header Section with Background Image */}
        <motion.header
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="relative h-96 bg-cover bg-center bg-gray-200"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
            {/* Site Name */}
            <motion.div
              variants={slideInVariants}
              initial="hidden"
              animate="visible"
              className="mb-4"
            ></motion.div>

            {/* Title/Topic */}
            <motion.h1
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              {content.heading}
            </motion.h1>

            {/* Sub Topic */}
            <motion.h2
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed"
            >
              {content.subheading}
            </motion.h2>
          </div>
        </motion.header>

        {/* Brief Text Section (Full Width) */}
        <motion.section
          variants={scaleInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 bg-gray-50"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">
                About This Course
              </h3>
              <div className="space-y-8">
                {briefTexts.map((text, index) => (
                  <motion.div
                    key={text.id}
                    variants={fadeInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                  >
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {text.value ||
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Featured Image Section */}
        {featuredImage && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-16 bg-white"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={featuredImage}
                    alt="Featured Content"
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Call-to-Action Button */}
        <motion.section
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12 bg-gray-50"
        >
          <div className="container mx-auto px-6 text-center">
            <motion.a
              href={buttonLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Get Started Now</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.a>
          </div>
        </motion.section>

        {/* Bottom Link Cards Section with Navigation */}
        {linkCards.length > 0 && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-16 bg-white"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                  Explore More
                </h3>

                <div className="relative">
                  {/* Navigation Arrows */}
                  {linkCards.length > 4 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <svg
                          className="w-6 h-6 text-gray-600"
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
                      </button>

                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <svg
                          className="w-6 h-6 text-gray-600"
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
                      </button>
                    </>
                  )}

                  {/* Link Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {linkCards
                      .slice(currentSlide * 4, (currentSlide + 1) * 4)
                      .map((card, index) => (
                        <motion.div
                          key={card.id}
                          variants={fadeInVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="group cursor-pointer"
                        >
                          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-video bg-gray-200 overflow-hidden">
                              <img
                                src={card.value}
                                alt={card.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                {card.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {/* Pagination Dots */}
                  {linkCards.length > 4 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      {Array.from({
                        length: Math.ceil(linkCards.length / 4),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
}
