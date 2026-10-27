import { supabase } from "../lib/supabase";
import {
  mapAuditLogFromDb,
  mapNotificationFromDb,
} from "../mappers/auditMapper";

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("You must be signed in to access notifications.");
  return data.user.id;
}

export async function getAuditLogs({ limit = 100 } = {}) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(mapAuditLogFromDb);
}

export async function getNotifications() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapNotificationFromDb);
}

export async function markNotificationRead(id) {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return mapNotificationFromDb(data);
}

export async function clearNotifications() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", userId)
    .select("id");
  if (error) throw error;
  return data.length;
}
