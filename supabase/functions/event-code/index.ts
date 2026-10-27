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
  participant_type_id: string;
  answers: Array<{
    question_id: string;
    answer: string;
  }>;
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

type CreatedRegistration = {
  id: string;
  user_email: string;
  full_name: string;
  status: "registered" | "waitlisted";
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

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

async function getSupabaseErrorMessage(error: {
  message: string;
  context: unknown;
}) {
  if (error.context instanceof Response) {
    try {
      const details = await error.context.json();
      if (details && typeof details.message === "string") {
        return details.message;
      }
    } catch (contextError) {
      console.error("Could not extract Supabase error details", contextError);
    }
  }
  return error.message;
}

async function register(
  request: RegisterRequest,
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  if (
    !Number.isSafeInteger(request.eventId) ||
    request.eventId <= 0 ||
    !isUuid(request.participant_type_id) ||
    !Array.isArray(request.answers) ||
    request.answers.some(
      (answer) =>
        !answer ||
        !isUuid(answer.question_id) ||
        typeof answer.answer !== "string",
    )
  ) {
    return jsonResponse(
      { error: "A valid event, participant type, and answers are required." },
      400,
    );
  }

  const code = createVerificationCode();
  const { data, error } = await supabase.rpc("create_event_registration", {
    p_event_id: request.eventId,
    p_user_id: userId,
    p_participant_type_id: request.participant_type_id,
    p_answers: request.answers,
  });

  if (error) {
    const errorMessage = await getSupabaseErrorMessage(error);
    if (error.code === "55000") {
      return jsonResponse({ error: errorMessage }, 429);
    }
    if (error.code === "23505") {
      return jsonResponse({ error: errorMessage }, 409);
    }
    if (error.code === "P0002") {
      return jsonResponse({ error: errorMessage }, 404);
    }
    console.error("Could not create event registration", error);
    return jsonResponse({ error: errorMessage }, 500);
  }

  const registration = data as CreatedRegistration;
  try {
    await sendBrevoEmail(
      registration.user_email,
      registration.full_name,
      "Verify your Beardista Brew event registration",
      `<p>Hello ${escapeHtml(registration.full_name)},</p><p>Your verification code is <strong>${code}</strong>.</p><p>Enter this code to complete your event registration.</p>`,
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
    status: registration.status,
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
    const errorMessage = await getSupabaseErrorMessage(error);
    if (error.code === "P0002") {
      return jsonResponse({ error: errorMessage }, 404);
    }
    if (error.code === "22023") {
      return jsonResponse({ error: errorMessage }, 400);
    }
    console.error("Could not verify event registration", error);
    return jsonResponse({ error: errorMessage }, 500);
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

    if (body.action === "register") {
      const token = request.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
      if (!token) {
        return jsonResponse({ error: "Authentication is required." }, 401);
      }

      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return jsonResponse({ error: "A valid authenticated user is required." }, 401);
      }

      return await register(body, supabase, data.user.id);
    }
    if (body.action === "verify") return await verify(body, supabase);
    return jsonResponse({ error: "Unsupported action." }, 400);
  } catch (error) {
    console.error("Event verification function failed", error);
    return jsonResponse({ error: "Event registration service is unavailable." }, 500);
  }
});
