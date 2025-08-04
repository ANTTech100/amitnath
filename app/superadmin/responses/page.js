"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperadminQuestions() {
  const [adminQuestions, setAdminQuestions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminQuestions = async () => {
      try {
        setLoading(true);
        
        // Fetch admin questions
        const questionsResponse = await axios.get("/api/admin/questions");
        if (questionsResponse.data.success) {
          setAdminQuestions(questionsResponse.data.data || []);
        }
        
        // Fetch templates for reference
        const templatesResponse = await axios.get("/api/admin/templatecreate");
        if (templatesResponse.data.success) {
          setTemplates(templatesResponse.data.data || []);
        }
        
        setError("");
      } catch (err) {
        console.error("Error fetching admin questions:", err);
        setError("Failed to fetch admin questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminQuestions();
  }, []);

  const getTemplateName = (templateId) => {
    const idStr = typeof templateId === 'object' && templateId !== null && templateId._id ? templateId._id : templateId;
    const template = templates.find(t => String(t._id) === String(idStr));
    return template ? template.name : "Unknown Template";
  };

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Questions (All Organizations)</h1>
        
        {loading ? (
          <div className="text-blue-300">Loading admin questions...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            {adminQuestions.length === 0 ? (
              <div className="text-center text-blue-200 py-8">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg">No admin questions found.</p>
                <p className="text-sm text-blue-200/60 mt-2">Admins haven't created any questions yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {adminQuestions.map((templateQ) => (
                  <div key={templateQ._id} className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-blue-200 text-xl">
                        {getTemplateName(templateQ.templateId)}
                      </h3>
                      <div className="flex items-center space-x-4 text-blue-200/80">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">{templateQ.questions.length} questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{new Date(templateQ.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {templateQ.questions.map((question, qIndex) => (
                        <div key={qIndex} className="bg-white/5 backdrop-blur-sm border border-blue-400/10 rounded-lg p-4">
                          <div className="mb-3">
                            <h4 className="font-semibold text-blue-200 mb-2">
                              Question {qIndex + 1}: {question.questionText}
                            </h4>
                          </div>
                          
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className={`flex items-center space-x-3 p-2 rounded-lg ${
                                option.isCorrect 
                                  ? 'bg-green-500/20 border border-green-400/30' 
                                  : 'bg-white/5 border border-blue-400/10'
                              }`}>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  option.isCorrect 
                                    ? 'border-green-400 bg-green-400' 
                                    : 'border-blue-400'
                                }`}>
                                  {option.isCorrect && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <span className={`text-sm ${
                                  option.isCorrect 
                                    ? 'text-green-200 font-medium' 
                                    : 'text-blue-200'
                                }`}>
                                  {option.text}
                                </span>
                                {option.isCorrect && (
                                  <div className="flex items-center text-green-400 text-xs">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Correct
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
} 