import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    password: {
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

const Password =
  mongoose.models.Password || mongoose.model("Password", passwordSchema);

export default Password;
