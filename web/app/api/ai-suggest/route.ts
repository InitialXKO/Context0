import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const preferredRegion = ["iad1", "sfo1"] as const;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function GET() {
  return NextResponse.json({
    providerAvailable: Boolean(process.env.OPENAI_API_KEY),
    message: process.env.OPENAI_API_KEY
      ? "AI suggestions are enabled. Send a POST request with a prompt to receive insights."
      : "AI suggestions are disabled. Add an OPENAI_API_KEY to enable this endpoint."
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const prompt = typeof body.prompt === "string" ? body.prompt : "";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        message: "AI suggestions are disabled. Add an OPENAI_API_KEY to enable this endpoint.",
        suggestions: [],
        providerAvailable: false
      },
      { status: 503 }
    );
  }

  if (!prompt) {
    return NextResponse.json(
      {
        message: "Please include a prompt describing the clinical scenario for suggestions.",
        providerAvailable: true
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a clinical skills coach. Provide succinct action items to help a learner progress through a simulation exam."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 180
      })
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      console.error("OpenAI proxy request failed", response.status, errorPayload);
      return NextResponse.json(
        {
          message: "The AI provider returned an error. Try again soon.",
          providerAvailable: true
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json(
      {
        providerAvailable: true,
        message: content || "The AI assistant did not return a suggestion."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to proxy AI suggestion", error);
    return NextResponse.json(
      {
        message: "Unable to reach the AI provider.",
        providerAvailable: true
      },
      { status: 500 }
    );
  }
}
