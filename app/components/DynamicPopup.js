"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function DynamicPopup({ templateId, onComplete }) {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState("userInfo"); // "userInfo" or "questions"
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Determine a stable key per content id if available, otherwise per template
    let contentIdFromPath = null;
    try {
      const segments = window.location.pathname.split("/").filter(Boolean);
      contentIdFromPath = segments[segments.length - 1] || null;
    } catch (_) {
      // ignore
    }

    const completionKey = contentIdFromPath
      ? `content_${contentIdFromPath}_completed`
      : `template_${templateId}_completed`;
    const alreadyCompleted = localStorage.getItem(completionKey);

    if (alreadyCompleted === "true") {
      setLoading(false);
      setShowPopup(false);
      if (onComplete) onComplete();
      return;
    }

    // For anonymous users, still show the popup
    setLoading(false);
    setShowPopup(true);
    loadQuestions();
  }, [templateId]);

  const loadQuestions = async () => {
    try {
      const response = await axios.get(`/api/user/responses?templateId=${templateId}`);
      
      if (response.data.success) {
        if (response.data.hasQuestions) {
          // Questions exist for this template
          setQuestions(response.data.questions);
          setResponses(response.data.questions.map(() => ({ selectedOption: "" })));
        } else {
          // No questions for this template
          setShowPopup(false);
          if (onComplete) onComplete();
        }
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      setShowPopup(false);
      if (onComplete) onComplete();
    }
  };

  const checkUserResponse = async (userId) => {
    try {
      const response = await axios.get(`/api/user/responses?templateId=${templateId}&userId=${userId}`);
      
      if (response.data.success) {
        if (response.data.completed) {
          // User has already completed questions for this template
          setLoading(false);
          setShowPopup(false);
          if (onComplete) onComplete();
        } else if (response.data.hasQuestions) {
          // User hasn't completed but questions exist
          setQuestions(response.data.questions);
          setResponses(response.data.questions.map(() => ({ selectedOption: "" })));
          setLoading(false);
          setShowPopup(true);
        } else {
          // No questions for this template
          setLoading(false);
          setShowPopup(false);
          if (onComplete) onComplete();
        }
      }
    } catch (error) {
      console.error("Error checking user response:", error);
      setLoading(false);
      setShowPopup(false);
      if (onComplete) onComplete();
    }
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      setError("All fields are required");
      return;
    }
    setCurrentStep("questions");
    setError("");
  };

  const handleQuestionsSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unansweredQuestions = responses.filter(response => !response.selectedOption);
    if (unansweredQuestions.length > 0) {
      setError("Please answer all questions");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post("/api/user/responses", {
        templateId,
        userInfo,
        responses,
      });

      if (response.data.success) {
        // Mark this content/template as completed locally
        const segments = window.location.pathname.split("/").filter(Boolean);
        const cid = segments[segments.length - 1];
        const key = cid ? `content_${cid}_completed` : `template_${templateId}_completed`;
        localStorage.setItem(key, "true");
        setShowPopup(false);
        if (onComplete) onComplete();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit responses");
    } finally {
      setSubmitting(false);
    }
  };

  const updateResponse = (questionIndex, selectedOption) => {
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = { selectedOption };
    setResponses(updatedResponses);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!showPopup) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === "userInfo" ? "Quick Setup" : "Quick Quiz"}
              </h2>
              <p className="text-gray-600">
                {currentStep === "userInfo" 
                  ? "Please provide your information to continue" 
                  : "Answer a few questions to personalize your experience"
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
              >
                {error}
              </motion.div>
            )}

            {/* User Info Form */}
            {currentStep === "userInfo" && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleUserInfoSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="password"
                    value={userInfo.password}
                    onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Continue
                </button>
              </motion.form>
            )}

            {/* Questions Form */}
            {currentStep === "questions" && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleQuestionsSubmit}
                className="space-y-6"
              >
                {questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      {questionIndex + 1}. {question.questionText}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            value={option.text}
                            checked={responses[questionIndex]?.selectedOption === option.text}
                            onChange={() => updateResponse(questionIndex, option.text)}
                            className="text-purple-600 focus:ring-purple-500"
                            required
                          />
                          <span className="text-gray-700">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("userInfo")}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 