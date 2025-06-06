"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { ChevronDown, ChevronUp, Quote, Video, FileText } from "lucide-react";

export default function LayoutFive() {
  const [content, setContent] = useState(null);
  const [groupedSections, setGroupedSections] = useState([]);
  const [openGuides, setOpenGuides] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch templates
        console.log("Fetching templates from /api/admin/templatecreate...");
        const templateResponse = await fetch("/api/admin/templatecreate");
        console.log("Template Response Status:", templateResponse.status);
        const templateData = await templateResponse.json();
        console.log("Template Data:", templateData);

        if (!templateData.success) {
          throw new Error("Failed to fetch templates");
        }

        console.log("Templates List:", templateData.data);

        // Step 2: Find the "Testimonial Section" template
        console.log("Searching for template named 'Testimonial Section'...");
        const testimonialSectionTemplate = templateData.data.find(
          (template) => {
            console.log(
              `Comparing template name: "${template.name}" with "Testimonial Section"`
            );
            return template.name === "Testimonial Section";
          }
        );

        if (!testimonialSectionTemplate) {
          console.log("Template 'Testimonial Section' not found in the data.");
          throw new Error("Template 'Testimonial Section' not found");
        }

        console.log("Found Template:", testimonialSectionTemplate);
        const templateId = testimonialSectionTemplate._id;
        console.log("Template ID:", templateId);

        // Step 3: Fetch content associated with this templateId
        console.log("Fetching content from /api/upload...");
        const contentResponse = await fetch("/api/upload");
        console.log("Content Response Status:", contentResponse.status);
        const contentData = await contentResponse.json();
        console.log("Content Data:", contentData);

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        console.log("All Content Entries:", contentData.content);

        // Step 4: Filter content by templateId and the specific content ID
        console.log(
          `Filtering content for templateId: ${templateId} and content ID: ${id}`
        );
        const filteredContent = contentData.content.find((content) => {
          const contentTemplateId = content.templateId?._id;
          const matchesTemplate =
            contentTemplateId &&
            contentTemplateId.toString() === templateId.toString();
          const matchesId = content._id.toString() === id;
          console.log(
            `Content ID: ${content._id}, Template ID: ${
              contentTemplateId || "null"
            }, Matches Template: ${matchesTemplate}, Matches ID: ${matchesId}`
          );
          return matchesTemplate && matchesId;
        });

        if (!filteredContent) {
          console.log("No content found for this template and ID.");
          setError("No content found for this template and ID");
          setLoading(false);
          return;
        }

        console.log("Filtered Content:", filteredContent);
        setContent(filteredContent);

        // Step 5: Group sections (allow any number of sections)
        const sections = Object.keys(filteredContent.sections || {}).map(
          (sectionId) => ({
            id: sectionId,
            type: filteredContent.sections[sectionId].type,
            value: filteredContent.sections[sectionId].value,
          })
        );

        const groups = [];
        if (sections.length > 0) {
          groups.push(sections);
        }

        console.log("Grouped Sections:", groups);
        setGroupedSections(groups);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const renderVideo = (url) => {
    console.log("Video URL:", url);
    if (!url || typeof url !== "string") {
      return <p className="text-lg text-gray-500 italic">Invalid video URL</p>;
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      if (!videoId) {
        console.error("Invalid YouTube URL:", url);
        return (
          <p className="text-lg text-gray-500 italic">Invalid video URL</p>
        );
      }
      return (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-2xl"
            />
          </div>
        </div>
      );
    } else if (url.includes("mux.com")) {
      return (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              width="100%"
              height="400"
              controls
              src={url}
              className="rounded-2xl"
            />
          </div>
        </div>
      );
    } else {
      console.error("Unsupported video platform:", url);
      return (
        <p className="text-lg text-gray-500 italic">
          Unsupported video platform
        </p>
      );
    }
  };

  const renderText = (text) => {
    if (!text || typeof text !== "string") {
      return (
        <p className="text-lg text-gray-500 leading-relaxed italic">
          No testimonial text available.
        </p>
      );
    }
    return (
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Quote className="w-6 h-6 text-white" />
        </div>
        <div className="pl-16">
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {text}
          </p>
        </div>
      </div>
    );
  };

  const toggleGuide = (index) => {
    const newOpenGuides = new Set(openGuides);
    if (newOpenGuides.has(index)) {
      newOpenGuides.delete(index);
    } else {
      newOpenGuides.add(index);
    }
    setOpenGuides(newOpenGuides);
    console.log(`Toggled Guide ${index + 1}:`, groupedSections[index]);
  };

  const getPhaseInfo = (index) => {
    const phases = [
      { name: "Onboarding", color: "from-green-500 to-emerald-600" },
      { name: "Phase 1", color: "from-blue-500 to-cyan-600" },
      { name: "Phase 1", color: "from-purple-500 to-violet-600" },
      { name: "Phase 1", color: "from-orange-500 to-red-600" },
      { name: "Phase 1", color: "from-pink-500 to-rose-600" },
      { name: "Phase 1", color: "from-indigo-500 to-blue-600" },
      { name: "Phase 1", color: "from-yellow-500 to-orange-600" },
      { name: "Phase 1", color: "from-teal-500 to-cyan-600" },
      { name: "Phase 2", color: "from-violet-500 to-purple-600" },
      {
        name: "Phase 2",
        color: "from- Vulnerability scanningrose-500 to-pink-600",
      },
      { name: "Phase 2", color: "from-cyan-500 to-blue-600" },
      { name: "Phase 2", color: "from-emerald-500 to-green-600" },
      { name: "Phase 3", color: "from-amber-500 to-yellow-600" },
      { name: "Phase 3", color: "from-red-500 to-orange-600" },
      { name: "Phase 3", color: "from-blue-500 to-indigo-600" },
    ];
    return (
      phases[index] || { name: "Phase", color: "from-gray-500 to-gray-600" }
    );
  };

  const getSectionStats = (sections) => {
    const videoCount = sections.filter((s) => s.type === "video").length;
    const textCount = sections.filter((s) => s.type === "text").length;
    return `${sections.length} section${
      sections.length !== 1 ? "s" : ""
    } • ${videoCount} video${
      videoCount !== 1 ? "s" : ""
    } • ${textCount} text guide${textCount !== 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto animation-delay-150"></div>
          </div>
          <p className="text-2xl font-semibold text-white">
            Loading your guides...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">!</span>
          </div>
          <p className="text-xl font-medium text-white mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <p className="text-2xl font-medium text-white">No content found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Head>
        <title>{content.heading} | Testimonial Section</title>
        <meta name="description" content={content.subheading} />
      </Head>

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {content.heading}
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            {content.subheading}
          </p>
        </div>
      </div>

      {/* Guides Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {groupedSections.length === 0 ? (
            <p className="text-xl text-purple-200 text-center">
              No sections available for this content.
            </p>
          ) : (
            groupedSections.map((sections, index) => {
              const phase = getPhaseInfo(index);
              const isOpen = openGuides.has(index);

              return (
                <div key={index} className="group">
                  {/* Guide Header */}
                  <button
                    onClick={() => toggleGuide(index)}
                    className="w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white font-bold text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white">
                            GUIDE {index + 1}
                          </h3>
                          <p className="text-purple-200 text-sm">
                            {getSectionStats(sections)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          <Video className="w-5 h-5 text-blue-400" />
                          <FileText className="w-5 h-5 text-green-400" />
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-6 h-6 text-white transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Guide Content */}
                  {isOpen && (
                    <div className="mt-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                      <div className="space-y-8">
                        {sections.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <div className="flex items-center mb-4">
                              <div
                                className={`w-8 h-8 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center mr-4`}
                              >
                                {section.type === "video" ? (
                                  <Video className="w-4 h-4 text-white" />
                                ) : (
                                  <FileText className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <h4 className="text-lg font-semibold text-white">
                                {section.type === "video"
                                  ? "Video Tutorial"
                                  : "Text Guide"}{" "}
                                {sectionIndex + 1}
                              </h4>
                            </div>

                            <div className="transition-all duration-500">
                              {section.type === "text"
                                ? renderText(section.value)
                                : renderVideo(section.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-20">
          <button
            onClick={() => router.push("/testimonial-sections")}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
          >
            Back to Testimonial Sections
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
}
