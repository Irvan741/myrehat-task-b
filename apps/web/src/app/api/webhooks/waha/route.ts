import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { event, payload } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    const from = (payload as any).from;
    const msgBody = (payload as any).body;

    if (typeof from !== "string" || from.trim() === "" || typeof msgBody !== "string" || msgBody.trim() === "") {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    try {
      const apiKey = process.env.OPENROUTER_API_KEY || "";
      const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

      const openrouter = createOpenRouter({
        apiKey,
      });

      const { text } = await generateText({
        model: openrouter(model),
        prompt: `You are a helpful homestay concierge. User message: ${msgBody}`,
      });

      return NextResponse.json({
        to: from,
        reply: text ?? "",
      });
    } catch {
      return NextResponse.json({
        to: from,
        reply: "Halo! Ada yang bisa saya bantu?",
      });
    }
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
