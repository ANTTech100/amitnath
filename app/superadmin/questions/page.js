"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

export default function SuperadminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/questions?all=true");
        setQuestions(response.data.questions || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Questions (All Organizations)</h1>
        {loading ? (
          <div className="text-blue-300">Loading questions...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="bg-white/10 rounded-xl p-6 shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-blue-200">Question</th>
                  <th className="px-4 py-2 text-blue-200">Created At</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 ? (
                  <tr><td colSpan={2} className="text-center text-blue-200 py-8">No questions found.</td></tr>
                ) : (
                  questions.flatMap((q) =>
                    (q.questions || []).map((question, idx) => (
                      <tr key={q._id + "-" + idx} className="border-b border-blue-800/30">
                        <td className="px-4 py-2 text-white">{question.questionText || question.text || "-"}</td>
                        <td className="px-4 py-2 text-blue-100">{q.createdAt ? new Date(q.createdAt).toLocaleString() : "-"}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
} 