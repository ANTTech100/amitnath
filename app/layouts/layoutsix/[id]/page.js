"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import DynamicPopup from "@/app/components/DynamicPopup";

// CSS animations
const fadeInClass = "animate-fade-in";
const slideInClass = "animate-slide-in";
const scaleInClass = "animate-scale-in";

const PopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const hasSubmitted = sessionStorage.getItem("dataSubmitted");
    if (!hasSubmitted) {
      setIsOpen(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/popop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      sessionStorage.setItem("dataSubmitted", "true");

      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setIsOpen(false);

      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
    setErrors({});
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 2s infinite;
        }
        .animation-delay-1 {
          animation-delay: 0.2s;
        }
        .animation-delay-2 {
          animation-delay: 0.4s;
        }
        .animation-delay-3 {
          animation-delay: 0.6s;
        }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Fill this please
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function LayoutSix() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2"></div>
        </div>

        <div className="text-center z-10 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-transparent border-purple-300 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="mt-6 text-xl font-medium bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent animate-pulse-slow">
            Loading your content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-red-500/30 backdrop-blur-sm relative overflow-hidden animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-red-400 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
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
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Oops! Something went wrong
                </h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-red-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const images = sections.filter((section) => section.type === "image");
  const texts = sections.filter((section) => section.type === "text");
  const links = sections.filter((section) => section.type === "link");

  const backgroundImage = images[0]?.value || "";
  const remainingImages = images.slice(1);

  const contentItems = remainingImages.map((image, index) => ({
    image: image,
    text: texts[index] || null,
    link: links[index] || null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>{content.heading} | Lead Magnet</title>
        <meta name="description" content={content.subheading} />
      </Head>

              {/* <PopupForm /> */}
        {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      <div className="relative">
        <div
          className="relative h-screen bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30"></div>

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float animation-delay-${
                  (i % 3) + 1
                }`}
                style={{
                  left: `${10 + i * 15}%`,
                  top: "90%",
                }}
              />
            ))}
          </div>

          <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                    {content.heading}
                  </span>
                </h1>
              </div>

              <div className="relative animate-slide-in animation-delay-1">
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                <h2 className="relative text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-gray-200 leading-relaxed max-w-4xl mx-auto px-4">
                  {content.subheading}
                </h2>
              </div>

              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow animation-delay-2">
                <div className="flex flex-col items-center text-white/60">
                  <span className="text-sm mb-2 font-medium">
                    Scroll to explore
                  </span>
                  <div>
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
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout - Side by Side */}
          <div className="hidden lg:block">
            {contentItems.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`mb-24 last:mb-0 animate-scale-in animation-delay-${
                    (index % 3) + 1
                  }`}
                >
                  <div className="grid grid-cols-2 gap-12 items-center">
                    <div className={`${isEven ? "order-1" : "order-2"}`}>
                      <div className="relative group hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                          <img
                            src={item.image.value}
                            alt={`Section Image ${index + 1}`}
                            className="w-full h-80 object-cover transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${isEven ? "order-2" : "order-1"} space-y-6`}
                    >
                      <div className="group relative hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                          <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                          {item.text ? (
                            <p className="text-slate-300 leading-relaxed text-lg font-light pt-4">
                              {item.text.value}
                            </p>
                          ) : (
                            <p className="text-slate-500 italic leading-relaxed text-lg font-light pt-4">
                              No description available
                            </p>
                          )}
                          <div className="absolute bottom-0 right-6 w-8 h-1 bg-gradient-to-l from-purple-500 to-blue-500 rounded-full opacity-60"></div>
                        </div>
                      </div>

                      <div className="group relative hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative">
                          {item.link ? (
                            <a
                              href={item.link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl text-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              Explore More
                            </a>
                          ) : (
                            <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-slate-400 font-semibold py-4 px-6 rounded-2xl text-center opacity-60">
                              No link available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="block lg:hidden space-y-8">
            {contentItems.map((item, index) => (
              <div
                key={index}
                className={`space-y-4 animate-scale-in animation-delay-${
                  (index % 3) + 1
                }`}
              >
                {/* Image */}
                <div className="relative group hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                    <img
                      src={item.image.value}
                      alt={`Section Image ${index + 1}`}
                      className="w-full h-64 sm:h-80 object-cover transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="group relative hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                    <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    {item.text ? (
                      <p className="text-slate-300 leading-relaxed text-lg font-light pt-4">
                        {item.text.value}
                      </p>
                    ) : (
                      <p className="text-slate-500 italic leading-relaxed text-lg font-light pt-4">
                        No description available
                      </p>
                    )}
                    <div className="absolute bottom-0 right-6 w-8 h-1 bg-gradient-to-l from-purple-500 to-blue-500 rounded-full opacity-60"></div>
                  </div>
                </div>

                {/* Link */}
                <div className="group relative hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative">
                    {item.link ? (
                      <a
                        href={item.link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl text-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        Explore More
                      </a>
                    ) : (
                      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-slate-400 font-semibold py-4 px-6 rounded-2xl text-center opacity-60">
                        No link available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>
    </div>
  );
}
