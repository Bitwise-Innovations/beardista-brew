import { supabase } from "../lib/supabase";

const ROLE_LABELS = { owner: "Owner", admin: "Admin", staff: "Staff" };

// Calls the owner-only admin-users Edge Function and turns its error into a readable message.
async function callAdminUsers(body) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) {
    let message = "The staff service is unavailable. Please try again.";
    try {
      const details = await error.context?.json();
      if (details?.error) message = details.error;
    } catch {
      // Keep the default message.
    }
    throw new Error(message);
  }
  return data;
}

function toStaff(row) {
  const suspended = row.status !== "active";
  return {
    id: row.id,
    name: row.full_name || row.email,
    email: row.email,
    roleKey: row.role,
    role: ROLE_LABELS[row.role] ?? "Staff",
    status: suspended ? "Suspended" : row.last_sign_in_at ? "Active" : "Pending",
    lastLogin: row.last_sign_in_at
      ? new Date(row.last_sign_in_at).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        })
      : "Never",
  };
}

export async function listStaff() {
  const data = await callAdminUsers({ action: "list" });
  return (data.users ?? []).map(toStaff);
}

export const createStaff = ({ fullName, email }) =>
  callAdminUsers({ action: "create", fullName, email });

export const updateStaff = ({ userId, fullName, role, status }) =>
  callAdminUsers({ action: "update", userId, fullName, role, status });

export const resetStaffPassword = (userId) => callAdminUsers({ action: "reset_password", userId });

export const removeStaff = (userId) => callAdminUsers({ action: "remove", userId });