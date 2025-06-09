"use client";
import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "What is WORK and how does it help me create content?",
      answer:
        "WORK is a comprehensive content creation platform that provides you with professional templates, design tools, and resources to create amazing content instantly. Whether you're building websites, social media posts, or marketing materials, our platform streamlines your creative process.",
    },
    {
      id: 2,
      question: "How do I access and use the templates?",
      answer:
        "Simply navigate to the Templates section in your dashboard. Browse through our extensive collection of professionally designed templates, choose one that fits your needs, and customize it with our easy-to-use editor. All templates are fully responsive and ready to use.",
    },
    {
      id: 3,
      question: "Can I upload and share my own content?",
      answer:
        "Yes! Our Uploads feature allows you to share your creations with the community. You can upload your designs, templates, or any content you've created. This helps other users while also showcasing your work to potential clients or collaborators.",
    },
    {
      id: 4,
      question: "Are there tutorials available to help me get started?",
      answer:
        "Absolutely! We provide comprehensive video tutorials covering everything from basic template usage to advanced design techniques. Our tutorial library includes step-by-step guides for web development, social media content creation, and e-commerce setup.",
    },
    {
      id: 5,
      question: "Is my account and content secure?",
      answer:
        "Security is our top priority. We use industry-standard encryption to protect your data, secure authentication systems, and regular backups to ensure your content is always safe. Your uploaded content remains private unless you choose to share it publicly.",
    },
    {
      id: 6,
      question: "What types of content can I create with WORK?",
      answer:
        "You can create a wide variety of content including websites, landing pages, social media posts, marketing materials, e-commerce stores, portfolios, blogs, and much more. Our platform supports multiple content formats and design styles.",
    },
    {
      id: 7,
      question: "Do I need design experience to use WORK?",
      answer:
        "Not at all! WORK is designed for users of all skill levels. Our intuitive interface, pre-made templates, and comprehensive tutorials make it easy for beginners to create professional-looking content. Advanced users can also access more sophisticated customization options.",
    },
    {
      id: 8,
      question: "How do I manage my profile and account settings?",
      answer:
        "Click on the Profile section in the navigation bar to access your account dashboard. Here you can update your personal information, manage your uploaded content, view your creation history, and adjust your account preferences.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about WORK and how to create amazing
            content instantly
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={faq.id}
              className="group relative bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300"></div>

              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="relative w-full px-8 py-6 text-left focus:outline-none transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center transition-all duration-300 ${
                        openIndex === index
                          ? "rotate-45 scale-110"
                          : "hover:scale-110"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-white transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v12m6-6H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`relative transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100 visible"
                    : "max-h-0 opacity-0 invisible"
                }`}
              >
                <div className="px-8 pb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-4"></div>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Can not find the answer you are looking for? Please chat with our
              friendly team.
            </p>
            <button className="group relative px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
              <span
                className="relative flex items-center gap-2"
                onClick={() => (window.location.href = "/user/contact")}
              >
                <span className="text-sm">💬</span>
                Contact Support
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
