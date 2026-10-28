import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ROLES = ["owner", "admin", "staff"];
const STATUSES = ["active", "disabled"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// No look-alike characters (0/O, 1/l/I), so it's easy to read out loud.
const PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

type AdminClient = ReturnType<typeof createClient>;

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

// 14 random characters plus a symbol and a digit. Rejection sampling keeps every character equally likely.
function createTemporaryPassword() {
  const limit = 256 - (256 % PASSWORD_CHARS.length);
  const result: string[] = [];
  const byte = new Uint8Array(1);
  while (result.length < 14) {
    crypto.getRandomValues(byte);
    if (byte[0] < limit) result.push(PASSWORD_CHARS[byte[0] % PASSWORD_CHARS.length]);
  }
  return `${result.join("")}!7`;
}

function isValidName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 1 && value.length <= 120;
}

async function listStaff(admin: AdminClient) {
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, full_name, email, role, status, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const { data: authData, error: authError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (authError) throw authError;
  const lastLogins = new Map(authData.users.map((user) => [user.id, user.last_sign_in_at ?? null]));

  return jsonResponse({
    users: profiles.map((profile) => ({ ...profile, last_sign_in_at: lastLogins.get(profile.id) ?? null })),
  });
}

async function createStaff(admin: AdminClient, body: Record<string, unknown>) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || !isValidName(body.fullName)) {
    return jsonResponse({ error: "A valid name and email are required." }, 400);
  }
  const fullName = (body.fullName as string).trim();

  const { data: existing } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (existing) return jsonResponse({ error: "This email already has an account." }, 409);

  const temporaryPassword = createTemporaryPassword();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) {
    if (error?.message?.toLowerCase().includes("already")) {
      return jsonResponse({ error: "This email already has an account." }, 409);
    }
    throw error ?? new Error("User was not created");
  }

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: data.user.id, email, full_name: fullName, role: "staff", status: "active" });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw profileError;
  }

  return jsonResponse({ userId: data.user.id, temporaryPassword });
}

async function updateStaff(admin: AdminClient, callerId: string, body: Record<string, unknown>) {
  const userId = body.userId;
  if (
    typeof userId !== "string" ||
    !UUID_PATTERN.test(userId) ||
    !isValidName(body.fullName) ||
    !ROLES.includes(body.role as string) ||
    !STATUSES.includes(body.status as string)
  ) {
    return jsonResponse({ error: "A valid name, role, and status are required." }, 400);
  }
  if (userId === callerId && (body.role !== "owner" || body.status !== "active")) {
    return jsonResponse({ error: "You can't change your own role or status." }, 400);
  }

  const { error } = await admin
    .from("profiles")
    .update({ full_name: (body.fullName as string).trim(), role: body.role, status: body.status })
    .eq("id", userId);
  if (error) throw error;

  // Suspended accounts are also blocked from signing in at the Auth level.
  const { error: banError } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: body.status === "disabled" ? "876000h" : "none",
  });
  if (banError) throw banError;

  return jsonResponse({ ok: true });
}

async function resetPassword(admin: AdminClient, callerId: string, body: Record<string, unknown>) {
  const userId = body.userId;
  if (typeof userId !== "string" || !UUID_PATTERN.test(userId)) {
    return jsonResponse({ error: "A valid user is required." }, 400);
  }
  if (userId === callerId) {
    return jsonResponse({ error: "Change your own password in My Account." }, 400);
  }

  const temporaryPassword = createTemporaryPassword();
  const { error } = await admin.auth.admin.updateUserById(userId, { password: temporaryPassword });
  if (error) throw error;
  return jsonResponse({ temporaryPassword });
}

async function removeStaff(admin: AdminClient, callerId: string, body: Record<string, unknown>) {
  const userId = body.userId;
  if (typeof userId !== "string" || !UUID_PATTERN.test(userId)) {
    return jsonResponse({ error: "A valid user is required." }, 400);
  }
  if (userId === callerId) return jsonResponse({ error: "You can't remove your own account." }, 400);

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Could not delete user", error);
    return jsonResponse({ error: "This account couldn't be removed. Suspend it instead." }, 409);
  }
  await admin.from("profiles").delete().eq("id", userId);
  return jsonResponse({ ok: true });
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

    // Only an active owner may use this function.
    const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: callerData } = await admin.auth.getUser(token);
    const caller = callerData?.user;
    if (!caller) return jsonResponse({ error: "Please log in again." }, 401);

    const { data: callerProfile } = await admin
      .from("profiles")
      .select("role, status")
      .eq("id", caller.id)
      .maybeSingle();
    if (callerProfile?.role !== "owner" || callerProfile?.status !== "active") {
      return jsonResponse({ error: "Only the owner can manage staff accounts." }, 403);
    }

    switch (body.action) {
      case "list":
        return await listStaff(admin);
      case "create":
        return await createStaff(admin, body);
      case "update":
        return await updateStaff(admin, caller.id, body);
      case "reset_password":
        return await resetPassword(admin, caller.id, body);
      case "remove":
        return await removeStaff(admin, caller.id, body);
      default:
        return jsonResponse({ error: "Unsupported action." }, 400);
    }
  } catch (error) {
    console.error("admin-users function failed", error);
    return jsonResponse({ error: "The staff service is unavailable. Please try again." }, 500);
  }
});