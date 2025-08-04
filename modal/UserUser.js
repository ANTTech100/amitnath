import mongoose from "mongoose";

// Define schema for user registration
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures unique email addresses
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], // Email validation
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    validated: {
      type: Boolean,
      default: false, // Indicates if the user has been validated
    },
    tenantToken: {
      type: String,
      required: false, // Optional for backward compatibility
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
