"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ViewShortcode() {
  const params = useParams();
  const router = useRouter();
  const { shortcode } = params;
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!shortcode) return;

      try {
        const response = await fetch(`/api/${shortcode}`);
        
        if (!response.ok) {
          setError(true);
          return;
        }

        const data = await response.json();
        
        if (data.longUrl) {
          // Redirect to the long URL
          window.location.href = data.longUrl;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setError(true);
      }
    };

    fetchAndRedirect();
  }, [shortcode]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Link Not Found</h2>
          <p className="text-gray-400 mb-6">This short URL does not exist or has expired</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
          >
            Create New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to your link...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    </div>
  );
}