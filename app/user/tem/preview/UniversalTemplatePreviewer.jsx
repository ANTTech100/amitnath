import React, { useState, useMemo, Suspense } from "react";

const layoutOptions = [
  { label: "Layout One", value: "layoutone" },
  { label: "Layout Two", value: "layouttwo" },
  { label: "Layout Three", value: "layoutthree" },
  { label: "Layout Four", value: "layoutfour" },
  { label: "Layout Five", value: "layoutfive" },
  { label: "Layout Six", value: "layoutsix" },
  { label: "Layout Seven", value: "layoutseven" },
  { label: "Layout Eight", value: "layouteight" },
  { label: "Layout Nine", value: "layoutnine" },
  { label: "Layout Ten", value: "layoutten" },
  { label: "Layout Eleven", value: "layouteleven" },
];

const templateImports = {
  layoutone: React.lazy(() => import('../../../../layouts/layoutone/page.js')),
  layouttwo: React.lazy(() => import('../../../../layouts/layouttwo/page.js')),
  layoutthree: React.lazy(() => import('../../../../layouts/layoutthree/page.js')),
  layoutfour: React.lazy(() => import('../../../../layouts/layoutfour/page.js')),
  layoutfive: React.lazy(() => import('../../../../layouts/layoutfive/page.js')),
  layoutsix: React.lazy(() => import('../../../../layouts/layoutsix/page.js')),
  layoutseven: React.lazy(() => import('../../../../layouts/layoutseven/page.js')),
  layouteight: React.lazy(() => import('../../../layouts/layouteight/page.js')),
  layoutnine: React.lazy(() => import('../../../../layouts/layoutnine/page.js')),
  layoutten: React.lazy(() => import('../../../../layouts/layoutten/page.js')),
  layouteleven: React.lazy(() => import('../../../../layouts/layouteleven/page.js')),
};

export default function UniversalTemplatePreviewer() {
  const [selectedLayout, setSelectedLayout] = useState('layoutone');
  const [content, setContent] = useState({
    heading: '',
    subheading: '',
    backgroundColor: '#ffffff',
    sections: {},
  });

  const TemplateComponent = useMemo(() => templateImports[selectedLayout], [selectedLayout]);

  // Simple UI for entering content
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Left: Content Input */}
      <div className="flex-1 max-w-xl mx-auto w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-200">Universal Template Previewer</h2>
        <div className="mb-4">
          <label className="block text-blue-100 mb-2 font-semibold">Select Template</label>
          <select
            className="w-full p-3 rounded-xl bg-white/20 text-blue-900"
            value={selectedLayout}
            onChange={e => setSelectedLayout(e.target.value)}
          >
            {layoutOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-blue-100 mb-2 font-semibold">Heading</label>
          <input
            name="heading"
            className="w-full p-3 rounded-xl bg-white/20 text-blue-900"
            value={content.heading}
            onChange={handleChange}
            placeholder="Enter heading"
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-100 mb-2 font-semibold">Subheading</label>
          <input
            name="subheading"
            className="w-full p-3 rounded-xl bg-white/20 text-blue-900"
            value={content.subheading}
            onChange={handleChange}
            placeholder="Enter subheading"
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-100 mb-2 font-semibold">Background Color</label>
          <input
            name="backgroundColor"
            type="color"
            className="w-12 h-12 border-2 border-blue-400/30 rounded-2xl cursor-pointer shadow"
            value={content.backgroundColor}
            onChange={handleChange}
          />
        </div>
        {/* You can add more fields for sections if needed */}
      </div>
      {/* Right: Live Preview */}
      <div className="flex-1 max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-auto">
        <Suspense fallback={<div className="p-8 text-center text-blue-600">Loading preview...</div>}>
          <TemplateComponent {...content} />
        </Suspense>
      </div>
    </div>
  );
} 