import { supabase } from "../../lib/supabase";
import { mapEventFromDb, mapEventToDb } from "../mappers/eventMapper";

export async function getEvents({ includeDraft = false } = {}) {
  let query = supabase.from("events").select("*").order("start_time");
  if (!includeDraft) query = query.neq("status", "draft");

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapEventFromDb);
}

export async function getEventById(id, { includeDraft = false } = {}) {
  let query = supabase.from("events").select("*").eq("id", id);
  if (!includeDraft) query = query.neq("status", "draft");

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return mapEventFromDb(data);
}

export async function registerForEvent(registration) {
  const { data, error } = await supabase.functions.invoke("event-code", {
    body: {
      action: "register",
      eventId: registration.eventId,
      email: registration.email ?? registration.userEmail,
      fullName: registration.fullName,
      phone: registration.phone ?? null,
    },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function verifyEventCode(registrationId, code) {
  const { data, error } = await supabase.functions.invoke("event-code", {
    body: { action: "verify", registrationId, code },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function createEvent(event) {
  const { data, error } = await supabase
    .from("events")
    .insert(mapEventToDb(event))
    .select()
    .single();
  if (error) throw error;
  return mapEventFromDb(data);
}

export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from("events")
    .update(mapEventToDb(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapEventFromDb(data);
}

export async function deleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}
