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
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function GiftPageLayout() {
  const params = useParams();
  const id = params?.id;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-rose-300 border-t-rose-600 mx-auto"></div>
            <div className="absolute inset-2 animate-pulse">
              <svg className="w-16 h-16 text-rose-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-rose-700 animate-pulse">
            Preparing your gifts...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border border-rose-200"
        >
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold">Oops! {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Process sections based on wireframe structure but optimized for gift page
  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
    order: content.sections[sectionId].order || 0,
  }));

  // Sort sections by order
  const sortedSections = sections.sort((a, b) => a.order - b.order);

  const images = sortedSections.filter((section) => section.type === "image");
  const texts = sortedSections.filter((section) => section.type === "text");
  const links = sortedSections.filter((section) => section.type === "link");
  const videos = sortedSections.filter((section) => section.type === "video");

  // Background image (first image for hero)
  const backgroundImage = images[0]?.value || "";

  // Featured image (second image for showcase)
  const featuredImage = images[1]?.value || "";

  // Gift gallery images (remaining images)
  const giftImages = images.slice(2);

  // Brief text sections
  const briefTexts = texts;

  // Video section
  const videoUrl = videos[0]?.value || "";

  // Button link (first link section)
  const buttonLink = links[0]?.value || "#";

  // Additional links for navigation
  const additionalLinks = links.slice(1);

  // Create gift cards from remaining images and links
  const giftCards = [
    ...giftImages.map((img, index) => ({
      id: `gift-${img.id}`,
      value: img.value,
      title: `Special Gift ${index + 1}`,
      description: "Perfect for your loved ones",
      type: "image"
    })),
    ...additionalLinks.map((link, index) => ({
      id: `link-${link.id}`,
      value: link.value,
      title: `Gift Collection ${index + 1}`,
      description: "Explore amazing gifts",
      type: "link"
    })),
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, Math.ceil(giftCards.length / 6))
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, Math.ceil(giftCards.length / 6))) %
        Math.max(1, Math.ceil(giftCards.length / 6))
    );
  };

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      {templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen" style={{backgroundColor: content.backgroundColor || "#fef7f0"}}>
        <Head>
          <title>{content.heading || "Gift Collection"}</title>
          <meta name="description" content={content.subheading || "Discover amazing gifts"} />
        </Head>

        {/* Hero Section with Background Image */}
        <motion.header
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="relative h-[70vh] bg-cover bg-center bg-gradient-to-r from-rose-400 to-pink-400"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/50 via-pink-900/30 to-purple-900/50"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
            
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-10 left-10 text-yellow-300"
            >
              <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="absolute top-20 right-20 text-yellow-300"
            >
              ✨
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
            >
              {content.heading || "Gift Collection"}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/95 max-w-4xl leading-relaxed drop-shadow-md"
            >
              {content.subheading || "Discover the perfect gifts for every occasion and make moments unforgettable"}
            </motion.h2>

            {/* CTA Button */}
            
          </div>
        </motion.header>

        {/* Brief Text Section */}
        {briefTexts.length > 0 && (
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-br from-orange-50 to-rose-50"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
              
                <div className="space-y-10">
                  {briefTexts.map((text, index) => (
                    <motion.div
                      key={text.id}
                      variants={cardVariants}
                      className="group"
                    >
                      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-orange-100 group-hover:border-rose-200 transform group-hover:-translate-y-2">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed text-lg font-medium">
                              {text.value || `Experience the joy of giving with our carefully curated gift collection. Each item is selected with love and attention to detail, ensuring your special moments become unforgettable memories.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Featured Image Section */}
        {featuredImage && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-20 bg-white"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl group"
                >
                  <img
                    src={featuredImage}
                    alt="Featured Gift"
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDgwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MDAgMjMwVjI3MEg0NDBWMjMwSDQwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PHRleHQgeD0iNDAwIiB5PSIzMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiPkZlYXR1cmVkIEdpZnQ8L3RleHQ+PC9wPgo8L3N2Zz4=";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-2xl font-bold mb-2">Featured Collection</h4>
                    <p className="text-white/90">Handpicked gifts for special occasions</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Video Section */}
        {videoUrl && (
          <motion.section
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto text-center">
            
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl bg-black"
                >
                  {getYouTubeVideoId(videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}`}
                      className="w-full h-[400px] md:h-[500px]"
                      frameBorder="0"
                      allowFullScreen
                      title="Gift Video"
                    ></iframe>
                  ) : (
                    <video
                      src={videoUrl}
                      className="w-full h-[400px] md:h-[500px] object-cover"
                      controls
                      poster="/video-poster.jpg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {buttonLink && (
  <div className="flex justify-center mt-8">
    <motion.a
      href={buttonLink}
      variants={scaleInVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
      Click Here
      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </motion.a>
  </div>
)}


        {/* Gift Gallery Section */}
        {giftCards.length > 0 && (
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-20 bg-white"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-7xl mx-auto">
                <motion.h3
                  variants={fadeInVariants}
                  className="text-4xl font-bold text-center mb-16 text-gray-800"
                >
                  Our Gift Collection
                </motion.h3>

                <div className="relative">
                  {/* Navigation Arrows */}
                  {giftCards.length > 6 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white shadow-xl rounded-full p-4 hover:bg-rose-50 transition-all duration-300 border border-rose-100 hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white shadow-xl rounded-full p-4 hover:bg-rose-50 transition-all duration-300 border border-rose-100 hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Gift Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {giftCards
                      .slice(currentSlide * 6, (currentSlide + 1) * 6)
                      .map((card, index) => (
                        <motion.div
                          key={card.id}
                          variants={cardVariants}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="group cursor-pointer"
                          onClick={() => card.type === 'link' && window.open(card.value, '_blank')}
                        >
                          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-100 group-hover:border-rose-300">
                            <div className="aspect-square bg-gradient-to-br from-rose-50 to-orange-50 overflow-hidden relative">
                              {card.type === 'image' ? (
                                <img
                                  src={card.value}
                                  alt={card.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkVGN0YwIi8+CjxwYXRoIGQ9Ik0xNTAgMTMwVjE3MEgxODBWMTMwSDE1MFoiIGZpbGw9IiNGQjkyOUUiLz4KPHA+PHRleHQgeD0iMTUwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGQjkyOUUiPkdpZnQ8L3RleHQ+PC9wPgo8L3N2Zz4=";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-6xl text-rose-300">🎁</div>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-6">
                              <h4 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-rose-600 transition-colors duration-300">
                                {card.title}
                              </h4>
                              {/* <p className="text-gray-600 text-sm leading-relaxed">
                                {card.description}
                              </p> */}
                              <div className="mt-4 flex items-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-sm font-medium">Explore</span>
                                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {/* Pagination Dots */}
                  {giftCards.length > 6 && (
                    <div className="flex justify-center mt-12 space-x-3">
                      {Array.from({
                        length: Math.ceil(giftCards.length / 6),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === index 
                              ? "bg-rose-500 scale-125" 
                              : "bg-rose-200 hover:bg-rose-300"
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
