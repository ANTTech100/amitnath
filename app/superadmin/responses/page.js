"use client";
import { useEffect, useState } from "react";

export default function UserResponsesDashboard() {
  const [userResponses, setUserResponses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all responses across tenants (superadmin)
        const responsesRes = await fetch("/api/responses?all=true", {
          headers: { "x-superadmin": "true" },
        });
        const responsesData = await responsesRes.json();
        if (responsesData.success) {
          setUserResponses(responsesData.responses || []);
        } else {
          setError(responsesData.message || "Failed to fetch user responses");
        }

        // Fetch all templates across tenants (superadmin)
        const templatesRes = await fetch("/api/templates?all=true", {
          headers: { "x-superadmin": "true" },
        });
        const templatesData = await templatesRes.json();
        if (templatesData.templates) {
          setTemplates(templatesData.templates || []);
        }
        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user responses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTemplateName = (templateId) => {
    if (typeof templateId === "object" && templateId !== null) {
      return templateId.name || "Unknown Template";
    }
    const template = templates.find((t) => String(t._id) === String(templateId));
    return template ? template.name : "Unknown Template";
  };

  const getUserName = (response) => {
    if (response.userId && typeof response.userId === "object" && response.userId.fullName) {
      return response.userId.fullName;
    }
    if (response.userInfo && response.userInfo.name) {
      return response.userInfo.name;
    }
    return "Unknown User";
  };

  const getUserEmail = (response) => {
    if (response.userId && typeof response.userId === "object" && response.userId.email) {
      return response.userId.email;
    }
    if (response.userInfo && response.userInfo.email) {
      return response.userInfo.email;
    }
    return "No email";
  };

  const filteredResponses = userResponses.filter((response) => {
    const matchesTemplate =
      selectedTemplate === "all" ||
      String(response.templateId?._id || response.templateId) === selectedTemplate;
    
    const userName = getUserName(response).toLowerCase();
    const userEmail = getUserEmail(response).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch =
      searchTerm === "" ||
      userName.includes(searchLower) ||
      userEmail.includes(searchLower);
    
    return matchesTemplate && matchesSearch;
  });

  const getSubmittedDate = (response) => {
    const date = response.submittedAt || response.createdAt;
    return date ? new Date(date) : new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">User Responses</h1>
          <p className="text-purple-200 text-sm">View and analyze all user quiz responses</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-white border border-gray-300 text-black text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Templates</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">
                Search User
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or email..."
                className="w-full bg-white border border-gray-300 text-black text-sm placeholder-gray-500 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <div className="bg-purple-500/20 rounded px-3 py-1.5 border border-purple-500/30 w-full text-center">
                <p className="text-purple-200 text-xs">Total Responses</p>
                <p className="text-xl font-bold text-white">{filteredResponses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-purple-200 text-sm">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
            {error}
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center border border-white/20">
            <p className="text-lg text-purple-200 mb-1">No responses found</p>
            <p className="text-purple-300 text-xs">
              {searchTerm || selectedTemplate !== "all"
                ? "No matches for your filters"
                : "No responses submitted yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResponses.map((response) => {
              const totalCount = response.responses?.length || 0;
              const userName = getUserName(response);
              const userEmail = getUserEmail(response);
              const submittedDate = getSubmittedDate(response);

              return (
                <div
                  key={response._id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden hover:bg-white/15 transition-all"
                >
                  {/* Compact Header */}
                  <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-3 border-b border-white/20">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white truncate">
                              {userName}
                            </h3>
                            {response.userId === "not_registered" && (
                              <span className="px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-200 text-xs shrink-0">
                                Guest
                              </span>
                            )}
                          </div>
                          <p className="text-purple-200 text-xs truncate">{userEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center bg-purple-500/20 rounded px-2 py-1 border border-purple-500/30">
                          <p className="text-purple-200 text-xs">{totalCount} Ques</p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-200 text-xs">
                            {submittedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {submittedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-purple-300 text-xs mt-1 truncate">
                      {getTemplateName(response.templateId)}
                    </p>
                  </div>

                  {/* Compact Answers */}
                  <div className="p-3">
                    {response.responses && response.responses.length > 0 ? (
                      <div className="space-y-2">
                        {response.responses.map((answer, index) => (
                          <div
                            key={answer._id || index}
                            className="bg-white/5 border border-white/10 rounded p-2 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-purple-400 font-semibold text-xs shrink-0 mt-0.5">
                                Q{index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-purple-100 text-xs mb-1 line-clamp-2">
                                  {answer.questionText || "Question text not available"}
                                </p>
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded p-1.5 border border-purple-500/20">
                                  <p className="text-white text-xs font-medium">
                                    {answer.selectedOption || "No answer"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-purple-300 text-xs">
                        No responses recorded
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}