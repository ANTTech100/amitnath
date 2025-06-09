import mongoose from "mongoose";
const issuesceama = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  issue: {
    type: String,
  },
  createdat: {
    type: Date,
    default: Date.now,
    index: true,
  },
});
const Issue = mongoose.models.Issue || mongoose.model("Issue", issuesceama);
export default Issue;
