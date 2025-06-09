import Issue from "@/modal/issue";
import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, issue } = await request.json();

    if (!name || !email || !issue) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newIssue = new Issue({
      name,
      email,
      issue,
    });

    await newIssue.save();

    return NextResponse.json(
      { message: "Issue reported successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error reporting issue:", error);
    return NextResponse.json(
      { error: "Failed to report issue" },
      { status: 500 }
    );
  }
}
