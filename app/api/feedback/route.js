// app/api/admin/feedback/route.js
import Feedback from "@/modal/Feedback";
import { connectDB } from "@/config/Database";
import { NextResponse } from "next/server";

// Handle POST requests to create new feedback
export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();
    const { topic, changes, updates, feedback, adminid } = body;

    // Create new feedback document
    const newFeedback = await Feedback.create({
      adminid,
      topic,
      changes,
      updates,
      feedback,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        data: newFeedback,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Handle GET requests to retrieve feedback
export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // Get search params from URL
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    // Prepare filter object
    const filter = {};
    if (adminId) filter.adminId = adminId;

    // Get feedback entries with optional filtering
    const feedbackEntries = await Feedback.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        count: feedbackEntries.length,
        data: feedbackEntries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
