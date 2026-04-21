type TtsRequest = {
  text?: string;
};

type ElevenLabsErrorResponse = {
  detail?:
    | {
        message?: string;
      }
    | string;
};

const MAX_TEXT_LENGTH = 2000;

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getSafeString(value: unknown) {
  return typeof value === "string" ? normalizeText(value) : "";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  let payload: TtsRequest;

  try {
    payload = (await request.json()) as TtsRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = getSafeString(payload.text);

  if (!text) {
    return Response.json({ error: "Text is required." }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json(
      { error: `Text is too long. Maximum is ${MAX_TEXT_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  if (!apiKey) {
    return Response.json(
      { error: "Server TTS key is missing. Set ELEVENLABS_API_KEY." },
      { status: 503 }
    );
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || "21m00Tcm4TlvDq8ikWAM";
  const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": apiKey
        },
        signal: controller.signal,
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8
          }
        })
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      let providerMessage = `ElevenLabs request failed with status ${response.status}.`;
      const rawError = await response.text();

      try {
        const errorData = JSON.parse(rawError) as ElevenLabsErrorResponse;

        if (typeof errorData.detail === "string" && errorData.detail.trim()) {
          providerMessage = errorData.detail;
        } else if (
          typeof errorData.detail === "object" &&
          errorData.detail !== null &&
          typeof errorData.detail.message === "string" &&
          errorData.detail.message.trim()
        ) {
          providerMessage = errorData.detail.message;
        } else if (rawError.trim()) {
          providerMessage = rawError.trim();
        }
      } catch {
        if (rawError.trim()) {
          providerMessage = rawError.trim();
        }
      }

      return Response.json(
        {
          error: providerMessage,
          providerStatus: response.status
        },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";

    return Response.json({ error: `ElevenLabs provider request failed. ${message}` }, { status: 502 });
  }
}
