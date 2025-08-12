import mongoose from "mongoose";

// Schema for MCQ options
const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// Schema for questions
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [optionSchema],
    required: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Schema for template questions
const templateQuestionsSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make it optional for admin
    },
  },
  {
    timestamps: true,
  }
);

// Schema for user responses
const userResponseSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    userInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    responses: [
      {
        questionText: String,
        selectedOption: String,
        isCorrect: Boolean,
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create models
const TemplateQuestions =
  mongoose.models.TemplateQuestions ||
  mongoose.model("TemplateQuestions", templateQuestionsSchema);
const UserResponse =
  mongoose.models.UserResponse ||
  mongoose.model("UserResponse", userResponseSchema);

export { TemplateQuestions, UserResponse };
