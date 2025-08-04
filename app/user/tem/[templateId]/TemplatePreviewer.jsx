import React, { useMemo, Suspense } from "react";
// import * as nextNavigation from 'next/navigation'; // No longer needed

// Helper to map templateId to layout folder name (e.g., 1 => layoutone)
function getLayoutFolder(templateId) {
  // Accepts both string and number ids
  const idNum = typeof templateId === "string" ? parseInt(templateId, 10) : templateId;
  const names = [
    "layoutone",
    "layouttwo",
    "layoutthree",
    "layoutfour",
    "layoutfive",
    "layoutsix",
    "layoutseven",
    "layouteight",
    "layoutnine",
    "layoutten",
    "layouteleven",
  ];
  // templateId is 1-based, fallback to layoutone
  return names[(idNum || 1) - 1] || "layoutone";
}

// Helper to build a mock content object from form data and template definition
function buildContentObject(formData, template) {
  // template.sections is an array of section definitions
  const sections = {};
  if (template && Array.isArray(template.sections)) {
    template.sections.forEach((section) => {
      sections[section.id] = {
        type: section.type,
        value: formData[section.id] || "",
      };
    });
  }
  return {
    heading: formData.heading || template?.heading || "Preview Heading",
    subheading: formData.subheading || template?.subheading || "Preview Subheading",
    backgroundColor: formData.backgroundColor || template?.backgroundColor || "#fff",
    sections,
    // _id intentionally omitted for preview
    // Add more fields as needed
  };
}

const templateImports = {
  layoutone: React.lazy(() => import('../../../layouts/layoutone/[id]/page.js')),
  layouttwo: React.lazy(() => import('../../../layouts/layouttwo/[id]/page.js')),
  layoutthree: React.lazy(() => import('../../../layouts/layoutthree/[id]/page.js')),
  layoutfour: React.lazy(() => import('../../../layouts/layoutfour/[id]/page.js')),
  layoutfive: React.lazy(() => import('../../../layouts/layoutfive/[id]/page.js')),
  layoutsix: React.lazy(() => import('../../../layouts/layoutsix/[id]/page.js')),
  layoutseven: React.lazy(() => import('../../../layouts/layoutseven/[id]/page.js')),
  layouteight: React.lazy(() => import('../../../layouts/layouteight/[id]/page.js')),
  layoutnine: React.lazy(() => import('../../../layouts/layoutnine/[id]/page.js')),
  layoutten: React.lazy(() => import('../../../layouts/layoutten/[id]/page.js')),
  layouteleven: React.lazy(() => import('../../../layouts/layouteleven/[id]/page.js')),
};

export default function TemplatePreviewer({ templateId, formData, template }) {
  const layoutFolder = getLayoutFolder(templateId);
  const TemplateComponent = templateImports[layoutFolder] || templateImports['layoutone'];

  // Build the content object for preview
  const content = useMemo(() => buildContentObject(formData, template), [formData, template]);

  // The template expects a 'content' prop, so we mock useState/useEffect inside the template
  // We'll use a wrapper to inject the content prop
  function TemplateWithContent() {
    React.useEffect(() => {
      // Only patch fetch
      const originalFetch = window.fetch;
      window.fetch = async (url, ...args) => {
        if (url.includes("/api/upload")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              content: [content], // always return the preview content
            }),
          };
        }
        return originalFetch(url, ...args);
      };
      return () => {
        window.fetch = originalFetch;
      };
    }, [content]);
    // The template will call fetch and get our content
    return <TemplateComponent />;
  }

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-auto">
      <Suspense fallback={<div className="p-8 text-center text-blue-600">Loading preview...</div>}>
        <TemplateWithContent />
      </Suspense>
    </div>
  );
} 