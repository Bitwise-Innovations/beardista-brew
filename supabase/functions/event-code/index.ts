import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RegisterRequest = {
  action: "register";
  eventId: number;
  email: string;
  fullName: string;
  phone?: string | null;
};

type VerifyRequest = {
  action: "verify";
  registrationId: string;
  code: string;
};

type RegistrationResult = {
  id: string;
  eventId: number;
  userEmail: string;
  fullName: string;
};

type VerificationResult = RegistrationResult & {
  eventTitle: string;
  status: "confirmed" | "waitlisted";
};

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

function createVerificationCode() {
  const range = 0x1_0000_0000;
  const limit = range - (range % 1_000_000);
  const values = new Uint32Array(1);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return (values[0] % 1_000_000).toString().padStart(6, "0");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

async function sendBrevoEmail(
  email: string,
  name: string,
  subject: string,
  htmlContent: string,
) {
  const apiKey = getRequiredSecret("BREVO_API_KEY");
  const senderEmail = getRequiredSecret("BREVO_SENDER_EMAIL");
  const senderName = Deno.env.get("BREVO_SENDER_NAME") ?? "Beardista Brew";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
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

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

async function register(request: RegisterRequest, supabase: ReturnType<typeof createClient>) {
  if (
    !Number.isSafeInteger(request.eventId) ||
    request.eventId <= 0 ||
    !isValidEmail(request.email) ||
    typeof request.fullName !== "string" ||
    request.fullName.trim().length < 1 ||
    request.fullName.length > 200 ||
    (request.phone != null &&
      (typeof request.phone !== "string" || request.phone.length > 40))
  ) {
    return jsonResponse({ error: "Valid event, email, name, and phone are required." }, 400);
  }

  const code = createVerificationCode();
  const { data, error } = await supabase.rpc("create_event_registration", {
    p_event_id: request.eventId,
    p_user_email: request.email.trim(),
    p_full_name: request.fullName.trim(),
    p_phone: request.phone?.trim() || null,
    p_verification_code: code,
  });

  if (error) {
    if (error.code === "55000") {
      return jsonResponse({ error: error.message }, 429);
    }
    if (error.code === "23505") {
      return jsonResponse({ error: "This email is already registered for the event." }, 409);
    }
    if (error.code === "P0002") {
      return jsonResponse({ error: "This event is not open for registration." }, 404);
    }
    console.error("Could not create event registration", error);
    return jsonResponse({ error: "Could not create the event registration." }, 500);
  }

  const registration = data as RegistrationResult;
  try {
    await sendBrevoEmail(
      registration.userEmail,
      registration.fullName,
      "Verify your Beardista Brew event registration",
      `<p>Hello ${escapeHtml(registration.fullName)},</p><p>Your verification code is <strong>${code}</strong>.</p><p>Enter this code to complete your event registration.</p>`,
    );
  } catch (error) {
    console.error("Could not send event verification email", error);
    return jsonResponse(
      {
        error: "Registration was saved, but the verification email could not be sent. Please retry.",
        registrationId: registration.id,
      },
      502,
    );
  }

  return jsonResponse({
    registrationId: registration.id,
    status: "pending",
    message: "Verification code sent.",
  });
}

async function verify(request: VerifyRequest, supabase: ReturnType<typeof createClient>) {
  if (
    typeof request.registrationId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      request.registrationId,
    ) ||
    typeof request.code !== "string" ||
    !/^\d{6}$/.test(request.code)
  ) {
    return jsonResponse({ error: "A valid registration ID and six-digit code are required." }, 400);
  }

  const { data, error } = await supabase.rpc("verify_event_registration", {
    p_registration_id: request.registrationId,
    p_verification_code: request.code,
  });

  if (error) {
    if (error.code === "P0002") {
      return jsonResponse({ error: "Registration not found." }, 404);
    }
    if (error.code === "22023") {
      return jsonResponse({ error: error.message }, 400);
    }
    console.error("Could not verify event registration", error);
    return jsonResponse({ error: "Could not verify the event registration." }, 500);
  }

  const registration = data as VerificationResult;
  if ("error" in registration) {
    return jsonResponse({ error: registration.error }, 400);
  }

  try {
    const statusMessage =
      registration.status === "confirmed"
        ? "Your registration is confirmed."
        : "The event is at capacity. You have been added to the waitlist.";
    await sendBrevoEmail(
      registration.userEmail,
      registration.fullName,
      `Your ${registration.eventTitle} registration`,
      `<p>Hello ${escapeHtml(registration.fullName)},</p><p>${escapeHtml(statusMessage)}</p>`,
    );
  } catch (error) {
    console.error("Could not send event confirmation email", error);
    return jsonResponse(
      { error: "Registration verified, but the confirmation email could not be sent." },
      502,
    );
  }

  return jsonResponse({
    registrationId: registration.id,
    status: registration.status,
    message:
      registration.status === "confirmed"
        ? "Registration confirmed."
        : "Registration verified and added to the waitlist.",
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  let body: RegisterRequest | VerifyRequest;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  try {
    const supabase = createClient(
      getRequiredSecret("SUPABASE_URL"),
      getRequiredSecret("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    if (body.action === "register") return await register(body, supabase);
    if (body.action === "verify") return await verify(body, supabase);
    return jsonResponse({ error: "Unsupported action." }, 400);
  } catch (error) {
    console.error("Event verification function failed", error);
    return jsonResponse({ error: "Event registration service is unavailable." }, 500);
  }
});
