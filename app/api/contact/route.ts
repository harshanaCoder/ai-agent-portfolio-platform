import { Resend } from 'resend';

type ContactRequest = {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getSafeString(value: unknown) {
  return typeof value === "string" ? normalizeText(value) : "";
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = requestBuckets.get(key);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX) {
    return true;
  }

  requestBuckets.set(key, current);
  return false;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { ok: false, message: "Content-Type must be application/json." },
      { status: 415 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return Response.json(
      { ok: false, message: "Request body is too large." },
      { status: 413 }
    );
  }

  if (isRateLimited(getClientKey(request))) {
    return Response.json(
      { ok: false, message: "Too many requests. Please wait a minute before trying again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let payload: ContactRequest;

  try {
    payload = (await request.json()) as ContactRequest;
  } catch {
    return Response.json(
      { ok: false, message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name = getSafeString(payload.name);
  const email = getSafeString(payload.email).toLowerCase();
  const projectType = getSafeString(payload.projectType);
  const messageBody = getSafeString(payload.message);

  if (!name || !email || !messageBody) {
    return Response.json(
      { ok: false, message: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!emailPattern.test(email)) {
    return Response.json(
      { ok: false, message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (name.length > 120 || projectType.length > 120 || messageBody.length > 4000) {
    return Response.json(
      { ok: false, message: "One or more fields are too long." },
      { status: 400 }
    );
  }

  try {
    // Note: Resend requires a verified sending domain. If you haven't verified a domain on Resend,
    // you must use `onboarding@resend.dev` as the sender, and you can only send to yourself.
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'h.softwaredeveloper.project@gmail.com', // MUST match the Resend account email
      replyTo: email,
      subject: `New Portfolio Inquiry from ${name} - ${projectType || 'General Inquiry'}`,
      text: `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${messageBody}`,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return Response.json(
        { ok: false, message: "Failed to send the message. Please try again later." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        ok: true,
        message: `Thanks ${name}. Your inquiry has been sent to my inbox successfully. I will get back to you soon!`
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Serverside Error:", error);
    return Response.json(
      { ok: false, message: "An unexpected error occurred while sending the email." },
      { status: 500 }
    );
  }
}