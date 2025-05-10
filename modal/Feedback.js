// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    adminid: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    changes: {
      type: String,
      trim: true,
    },
    updates: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;
