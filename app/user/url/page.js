"use client";
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, Sparkles, ArrowRight, BarChart3 } from 'lucide-react';
import UserNavbar from '../Header';

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleShorten = async () => {
    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(longUrl);
    } catch (e) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longUrl,
          customCode: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create short URL');
      }

      setShortUrl(`${window.location.origin}/view/${data.shortCode}`);
    } catch (err) {
      setError(err.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setLongUrl('');
    setCustomCode('');
    setShortUrl('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <UserNavbar></UserNavbar>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mt-20">
          
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Shorten Your Links
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform long, complex URLs into short, memorable links that are easy to share and track
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          {!shortUrl ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Paste your long URL
                  </label>
                  <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://codelesspages.com/layouts/layoutone/6923f7d22e123c8abe707a02"
                    className="w-full px-6 py-4 bg-black border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                  />
                </div>

                {/* Custom Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Custom short code (optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 px-4">{origin || 'yoursite.com'}/view/</span>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-link"
                      className="flex-1 px-6 py-4 bg-black border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Leave empty for auto-generated code</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleShorten}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-5 px-8 rounded-2xl transition flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      Shorten URL
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Your link is ready!</h3>
                <p className="text-gray-400">Share your shortened URL anywhere</p>
              </div>

              <div className="bg-black/50 border border-white/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <Link2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-xl font-mono text-purple-400 hover:text-purple-300 transition truncate"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-400 mb-2">Original URL:</p>
                <p className="text-gray-300 break-all font-mono text-sm">{longUrl}</p>
              </div>

              <button
                onClick={reset}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition"
              >
                Create Another Link
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Link2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Easy to Share</h3>
            <p className="text-gray-400">Create short, memorable links that are perfect for social media, emails, and more</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Track Performance</h3>
            <p className="text-gray-400">Monitor clicks and engagement to understand your audience better</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Custom Links</h3>
            <p className="text-gray-400">Create branded short links with custom codes that match your style</p>
          </div>
        </div>
      </div>
    </div>
  );
}