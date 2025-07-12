import { connectDB } from "@/config/Database";
import Popop from "@/modal/popop";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const newPopop = new Popop({ name, email, phone });
    await newPopop.save();
    return new Response(
      JSON.stringify({
        message: "Popop created successfully",
        popop: newPopop,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating Popop:", error);
    return new Response(JSON.stringify({ error: "Failed to create Popop" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
