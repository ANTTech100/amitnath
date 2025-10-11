import mongoose from "mongoose";

// Schema for accordion guide items
const guideItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["image", "text", "video", "button"],
  },
  content: {
    type: String,
    required: function() {
      return this.type !== "button";
    },
  },
  order: {
    type: Number,
    required: true,
  },
  // Additional properties for different item types
  buttonText: {
    type: String,
    required: function() {
      return this.type === "button";
    },
  },
  buttonLink: {
    type: String,
    required: function() {
      return this.type === "button";
    },
  },
}, { _id: false });

// Schema for accordion guides
const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  items: [guideItemSchema],
  order: {
    type: Number,
    required: true,
  },
}, { _id: false });

// Main accordion content schema
const accordialContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  guides: [guideSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#ffffff",
    validate: {
      validator: function(value) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(value);
      },
      message: "Invalid hex color format",
    },
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Pre-save hook to ensure guides and items are ordered correctly
accordialContentSchema.pre("save", function (next) {
  if (this.guides && this.guides.length > 0) {
    // Sort guides by order
    this.guides.sort((a, b) => a.order - b.order);
    
    // Sort items within each guide by order
    this.guides.forEach(guide => {
      if (guide.items && guide.items.length > 0) {
        guide.items.sort((a, b) => a.order - b.order);
      }
    });
  }
  next();
});

// Virtual for content URL
accordialContentSchema.virtual("url").get(function () {
  return `/acordial/view/${this._id}`;
});

// Static method to find published content
accordialContentSchema.statics.findPublished = function (query = {}) {
  return this.find({
    ...query,
    isPublished: true,
  });
};

const AccordialContent = mongoose.models.AccordialContent || mongoose.model("AccordialContent", accordialContentSchema);

export default AccordialContent;
