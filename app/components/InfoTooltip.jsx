import React, { useState } from "react";

export default function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block align-middle ml-2">
      <button
        type="button"
        aria-label="Info"
        className="focus:outline-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
      >
        <svg
          className="w-5 h-5 text-blue-400 hover:text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 16v-4m0-4h.01"
          />
        </svg>
      </button>
      {show && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-gray-100 text-sm rounded-lg shadow-lg p-3 border border-blue-500 animate-fade-in">
          {text}
        </div>
      )}
    </span>
  );
} 