// models/Template.js
import mongoose from "mongoose";

// Schema for section configuration based on type
const configSchema = new mongoose.Schema(
  {
    // Text section config
    minLength: Number,
    maxLength: Number,
    placeholder: String,
    format: {
      type: String,
      enum: ["plain", "markdown", "html"],
      default: "plain",
    },

    // Image section config
    maxSize: Number, // in MB
    allowedTypes: [String],
    width: Number,
    height: Number,
    aspectRatio: String,

    // Video section config
    maxDuration: Number, // in seconds
    allowedSources: [String],

    // File section config
    // maxSize is already defined above
    // allowedTypes is already defined above

    // Link section config
    validateUrl: { type: Boolean, default: true },
    allowedDomains: [String],
  },
  { _id: false, strict: false }
);

// Schema for template sections
const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["text", "image", "video", "file", "link"],
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    required: { type: Boolean, default: false },
    order: { type: Number, required: true },
    config: { type: configSchema, default: {} },
  },
  { _id: false }
);

// Main template schema
const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      required: true,
      enum: ["basic", "article", "gallery", "portfolio", "report"],
      default: "basic",
    },
    status: {
      type: String,
      // required: true,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    sections: [sectionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for template URL
templateSchema.virtual("url").get(function () {
  return `/templates/${this._id}`;
});

// Pre-save hook to ensure sections are ordered correctly
templateSchema.pre("save", function (next) {
  if (this.sections && this.sections.length > 0) {
    // Make sure sections are ordered properly
    this.sections.sort((a, b) => a.order - b.order);
  }
  next();
});

// Static method to find published templates
templateSchema.statics.findPublished = function (query = {}) {
  return this.find({
    ...query,
    status: "published",
  });
};

// Method to duplicate a template
templateSchema.methods.duplicate = function (userId) {
  const duplicate = this.toObject();
  delete duplicate._id;
  duplicate.name = `${duplicate.name} (Copy)`;
  duplicate.status = "draft";
  duplicate.createdBy = userId;
  duplicate.updatedBy = userId;
  duplicate.usageCount = 0;
  duplicate.createdAt = new Date();
  duplicate.updatedAt = new Date();
  return new mongoose.models.Template(duplicate);
};

// Check if model already exists to prevent overwriting
const Template =
  mongoose.models.Template || mongoose.model("Template", templateSchema);

export default Template;
