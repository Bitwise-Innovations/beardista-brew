import { supabase } from "../lib/supabase";

export class AuthServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
  }
}

export async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message.toLowerCase().includes("invalid login credentials")
    ) {
      throw new AuthServiceError(
        "Email or password is incorrect.",
        "invalid_credentials"
      );
    }
    throw error;
  }

  const profile = await getProfile(data.user.id);
  if (!profile || profile.status !== "active") {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;

    if (profile?.status === "disabled") {
      throw new AuthServiceError(
        "This account is disabled. Contact the owner for help.",
        "account_disabled"
      );
    }
    throw new AuthServiceError(
      "Your staff profile could not be found. Contact the owner for help.",
      "profile_missing"
    );
  }

  return { user: data.user, profile };
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getProfile(userId) {
  if (!userId) throw new Error("A user ID is required to load a profile.");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function changePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data.user;
}

export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function verifyCurrentPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new AuthServiceError("Your current password is incorrect.", "wrong_password");
  }
}

export async function changePasswordChecked({ email, currentPassword, newPassword }) {
  await verifyCurrentPassword(email, currentPassword);
  return changePassword(newPassword);
}

export async function updateMyName(fullName) {
  const { error } = await supabase.rpc("update_my_name", { p_full_name: fullName });
  if (error) throw error;
}

// Supabase emails a confirmation link to the new address.
// The email only changes after that link is clicked.
export async function requestEmailChange(email) {
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${window.location.origin}/admin/account` }
  );
  if (error) throw error;
}