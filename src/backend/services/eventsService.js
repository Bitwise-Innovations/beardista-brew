import { supabase } from "../lib/supabase";
import { mapEventFromDb, mapEventToDb } from "../mappers/eventMapper";

async function throwEdgeFunctionError(error) {
  let message = error.message;
  if (error.context && typeof error.context.json === "function") {
    try {
      const details = await error.context.json();
      message = details?.message ?? details?.error ?? message;
    } catch (contextError) {
      console.error("Could not extract Edge Function error details", contextError);
    }
  }
  throw new Error(message);
}

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

export async function getEventParticipantTypes(eventId) {
  const { data, error } = await supabase
    .from("participant_types")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at");
  if (error) throw error;
  return data;
}

export async function getEventFormQuestions(eventId) {
  const { data, error } = await supabase
    .from("form_questions")
    .select("*, participant_types!inner(event_id)")
    .eq("participant_types.event_id", eventId)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function saveParticipantType(participantType) {
  const query = participantType.id
    ? supabase
        .from("participant_types")
        .upsert(participantType)
        .select()
        .single()
    : supabase.from("participant_types").insert(participantType).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateParticipantType(id, updates) {
  const { data, error } = await supabase
    .from("participant_types")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveFormQuestion(question) {
  const query = question.id
    ? supabase.from("form_questions").upsert(question).select().single()
    : supabase.from("form_questions").insert(question).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateFormQuestion(id, updates) {
  const { data, error } = await supabase
    .from("form_questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveEventForms({
  participantTypes = [],
  formQuestions = [],
}) {
  const savedParticipantTypes = [];
  for (const participantType of participantTypes) {
    savedParticipantTypes.push(await saveParticipantType(participantType));
  }

  const savedFormQuestions = [];
  for (const question of formQuestions) {
    savedFormQuestions.push(await saveFormQuestion(question));
  }

  return {
    participantTypes: savedParticipantTypes,
    formQuestions: savedFormQuestions,
  };
}

export async function getEventSignups(eventId) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      "*, participant_type:participant_types(*), answers:registration_answers(*, question:form_questions(*))",
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function registerForEvent(registration) {
  let data;
  let error;
  try {
    ({ data, error } = await supabase.functions.invoke("event-code", {
      body: {
        action: "register",
        eventId: registration.eventId,
        participant_type_id: registration.participant_type_id,
        answers: registration.answers ?? [],
      },
    }));
  } catch (invokeError) {
    if (invokeError?.context) await throwEdgeFunctionError(invokeError);
    throw invokeError;
  }
  if (error) await throwEdgeFunctionError(error);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function verifyEventCode(registrationId, code) {
  let data;
  let error;
  try {
    ({ data, error } = await supabase.functions.invoke("event-code", {
      body: { action: "verify", registrationId, code },
    }));
  } catch (invokeError) {
    if (invokeError?.context) await throwEdgeFunctionError(invokeError);
    throw invokeError;
  }
  if (error) await throwEdgeFunctionError(error);
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
