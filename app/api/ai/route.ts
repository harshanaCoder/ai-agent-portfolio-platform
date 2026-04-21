import { buildVoiceAgentSystemPrompt } from "@/lib/assistantPrompts";
import { portfolioData } from "@/lib/voiceAssistantData";

type AiRequest = {
  message?: string;
  intent?: string;
  history?: Array<{
    role?: string;
    content?: string;
  }>;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const MAX_MESSAGE_LENGTH = 1200;

function normalizeIntent(value: string | undefined) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeHistory(history: AiRequest["history"]) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item) =>
        (item?.role === "user" || item?.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .slice(-10)
    .map((item) => ({
      role: item.role as "user" | "assistant",
      content: normalizeText(item.content as string)
    }));
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  let payload: AiRequest;

  try {
    payload = (await request.json()) as AiRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof payload.message === "string" ? normalizeText(payload.message) : "";
  const intent = normalizeIntent(payload.intent);

  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json(
      { error: `Message is too long. Maximum is ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const intentGuidance = {
    bio: "Respond with the user's bio, role, and intro first, then add one concise context sentence.",
    education: "Respond with the education path and journey story in a short, structured style.",
    projects: "List the most relevant projects first, then give a compact explanation of what each one does.",
    certificates: "Return only certificate details from the credentials data, with issuer and issue date.",
    badges: "Return only badge details from the credentials data, with issuer and issue date.",
    licenses: "Return only license details from the credentials data, with issuer and issue date.",
    contact: "Return the contact details clearly and briefly, including email, GitHub, LinkedIn, and resume link."
  }[intent];

  const systemPrompt = intentGuidance
    ? `${buildVoiceAgentSystemPrompt(portfolioData)}\n\nIntent guidance: ${intentGuidance}`
    : buildVoiceAgentSystemPrompt(portfolioData);
  const history = sanitizeHistory(payload.history);
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  if (geminiApiKey) {
    const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 420
            },
            contents: [
              ...history.map((item) => ({
                role: item.role === "assistant" ? "model" : "user",
                parts: [{ text: item.content }]
              })),
              {
                role: "user",
                parts: [{ text: message }]
              }
            ]
          })
        }
      );

      const data = (await response.json()) as GeminiResponse;

      if (!response.ok) {
        return Response.json(
          {
            error: data.error?.message || `Gemini request failed with status ${response.status}.`
          },
          { status: 502 }
        );
      }

      const reply = data.candidates
        ?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => part.text ?? "")
        .find((text) => text.trim().length > 0)
        ?.trim();

      if (!reply) {
        return Response.json({ error: "Gemini returned an empty response." }, { status: 502 });
      }

      return Response.json(
        { reply },
        {
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    } catch {
      return Response.json({ error: "Gemini provider request failed." }, { status: 502 });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim() || process.env.LLM_API_KEY?.trim();

  if (!apiKey) {
    return Response.json(
      { error: "Server AI key is missing. Set GEMINI_API_KEY or OPENAI_API_KEY (or LLM_API_KEY)." },
      { status: 500 }
    );
  }

  const baseUrl = (process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 420,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message }
        ]
      })
    });

    const data = (await response.json()) as ChatCompletionResponse;

    if (!response.ok) {
      return Response.json(
        {
          error: data.error?.message || `LLM request failed with status ${response.status}.`
        },
        { status: 502 }
      );
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return Response.json({ error: "Model returned an empty response." }, { status: 502 });
    }

    return Response.json(
      { reply },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return Response.json({ error: "AI provider request failed." }, { status: 502 });
  }
}