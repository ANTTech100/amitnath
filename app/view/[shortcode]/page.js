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
 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

        <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    </div>
  );
}