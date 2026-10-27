import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AdminClient = ReturnType<typeof createClient>;
type Answer = { questionId: number; value: string | string[] };

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getRequiredSecret(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required Edge Function secret: ${name}`);
  return value;
}

// Six random digits, every value equally likely.
function createVerificationCode() {
  const range = 0x1_0000_0000;
  const limit = range - (range % 1_000_000);
  const values = new Uint32Array(1);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return (values[0] % 1_000_000).toString().padStart(6, "0");
}

// HMAC-SHA256 with a server-only secret, so stored hashes can't be reversed.
async function hashCode(code: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getRequiredSecret("EVENT_CODE_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(code));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

function emailLayout(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#19244E">
    <p style="font-size:12px;font-weight:bold;letter-spacing:2px;color:#E58422;margin:0">BEARDISTA BREW</p>
    <h1 style="font-size:20px;margin:8px 0 16px">${title}</h1>
    ${body}
    <p style="font-size:12px;color:#6b7280;margin-top:24px">If you didn't request this, you can ignore this email.</p>
  </div>`;
}

function codeEmail(name: string, eventTitle: string, code: string) {
  return emailLayout(
    "Confirm your registration",
    `<p>Hi ${escapeHtml(name)},</p>
     <p>Use this code to confirm your spot at <strong>${escapeHtml(eventTitle)}</strong>:</p>
     <p style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#FFF3E7;border-radius:12px;padding:16px;text-align:center;margin:16px 0">${code}</p>
     <p style="font-size:13px;color:#6b7280">The code expires in 10 minutes.</p>`,
  );
}

async function sendBrevoEmail(email: string, name: string, subject: string, htmlContent: string) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": getRequiredSecret("BREVO_API_KEY"),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: getRequiredSecret("BREVO_SENDER_EMAIL"),
        name: Deno.env.get("BREVO_SENDER_NAME") ?? "Beardista Brew",
      },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  });
  if (!response.ok) {
    console.error("Brevo email delivery failed", response.status);
    throw new Error("Email delivery failed");
  }
}

function isPositiveInt(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isValidAnswers(value: unknown): value is Answer[] {
  if (!Array.isArray(value) || value.length > 50) return false;
  return value.every((answer) => {
    if (!answer || typeof answer !== "object" || !isPositiveInt(answer.questionId)) return false;
    const answerValue = answer.value;
    if (typeof answerValue === "string") return answerValue.length <= 2000;
    return Array.isArray(answerValue) && answerValue.length <= 20 &&
      answerValue.every((item: unknown) => typeof item === "string" && item.length <= 200);
  });
}

// Maps database error codes to friendly HTTP responses.
function databaseError(error: { code?: string; message?: string }, fallback: string) {
  if (error.code === "55000") return jsonResponse({ error: error.message }, 429);
  if (error.code === "23505") return jsonResponse({ error: error.message }, 409);
  if (error.code === "P0002") return jsonResponse({ error: error.message }, 404);
  if (error.code === "22023") return jsonResponse({ error: error.message }, 400);
  console.error(fallback, error);
  return jsonResponse({ error: fallback }, 500);
}

async function register(body: Record<string, unknown>, admin: AdminClient) {
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const answers = body.answers ?? [];

  if (
    !isPositiveInt(body.eventId) ||
    !isPositiveInt(body.participantTypeId) ||
    !EMAIL_PATTERN.test(email) || email.length > 254 ||
    fullName.length < 1 || fullName.length > 200 ||
    !isValidAnswers(answers)
  ) {
    return jsonResponse({ error: "Please fill in your name, a valid email, and the form answers." }, 400);
  }

  const code = createVerificationCode();
  const { data, error } = await admin.rpc("create_event_registration", {
    p_event_id: body.eventId,
    p_participant_type_id: body.participantTypeId,
    p_user_email: email,
    p_full_name: fullName,
    p_answers: answers,
    p_code_hash: await hashCode(code),
  });
  if (error) return databaseError(error, "Could not save the registration.");

  const registration = data as { id: string; userEmail: string; fullName: string; eventTitle: string };
  try {
    await sendBrevoEmail(
      registration.userEmail,
      registration.fullName,
      `Your code for ${registration.eventTitle}`,
      codeEmail(registration.fullName, registration.eventTitle, code),
    );
  } catch {
    return jsonResponse(
      { error: "Your sign-up was saved, but we couldn't send the code. Tap Resend code.", registrationId: registration.id },
      502,
    );
  }

  return jsonResponse({ registrationId: registration.id, message: "Verification code sent." });
}

async function resend(body: Record<string, unknown>, admin: AdminClient) {
  if (typeof body.registrationId !== "string" || !UUID_PATTERN.test(body.registrationId)) {
    return jsonResponse({ error: "A valid registration is required." }, 400);
  }

  const code = createVerificationCode();
  const { data, error } = await admin.rpc("resend_event_code", {
    p_registration_id: body.registrationId,
    p_code_hash: await hashCode(code),
  });
  if (error) return databaseError(error, "Could not send a new code.");

  const registration = data as { userEmail: string; fullName: string; eventTitle: string };
  try {
    await sendBrevoEmail(
      registration.userEmail,
      registration.fullName,
      `Your new code for ${registration.eventTitle}`,
      codeEmail(registration.fullName, registration.eventTitle, code),
    );
  } catch {
    return jsonResponse({ error: "We couldn't send the email. Please try again in a minute." }, 502);
  }

  return jsonResponse({ message: "A new code was sent." });
}

async function verify(body: Record<string, unknown>, admin: AdminClient) {
  if (
    typeof body.registrationId !== "string" || !UUID_PATTERN.test(body.registrationId) ||
    typeof body.code !== "string" || !/^\d{6}$/.test(body.code)
  ) {
    return jsonResponse({ error: "Enter the six-digit code from your email." }, 400);
  }

  const { data, error } = await admin.rpc("verify_event_registration", {
    p_registration_id: body.registrationId,
    p_code_hash: await hashCode(body.code),
  });
  if (error) return databaseError(error, "Could not verify the code.");

  const result = data as Record<string, unknown>;
  if (result.error) return jsonResponse(result, 400);

  if (!result.alreadyVerified) {
    const confirmed = result.status === "confirmed";
    try {
      await sendBrevoEmail(
        result.userEmail as string,
        result.fullName as string,
        confirmed ? `You're in: ${result.eventTitle}` : `You're on the waitlist: ${result.eventTitle}`,
        emailLayout(
          confirmed ? "You're registered!" : "You're on the waitlist",
          `<p>Hi ${escapeHtml(result.fullName as string)},</p>
           <p>${
             confirmed
               ? `Your spot at <strong>${escapeHtml(result.eventTitle as string)}</strong> is confirmed. See you there!`
               : `<strong>${escapeHtml(result.eventTitle as string)}</strong> is full right now. We'll let you know if a spot opens up.`
           }</p>`,
        ),
      );
    } catch (emailError) {
      // The registration is already confirmed; a missing email shouldn't undo that.
      console.error("Could not send confirmation email", emailError);
    }
  }

  return jsonResponse({ registrationId: result.id, status: result.status });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  try {
    const admin = createClient(
      getRequiredSecret("SUPABASE_URL"),
      getRequiredSecret("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    if (body.action === "register") return await register(body, admin);
    if (body.action === "verify") return await verify(body, admin);
    if (body.action === "resend") return await resend(body, admin);
    return jsonResponse({ error: "Unsupported action." }, 400);
  } catch (error) {
    console.error("event-code function failed", error);
    return jsonResponse({ error: "Event registration is unavailable right now." }, 500);
  }
});