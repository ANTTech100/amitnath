import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  tenantToken: {
    type: String,
    required: false,
    index: true,
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
  backgroundColor: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(value);
      },
      message:
        "Invalid hex color format. Use a valid hex color code (e.g., #ffffff or #fff)",
    },
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
  askUserDetails: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Content =
  mongoose.models.Content || mongoose.model("Content", contentSchema);
export default Content;
