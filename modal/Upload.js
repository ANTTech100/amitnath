import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  subheading: {
    type: String,
    required: true,
    trim: true,
  },
  sections: {
    type: Map,
    of: {
      type: { type: String, required: true },
      value: { type: String, required: true },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Content =
  mongoose.models.Content || mongoose.model("Content", contentSchema);
export default Content;
