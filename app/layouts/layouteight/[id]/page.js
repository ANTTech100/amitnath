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

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ModernVideoTestimonialLayout() {
  const params = useParams();
  const id = params?.id;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Helper function to render video based on URL
  const renderVideo = (url, size = "normal") => {
    if (!url) return null;
    
    const aspectClass = size === "large" ? "aspect-video" : "aspect-video";
    
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("/")[0];
      }

      if (!videoId) {
        return (
          <div className={`${aspectClass} bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300`}>
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Invalid video URL</p>
            </div>
          </div>
        );
      }

      return (
        <div className={`${aspectClass} rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Video testimonial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    } else {
      return (
        <div className={`${aspectClass} rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black`}>
          <video
            controls
            className="w-full h-full object-cover"
            poster="/video-thumbnail.jpg"
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-black mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-black rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-800">
            Loading testimonials...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border border-gray-200"
        >
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="p-2 bg-red-50 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-black text-white font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Process sections based on order
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
    order: content.sections[sectionId].order || 0,
  }));

  // Sort sections by order
  const sortedSections = sections.sort((a, b) => a.order - b.order);

  // Group sections into testimonials (link -> video -> text pattern)
  const testimonials = [];
  let currentTestimonial = {};
  
  sortedSections.forEach((section) => {
    if (section.type === 'link') {
      // Start new testimonial group
      if (Object.keys(currentTestimonial).length > 0) {
        testimonials.push(currentTestimonial);
      }
      currentTestimonial = { link: section };
    } else if (section.type === 'video') {
      currentTestimonial.video = section;
    } else if (section.type === 'text') {
      currentTestimonial.text = section;
    }
  });
  
  // Add the last testimonial
  if (Object.keys(currentTestimonial).length > 0) {
    testimonials.push(currentTestimonial);
  }

  return (
    <>
        {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Head>
          <title>{content?.heading || "Video Testimonials"}</title>
          <meta name="description" content={content?.subheading || "Professional video testimonials"} />
        </Head>

        {/* Header Section */}
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="py-16 bg-white"
        >
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.h1
              variants={fadeInVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
            >
              {content?.heading}
            </motion.h1>
            <motion.p
              variants={fadeInVariants}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              {content?.subheading}
            </motion.p>
          </div>
        </motion.header>

        {/* First Testimonial - Featured */}
        {testimonials.length > 0 && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-12 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <div className="relative mb-8">
                {renderVideo(testimonials[0]?.video?.value, "large")}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </div>
              
              {/* Featured testimonial text and CTA */}
              {testimonials[0]?.text && (
                <div className="max-w-4xl mx-auto text-center">
                  <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium italic mb-8">
                      {testimonials[0]?.text?.value}
                    </blockquote>
                    
                    {/* CTA Button for first testimonial */}
                    {testimonials[0]?.link && (
                      <motion.a
                        href={testimonials[0]?.link?.value || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-12 py-4 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg"
                      >
                        Click Here to Get Started
                        <svg className="ml-3 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Additional Testimonials Grid */}
        {testimonials.length > 1 && (
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-16 px-6 bg-white"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.slice(1).map((testimonial, index) => (
                  <motion.div
                    key={testimonial.video?.id || index}
                    variants={scaleInVariants}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                      <div className="relative">
                        {renderVideo(testimonial.video?.value)}
                        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          #{index + 2}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="flex space-x-1 mr-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">5.0</span>
                        </div>
                        
                        {/* Testimonial text */}
                        {testimonial.text && (
                          <blockquote className="text-gray-600 text-sm mb-6 italic leading-relaxed">
                            {testimonial.text.value}
                          </blockquote>
                        )}
                        
                        {/* CTA Button for each testimonial */}
                        {testimonial.link && (
                          <motion.a
                            href={testimonial.link.value || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="block w-full text-center px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm"
                          >
                            Click Here to Get Started
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
}