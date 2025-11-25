"use client"
import React, { useState, useEffect } from 'react';
import { BarChart3, Link2, TrendingUp, Calendar, ExternalLink, Search, Loader2, Eye, Clock, MousePointerClick } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [shortCode, setShortCode] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allUrls, setAllUrls] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Set baseUrl only on client side
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
    fetchAllUrls();
  }, []);

  const fetchAllUrls = async () => {
    try {
      const response = await fetch('/api/analytic/all');
      if (response.ok) {
        const data = await response.json();
        setAllUrls(data.urls || []);
      }
    } catch (err) {
      console.error('Error fetching all URLs:', err);
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchAnalytics = async (code) => {
    if (!code) {
      setError('Please enter a short code');
      return;
    }

    setLoading(true);
    setError('');
    setAnalytics(null);

    try {
      const response = await fetch(`/api/analytic/${code}`);
      
      if (!response.ok) {
        throw new Error('Short URL not found');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAnalytics(shortCode);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUrlClick = (code) => {
    setShortCode(code);
    fetchAnalytics(code);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-300">URL Analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
            Track Your Links
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Monitor performance and engagement of your shortened URLs
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Enter Short Code
            </label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-black border border-white/20 rounded-2xl px-6 py-4">
                <span className="text-gray-400">{baseUrl}/</span>
                <input
                  type="text"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="abc123"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-3">{error}</p>
            )}
          </div>
        </div>

        {analytics && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <MousePointerClick className="w-6 h-6 text-emerald-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-4xl font-bold mb-2">{analytics.clicks}</p>
                <p className="text-gray-400">Total Clicks</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-cyan-400" />
                  </div>
                  <Link2 className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-4xl font-bold mb-2 truncate">{analytics.shortCode}</p>
                <p className="text-gray-400">Short Code</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-lg font-bold mb-2">{formatDate(analytics.createdAt).split(',')[0]}</p>
                <p className="text-gray-400">Created</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Link2 className="w-6 h-6 text-emerald-400" />
                URL Details
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Short URL</p>
                  <div className="flex items-center gap-3 bg-black/50 border border-white/20 rounded-2xl px-6 py-4">
                    <a
                      href={`${baseUrl}/${analytics.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-emerald-400 font-mono hover:text-emerald-300 transition"
                    >
                      {baseUrl}/{analytics.shortCode}
                    </a>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Original URL</p>
                  <div className="bg-black/50 border border-white/20 rounded-2xl px-6 py-4">
                    <a
                      href={analytics.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition break-all"
                    >
                      {analytics.longUrl}
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Created At</p>
                  <div className="bg-black/50 border border-white/20 rounded-2xl px-6 py-4">
                    <p className="text-gray-300">{formatDate(analytics.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              All Shortened URLs
            </h3>

            {loadingAll ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              </div>
            ) : allUrls.length === 0 ? (
              <div className="text-center py-12">
                <Link2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No URLs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Short Code</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Original URL</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-medium">Clicks</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUrls.map((url) => (
                      <tr key={url.shortCode} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-4 px-4">
                          <code className="text-emerald-400 font-mono">{url.shortCode}</code>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-300 truncate max-w-xs">{url.longUrl}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-bold">
                            <MousePointerClick className="w-4 h-4" />
                            {url.clicks}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {formatDate(url.createdAt).split(',')[0]}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleUrlClick(url.shortCode)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}