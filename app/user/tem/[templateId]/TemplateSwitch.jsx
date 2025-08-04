"use client"
import React, { useState } from "react";
import { useParams } from "next/navigation";

// Dummy template IDs for demonstration
const TEMPLATE_IDS = {
  layoutOne: "682cb700051ac17f87283deb",
  layoutTwo: "TEMPLATE_ID_TWO",
  layoutThree: "TEMPLATE_ID_THREE",
  layoutFour: "TEMPLATE_ID_FOUR",
  layoutFive: "TEMPLATE_ID_FIVE",
  layoutSix: "TEMPLATE_ID_SIX",
  layoutSeven: "TEMPLATE_ID_SEVEN",
  layoutEight: "TEMPLATE_ID_EIGHT",
  layoutNine: "TEMPLATE_ID_NINE",
  layoutTen: "TEMPLATE_ID_TEN",
  layoutEleven: "TEMPLATE_ID_ELEVEN",
};

function LayoutOne({ content }) {
  return (
    <div style={{ background: content.backgroundColor || "#fff", padding: 32, borderRadius: 16 }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>{content.heading || "Heading"}</h1>
      <h2 style={{ fontSize: 20, color: "#666", marginBottom: 24 }}>{content.subheading || "Subheading"}</h2>
      <div style={{ fontSize: 16, color: "#333" }}>{content.body || "Body content goes here."}</div>
    </div>
  );
}

function LayoutTwo({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Two Preview (dummy)</div>;
}
function LayoutThree({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Three Preview (dummy)</div>;
}
function LayoutFour({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Four Preview (dummy)</div>;
}
function LayoutFive({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Five Preview (dummy)</div>;
}
function LayoutSix({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Six Preview (dummy)</div>;
}
function LayoutSeven({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Seven Preview (dummy)</div>;
}
function LayoutEight({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Eight Preview (dummy)</div>;
}
function LayoutNine({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Nine Preview (dummy)</div>;
}
function LayoutTen({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Ten Preview (dummy)</div>;
}
function LayoutEleven({ content }) {
  return <div style={{ padding: 32, border: "2px dashed #aaa", borderRadius: 16 }}>Layout Eleven Preview (dummy)</div>;
}

export default function TemplateSwitch() {
  const params = useParams();
  const templateId = params?.templateId;

  // Form state
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    backgroundColor: "#f5f5f5",
    body: "",
  });

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Switch-case for layouts
  let PreviewComponent;
  switch (templateId) {
    case TEMPLATE_IDS.layoutOne:
      PreviewComponent = <LayoutOne content={formData} />;
      break;
    case TEMPLATE_IDS.layoutTwo:
      PreviewComponent = <LayoutTwo content={formData} />;
      break;
    case TEMPLATE_IDS.layoutThree:
      PreviewComponent = <LayoutThree content={formData} />;
      break;
    case TEMPLATE_IDS.layoutFour:
      PreviewComponent = <LayoutFour content={formData} />;
      break;
    case TEMPLATE_IDS.layoutFive:
      PreviewComponent = <LayoutFive content={formData} />;
      break;
    case TEMPLATE_IDS.layoutSix:
      PreviewComponent = <LayoutSix content={formData} />;
      break;
    case TEMPLATE_IDS.layoutSeven:
      PreviewComponent = <LayoutSeven content={formData} />;
      break;
    case TEMPLATE_IDS.layoutEight:
      PreviewComponent = <LayoutEight content={formData} />;
      break;
    case TEMPLATE_IDS.layoutNine:
      PreviewComponent = <LayoutNine content={formData} />;
      break;
    case TEMPLATE_IDS.layoutTen:
      PreviewComponent = <LayoutTen content={formData} />;
      break;
    case TEMPLATE_IDS.layoutEleven:
      PreviewComponent = <LayoutEleven content={formData} />;
      break;
    default:
      PreviewComponent = <div style={{ padding: 32, color: "#c00" }}>Unknown templateId: {templateId}</div>;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "row", background: "#e8eaf6" }}>
      {/* Left: Content Creation Form */}
      <div style={{ flex: 1, maxWidth: 480, background: "#fff", borderRadius: 16, margin: 32, padding: 32, boxShadow: "0 2px 16px #0001" }}>
        <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Content Creation</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Heading</label>
          <input name="heading" value={formData.heading} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Subheading</label>
          <input name="subheading" value={formData.subheading} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Body</label>
          <textarea name="body" value={formData.body} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", minHeight: 80 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Background Color</label>
          <input name="backgroundColor" type="color" value={formData.backgroundColor} onChange={handleChange} style={{ width: 48, height: 32, border: "none", background: "none" }} />
        </div>
      </div>
      {/* Right: Live Preview */}
      <div style={{ flex: 2, margin: 32, padding: 32, background: "#f5f5f5", borderRadius: 16, boxShadow: "0 2px 16px #0001", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {PreviewComponent}
      </div>
    </div>
  );
} 