"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";

export default function PaymentPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

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

        // Step 2: Find the "Payment Page" template
        console.log("Searching for template named 'Payment Page'...");
        const paymentPageTemplate = templateData.data.find((template) => {
          console.log(
            `Comparing template name: "${template.name}" with "Payment Page"`
          );
          return template.name === "Payment Page";
        });

        if (!paymentPageTemplate) {
          console.log("Template 'Payment Page' not found in the data.");
          throw new Error("Template 'Payment Page' not found");
        }

        console.log("Found Template:", paymentPageTemplate);
        const templateId = paymentPageTemplate._id;
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
          const contentTemplateId = content.templateId._id;
          const matchesTemplate =
            contentTemplateId.toString() === templateId.toString();
          const matchesId = content._id.toString() === id;
          console.log(
            `Content ID: ${content._id}, Template ID: ${contentTemplateId}, Matches Template: ${matchesTemplate}, Matches ID: ${matchesId}`
          );
          return matchesTemplate && matchesId;
        });

        if (!filteredContent) {
          console.log("No content found for this template and ID.");
          throw new Error("No content found for this template and ID");
        }

        console.log("Filtered Content:", filteredContent);
        setContent(filteredContent);
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

  const renderImage = (url) => (
    <div className="relative group">
      <img
        src={url}
        alt="Section Image"
        className="rounded-xl shadow-lg border border-gray-200 object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-xl font-medium text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg
            className="h-14 w-14 text-red-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
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
          <p className="text-xl font-medium text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <p className="text-xl font-medium text-gray-800">No content found.</p>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const imageSections = sections.filter(
    (section) => section.type === "image" && section.value
  );
  const textSections = sections.filter(
    (section) => section.type === "text" && section.value
  );

  // Ensure we have at least 2 images and 3 text sections for the layout
  const leftImage = imageSections[0];
  const rightImage = imageSections[1];
  const rightText = textSections[0];
  const bottomText1 = textSections[1];
  const bottomText2 = textSections[2];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div key={content._id}>
        <Head>
          <title>{content.heading} | Payment Page</title>
          <meta name="description" content={content.subheading} />
        </Head>

        {/* Heading and Subheading */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-fade-in">
            {content.heading}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-600 leading-relaxed animate-fade-in-delayed">
            {content.subheading}
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-20">
          {/* Two-Column Layout: Left Image, Right Image with Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch animate-fade-in-delayed">
            {/* Left Side: Image */}
            <div className="order-1 lg:order-1 flex items-center justify-center">
              {leftImage ? (
                <div className="w-full h-[500px]">
                  {renderImage(leftImage.value)}
                </div>
              ) : (
                <p className="text-lg text-gray-500 italic">
                  No image available
                </p>
              )}
            </div>

            {/* Right Side: Image and Text */}
            <div className="order-2 lg:order-2 flex flex-col space-y-10">
              {rightImage ? (
                <div className="w-full h-[300px]">
                  {renderImage(rightImage.value)}
                </div>
              ) : (
                <p className="text-lg text-gray-500 italic">
                  No image available
                </p>
              )}
              {rightText ? (
                <p className="text-lg text-gray-700 leading-relaxed bg-white p-6 rounded-xl shadow-lg">
                  {rightText.value}
                </p>
              ) : (
                <p className="text-lg text-gray-500 leading-relaxed italic bg-white p-6 rounded-xl shadow-lg">
                  No description available for this section.
                </p>
              )}
            </div>
          </div>

          {/* Two Text Blocks in a Row Below */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-delayed">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {bottomText1 ? (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {bottomText1.value}
                </p>
              ) : (
                <p className="text-lg text-gray-500 leading-relaxed italic">
                  No description available for this section.
                </p>
              )}
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {bottomText2 ? (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {bottomText2.value}
                </p>
              ) : (
                <p className="text-lg text-gray-500 leading-relaxed italic">
                  No description available for this section.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="max-w-5xl mx-auto text-center mt-20 animate-fade-in-delayed">
          <button className="px-12 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
