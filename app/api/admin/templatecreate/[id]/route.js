import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Template from "@/modal/Template";
import mongoose from "mongoose";

// GET handler - Get a specific template by ID
export async function GET(request, context) {
  try {
    const id = context.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find template by ID and tenant
    const tenantToken = request.headers.get("x-admin-token");
    if (!tenantToken) {
      return NextResponse.json({ success: false, message: "Missing admin token" }, { status: 401 });
    }

    const template = await Template.findOne({ _id: id, tenantToken });

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

 

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error(
      `Error fetching template with ID ${context.params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT handler - Update a specific template by ID
export async function PUT(request, context) {
  try {
    const id = context.params.id;
    const updateData = await request.json();
    console.log("Update Data:", updateData);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // First fetch the existing template scoped by tenant
    const tenantToken = request.headers.get("x-admin-token");
    if (!tenantToken) {
      return NextResponse.json({ success: false, message: "Missing admin token" }, { status: 401 });
    }
    const existingTemplate = await Template.findOne({ _id: id, tenantToken });

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Hardcode updatedBy field - using the same hardcoded ID as in your main route
    const hardcodedUserId = "644f1a9e4c98e80016d1e8b5";
    updateData.updatedBy = hardcodedUserId;
    updateData.updatedAt = Date.now();

    // Ensure createdBy is preserved if not in update data
    if (!updateData.createdBy) {
      updateData.createdBy = hardcodedUserId;
    }

    // Update the template with new data and return the updated document
    const updatedTemplate = await Template.findOneAndUpdate(
      { _id: id, tenantToken },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "name email");

    return NextResponse.json({
      success: true,
      message: "Template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error(
      `Error updating template with ID ${context.params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a specific template by ID
export async function DELETE(request, context) {
  try {
    const id = context.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete the template scoped by tenant
    const tenantToken = request.headers.get("x-admin-token");
    if (!tenantToken) {
      return NextResponse.json({ success: false, message: "Missing admin token" }, { status: 401 });
    }
    const deletedTemplate = await Template.findOneAndDelete({ _id: id, tenantToken });

    if (!deletedTemplate) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
      data: deletedTemplate,
    });
  } catch (error) {
    console.error(
      `Error deleting template with ID ${context.params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
