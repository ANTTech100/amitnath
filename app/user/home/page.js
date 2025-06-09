"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Image,
  Video,
  ExternalLink,
  Search,
  User,
  Sparkles,
  ArrowRight,
  Plus,
  Grid3X3,
  Zap,
  Palette,
  Globe,
  Star,
  TrendingUp,
  Play,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  ThumbsUp,
  PlayCircle,
} from "lucide-react";
import UserNavbar from "../Header";
import FAQ from "../FAQ";

export default function UserDashboard() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templateScrollIndex, setTemplateScrollIndex] = useState(0);
  const [customerScrollIndex, setCustomerScrollIndex] = useState(0);
  const [videoScrollIndex, setVideoScrollIndex] = useState(0);

  // Google Sign-in handler
  const handleGoogleSignIn = () => {
    console.log("Google Sign-in clicked");
  };

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Simulating API call with fallback templates
        const limitedTemplates = getFallbackTemplates();
        setTemplates(limitedTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates(getFallbackTemplates());
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Helper functions for styling
  const getGradientColor = (index) => {
    const gradients = [
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-indigo-500 to-blue-600",
      "from-green-500 to-emerald-600",
      "from-red-500 to-rose-600",
    ];
    return gradients[index % gradients.length];
  };

  const getBgColor = (index) => {
    const bgColors = [
      "bg-emerald-500/10",
      "bg-violet-500/10",
      "bg-cyan-500/10",
      "bg-rose-500/10",
      "bg-amber-500/10",
      "bg-indigo-500/10",
      "bg-green-500/10",
      "bg-red-500/10",
    ];
    return bgColors[index % bgColors.length];
  };

  const getIconColor = (index) => {
    const iconColors = [
      "text-emerald-400",
      "text-violet-400",
      "text-cyan-400",
      "text-rose-400",
      "text-amber-400",
      "text-indigo-400",
      "text-green-400",
      "text-red-400",
    ];
    return iconColors[index % iconColors.length];
  };

  const getTemplateIcon = (name) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("blog") || lowerName.includes("post"))
      return FileText;
    if (
      lowerName.includes("image") ||
      lowerName.includes("photo") ||
      lowerName.includes("gallery")
    )
      return Image;
    if (lowerName.includes("video")) return Video;
    if (lowerName.includes("portfolio")) return Palette;
    if (
      lowerName.includes("web") ||
      lowerName.includes("site") ||
      lowerName.includes("landing")
    )
      return Globe;
    if (lowerName.includes("magnet") || lowerName.includes("lead")) return Star;
    if (lowerName.includes("page")) return FileText;
    return Sparkles;
  };

  const getFallbackTemplates = () => [
    {
      name: "Blog Post",
      description: "Create engaging text-based blog posts with rich formatting",
      id: "blog-post",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      icon: FileText,
    },
    {
      name: "Photo Gallery",
      description: "Showcase multiple images in beautiful gallery layouts",
      id: "gallery",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-400",
      icon: Image,
    },
    {
      name: "Video Content",
      description: "Upload and manage video content with metadata",
      id: "video",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      icon: Video,
    },
    {
      name: "Portfolio Site",
      description: "Professional portfolio to showcase your work",
      id: "portfolio",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-400",
      icon: Palette,
    },
    {
      name: "Landing Page",
      description: "High-converting landing pages for your business",
      id: "landing",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
      icon: Globe,
    },
  ];

  // Hardcoded customer testimonials
  const customers = [
    {
      id: 1,
      name: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      text: "Amazing templates! Saved me hours of work and the results look professional.",
      rating: 5,
    },
    {
      id: 2,
      name: "Mike Chen",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      text: "The video templates are exactly what I needed for my YouTube channel.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Davis",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      text: "User-friendly interface and beautiful designs. Highly recommend!",
      rating: 4,
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      text: "Great value for money. The templates are modern and responsive.",
      rating: 5,
    },
    {
      id: 5,
      name: "Lisa Wang",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
      text: "Perfect for my business needs. Clean designs and easy customization.",
      rating: 5,
    },
  ];

  // Tutorial/Demo videos data
  const tutorialVideos = [
    {
      id: 1,
      title: "HTML & CSS Basics - Build Your First Website",
      videoLink: "https://youtu.be/qz0aGYrrlhU",
    },
    {
      id: 2,
      title: "JavaScript Full Course for Beginners",
      videoLink: "https://youtu.be/PkZNo7MFNFg",
    },
    {
      id: 3,
      title: "React Tutorial for Beginners",
      videoLink: "https://youtu.be/bMknfKXIFA8",
    },
    {
      id: 4,
      title: "Responsive Web Design Course",
      videoLink: "https://youtu.be/srvUrASNdxk",
    },
    {
      id: 5,
      title: "Node.js and Express.js Full Course",
      videoLink: "https://youtu.be/Oe421EPjeBE",
    },
  ];

  // Scroll functions
  const scrollTemplates = (direction) => {
    const maxIndex = Math.max(0, templates.length - 3);
    if (direction === "left") {
      setTemplateScrollIndex(Math.max(0, templateScrollIndex - 1));
    } else {
      setTemplateScrollIndex(Math.min(maxIndex, templateScrollIndex + 1));
    }
  };

  const scrollCustomers = (direction) => {
    const maxIndex = Math.max(0, customers.length - 3);
    if (direction === "left") {
      setCustomerScrollIndex(Math.max(0, customerScrollIndex - 1));
    } else {
      setCustomerScrollIndex(Math.min(maxIndex, customerScrollIndex + 1));
    }
  };

  const scrollVideos = (direction) => {
    const maxIndex = Math.max(0, tutorialVideos.length - 4);
    if (direction === "left") {
      setVideoScrollIndex(Math.max(0, videoScrollIndex - 1));
    } else {
      setVideoScrollIndex(Math.min(maxIndex, videoScrollIndex + 1));
    }
  };

  const openVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <UserNavbar></UserNavbar>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Google Sign-in Button - Top Right */}
      {/* <div className="absolute top-20 right-6 z-50">
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center px-6 py-3 bg-white/95 backdrop-blur-sm text-gray-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </div> */}

      <div className="container mx-auto px-6 py-12 pt-24">
        {/* Main Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-violet-200 mb-8 animate-pulse">
            Create Amazing Content Instantly
          </h1>

          <p className="text-xl text-slate-200/90 leading-relaxed max-w-2xl mx-auto mb-12">
            Transform your ideas into stunning, professional content with our
            AI-powered templates. Save time, boost creativity, and engage your
            audience like never before with our cutting-edge design tools.
          </p>

          {/* Main Demo Video Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-violet-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                <div className="aspect-video relative overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/McSh1ewsFQ4?si=dOKMYuD7_fAt_UCS"
                    title="Demo Video"
                    className="absolute inset-0 w-full h-full rounded-3xl"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg text-slate-200/80 leading-relaxed max-w-3xl mx-auto mb-16">
            Our platform combines the power of artificial intelligence with
            beautiful design to help you create content that stands out. Whether
            youare building websites, creating social media posts, or designing
            marketing materials, we have got you covered with templates that
            adapt to your unique style and brand.
          </p>
        </div>

        {/* Templates Scroller Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200">
              Featured Templates
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => scrollTemplates("left")}
                disabled={templateScrollIndex === 0}
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => scrollTemplates("right")}
                disabled={
                  templateScrollIndex >= Math.max(0, templates.length - 3)
                }
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${templateScrollIndex * 33.333}%)`,
              }}
            >
              {templates.map((template, index) => {
                const IconComponent = template.icon || Sparkles;
                return (
                  <div
                    key={template.id || index}
                    className="w-1/3 flex-shrink-0 px-3"
                  >
                    <div className="group cursor-pointer">
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-105">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        ></div>

                        <div className="relative p-6">
                          <div
                            className={`${template.bgColor} backdrop-blur-sm rounded-2xl p-4 w-fit mb-4`}
                          >
                            <IconComponent
                              className={`h-8 w-8 ${template.iconColor}`}
                            />
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2">
                            {template.name}
                          </h3>
                          <p className="text-slate-200/70 text-sm line-clamp-2">
                            {template.description}
                          </p>

                          <div className="mt-4 text-xs text-slate-300/60">
                            <span className="capitalize">premium template</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Try Now Buy Later Button */}
        <div className="text-center mb-16">
          <button className="group relative px-12 py-6 bg-gradient-to-r from-emerald-600 to-violet-600 text-white font-bold text-xl rounded-3xl hover:from-emerald-700 hover:to-violet-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <Zap className="mr-4 h-6 w-6" />
              Try Now, Buy Later
              <ShoppingCart className="ml-4 h-6 w-6" />
            </div>
          </button>
        </div>

        {/* Happy Customers Scroller */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200">
              Happy Customers
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => scrollCustomers("left")}
                disabled={customerScrollIndex === 0}
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => scrollCustomers("right")}
                disabled={
                  customerScrollIndex >= Math.max(0, customers.length - 3)
                }
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${customerScrollIndex * 33.333}%)`,
              }}
            >
              {customers.map((customer) => (
                <div key={customer.id} className="w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center mb-4">
                      <img
                        src={customer.image}
                        alt={customer.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-emerald-400/30"
                      />
                      <div>
                        <h4 className="text-white font-semibold">
                          {customer.name}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < customer.rating
                                  ? "text-amber-400 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-200/80 text-sm leading-relaxed">
                      {customer.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Tutorials Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-2">
                Video Tutorials
              </h2>
              <p className="text-slate-200/70">
                Learn how to use our platform with these helpful guides
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => scrollVideos("left")}
                disabled={videoScrollIndex === 0}
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => scrollVideos("right")}
                disabled={
                  videoScrollIndex >= Math.max(0, tutorialVideos.length - 4)
                }
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${videoScrollIndex * 25}%)`,
            }}
          >
            {tutorialVideos.map((video, index) => (
              <div key={video.id} className="w-1/4 flex-shrink-0 px-2">
                <div className="group cursor-pointer">
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-105">
                    {/* Video iframe */}
                    <div className="relative aspect-video overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          video.videoLink.split("/").pop().split("?")[0]
                        }`}
                        title={video.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FAQ></FAQ>
    </div>
  );
}
