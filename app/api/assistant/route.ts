import { assistantSystemHints, buildPortfolioAssistantSystemPrompt } from "@/lib/assistantPrompts";
import { assistantProfile, findProjectBySlug, projects } from "@/lib/mainData";

type AssistantRequest = {
  prompt?: string;
  projectSlug?: string;
};

type OpenAIOutput = {
  text?: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: OpenAIOutput[];
  }>;
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

type ModelReplyResult = {
  reply: string | null;
  providerConfigured: boolean;
  error?: string;
};

const MAX_PROMPT_LENGTH = 1200;

const projectCatalog = projects
  .map((project, index) => `${index + 1}. ${project.title} - ${project.tagline} ${project.summary}`)
  .join("\n");

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getSafeString(value: unknown) {
  return typeof value === "string" ? normalizeText(value) : "";
}

async function getModelReply(
  prompt: string,
  project: NonNullable<ReturnType<typeof findProjectBySlug>>
): Promise<ModelReplyResult> {
  const systemPrompt = buildPortfolioAssistantSystemPrompt();

  const projectContext = [
    `Name: ${assistantProfile.name}`,
    `Role: ${assistantProfile.role}`,
    `Intro: ${assistantProfile.intro}`,
    `Interests: ${assistantProfile.interests.join(", ")}`,
    `Strengths: ${assistantProfile.strengths.join(", ")}`,
    `Student perspective: ${assistantProfile.perspectives.student}`,
    `Client perspective: ${assistantProfile.perspectives.client}`,
    `Developer perspective: ${assistantProfile.perspectives.developer}`,
    `Project title: ${project.title}`,
    `Tagline: ${project.tagline}`,
    `Summary: ${project.summary}`,
    `Stack: ${project.stack.join(", ")}`,
    `Assistant seed: ${project.assistantSeed}`,
    "Project catalog:",
    projectCatalog
  ].join("\n");

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  let providerConfigured = false;

  if (geminiApiKey) {
    providerConfigured = true;
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
              temperature: 0.5,
              maxOutputTokens: 240
            },
            contents: [
              {
                role: "user",
                parts: [{ text: `${projectContext}\n\nUser question: ${prompt}` }]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = (await response.json()) as GeminiResponse;
        const geminiText = data.candidates
          ?.flatMap((candidate) => candidate.content?.parts ?? [])
          .map((part) => part.text ?? "")
          .find((text) => text.trim().length > 0);

        if (geminiText) {
          return { reply: normalizeText(geminiText), providerConfigured };
        }

        return {
          reply: null,
          providerConfigured,
          error: "Gemini returned an empty response."
        };
      }

      const errorData = (await response.json()) as GeminiResponse;
      return {
        reply: null,
        providerConfigured,
        error: errorData.error?.message || `Gemini request failed with status ${response.status}.`
      };
    } catch {
      return {
        reply: null,
        providerConfigured,
        error: "Gemini request failed due to a network or server error."
      };
    }
  }

  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();

  if (!openAiApiKey) {
    return { reply: null, providerConfigured };
  }

  providerConfigured = true;

  const openAiModel = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: openAiModel,
        max_output_tokens: 240,
        temperature: 0.5,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: systemPrompt
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `${projectContext}\n\nUser question: ${prompt}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      return {
        reply: null,
        providerConfigured,
        error: `OpenAI request failed with status ${response.status}.`
      };
    }

    const data = (await response.json()) as OpenAIResponse;

    if (typeof data.output_text === "string" && data.output_text.trim()) {
      return { reply: normalizeText(data.output_text), providerConfigured };
    }

    const fallbackText = data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? "")
      .find((text) => text.trim().length > 0);

    if (fallbackText) {
      return { reply: normalizeText(fallbackText), providerConfigured };
    }

    return {
      reply: null,
      providerConfigured,
      error: "OpenAI returned an empty response."
    };
  } catch {
    return {
      reply: null,
      providerConfigured,
      error: "OpenAI request failed due to a network or server error."
    };
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  let payload: AssistantRequest;

  try {
    payload = (await request.json()) as AssistantRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = getSafeString(payload.prompt);
  const projectSlug = getSafeString(payload.projectSlug);
  const project = findProjectBySlug(projectSlug);

  if (!prompt) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return Response.json(
      { error: `Prompt is too long. Maximum length is ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (!project) {
    return Response.json({ error: "Invalid project selection." }, { status: 400 });
  }

  const normalizedPrompt = prompt.toLowerCase();

  const modelResult = await getModelReply(prompt, project);

  if (modelResult.reply) {
    return Response.json(
      { reply: modelResult.reply },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  if (modelResult.providerConfigured) {
    return Response.json(
      {
        error: modelResult.error || "AI provider is configured but did not return a reply."
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const focus = normalizedPrompt.includes("telemetry")
    ? "The telemetry layer is designed to expose the health of the system in a way that supports debugging under field conditions."
    : normalizedPrompt.includes("diagram") || normalizedPrompt.includes("architecture")
      ? "The architecture is intentionally separated into sensing, embedded coordination, control, and monitoring so each layer can be reasoned about independently."
      : normalizedPrompt.includes("ai") || normalizedPrompt.includes("vision")
        ? "The AI path is useful only because it stays inside a constrained control loop, where perception informs action without overwhelming the embedded stack."
        : "The project is structured like a production engineering system, with clear boundaries between hardware, control, sensing, and operator visibility.";

  const identityReply = `${assistantProfile.intro} I am interested in ${assistantProfile.interests.join(", ")}, and I usually explain work through student, client, and developer perspectives.`;
  const projectReply = `Current projects: ${projectCatalog.replace(/\n/g, "; ")}.`;
  const perspectiveReply = normalizedPrompt.includes("student")
    ? assistantProfile.perspectives.student
    : normalizedPrompt.includes("client")
      ? assistantProfile.perspectives.client
      : normalizedPrompt.includes("developer")
        ? assistantProfile.perspectives.developer
        : null;

  let reply: string;

  if (/(who are you|tell me about yourself|introduce yourself|about you)/.test(normalizedPrompt)) {
    reply = identityReply;
  } else if (/(current projects|your projects|what are your projects|projects are you working on|list projects)/.test(normalizedPrompt)) {
    reply = projectReply;
  } else if (perspectiveReply) {
    reply = perspectiveReply;
  } else {
    reply = [
      `${project.title}: ${project.tagline}`,
      focus,
      `For this build, ${project.assistantSeed}`,
      `Relevant stack: ${project.stack.join(", ")}.`,
      `You can also ask me for a student, client, or developer perspective.`,
      assistantSystemHints.join(" ")
    ].join(" ");
  }

  return Response.json(
    { reply },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}