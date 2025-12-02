"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function GiftPageLayout() {
  const params = useParams();
  const id = params?.id;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-rose-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full border border-gray-200">
          <div className="flex items-center gap-2 text-red-600 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-rose-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
    order: content.sections[sectionId].order || 0,
  }));

  const sortedSections = sections.sort((a, b) => a.order - b.order);
  const images = sortedSections.filter((section) => section.type === "image");
  const texts = sortedSections.filter((section) => section.type === "text");
  const links = sortedSections.filter((section) => section.type === "link");
  const videos = sortedSections.filter((section) => section.type === "video");

  const backgroundImage = images[0]?.value || "";
  const featuredImage = images[1]?.value || "";
  const giftImages = images.slice(2);
  const briefTexts = texts;
  const videoUrl = videos[0]?.value || "";
  const buttonLink = links[0]?.value || "#";
  const additionalLinks = links.slice(1);

  const giftCards = [
    ...giftImages.map((img, index) => ({
      id: `gift-${img.id}`,
      value: img.value,
      title: `Gift ${index + 1}`,
      type: "image"
    })),
    ...additionalLinks.map((link, index) => ({
      id: `link-${link.id}`,
      value: link.value,
      title: `Collection ${index + 1}`,
      type: "link"
    })),
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(giftCards.length / 6)));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, Math.ceil(giftCards.length / 6))) % Math.max(1, Math.ceil(giftCards.length / 6)));
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>{content.heading || "Gift Collection"}</title>
          <meta name="description" content={content.subheading || "Discover amazing gifts"} />
        </Head>

        {/* Hero Section */}
        <header className="relative h-[600px] ">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 max-w-3xl">
              {content.heading || "Gift Collection"}
            </h1>
            <p className="text-lg md:text-xl text-white/95 max-w-2xl">
              {content.subheading || "Discover the perfect gifts for every occasion"}
            </p>
          </div>
        </header>

        {/* Text Section */}
        {briefTexts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {briefTexts.map((text, index) => (
                  <div key={text.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{text.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Image */}
        {featuredImage && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RmVhdHVyZWQgSW1hZ2U8L3RleHQ+PC9zdmc+";
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Video Section */}
        {videoUrl && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-black">
                  {getYouTubeVideoId(videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}`}
                      className="w-full h-[400px]"
                      frameBorder="0"
                      allowFullScreen
                      title="Video"
                    ></iframe>
                  ) : (
                    <video src={videoUrl} className="w-full h-[400px] object-cover" controls>
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Button */}
        {buttonLink && (
          <div className="py-8 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                View Collection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Gift Gallery */}
        {giftCards.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
                  Gift Collection
                </h3>

                <div className="relative">
                  {giftCards.length > 6 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {giftCards.slice(currentSlide * 6, (currentSlide + 1) * 6).map((card) => (
                      <div
                        key={card.id}
                        className="group cursor-pointer"
                        onClick={() => card.type === 'link' && window.open(card.value, '_blank')}
                      >
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            {card.type === 'image' ? (
                              <img
                                src={card.value}
                                alt={card.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2lmdDwvdGV4dD48L3N2Zz4=";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                              {card.title}
                            </h4>
                            <div className="mt-2 flex items-center text-rose-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View details</span>
                              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {giftCards.length > 6 && (
                    <div className="flex justify-center mt-6 gap-2">
                      {Array.from({ length: Math.ceil(giftCards.length / 6) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentSlide === index ? "bg-rose-500" : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}