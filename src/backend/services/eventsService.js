import { supabase } from "../lib/supabase";
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

function throwFirstError(results) {
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;
}

// Everything the Events page needs, in one call. Verification codes are never selected.
export async function getAdminEventsData() {
  const results = await Promise.all([
    supabase.from("events").select("*").order("event_date", { nullsFirst: false }),
    supabase.from("participant_types").select("*").order("sort_order").order("id"),
    supabase.from("form_questions").select("*").order("sort_order").order("id"),
    supabase
      .from("event_registrations")
      .select("id, event_id, participant_type_id, full_name, user_email, status, is_verified, verification_sent_at, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("registration_answers").select("id, registration_id, question_id, value"),
  ]);
  throwFirstError(results);

  const [events, types, questions, registrations, answers] = results.map((result) => result.data);
  return { events, types, questions, registrations, answers };
}

export async function createEventRow(payload) {
  const { data, error } = await supabase
    .from("events")
    .insert({ ...payload, status: "draft" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEventRow(id, payload) {
  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Copies the event with its participant types and questions (no registrations) as a draft.
export async function duplicateEventRow(sourceId) {
  const { data: source, error } = await supabase.from("events").select("*").eq("id", sourceId).single();
  if (error) throw error;

  const { id: _id, created_at: _created, is_active: _active, ...rest } = source;
  const { data: copy, error: copyError } = await supabase
    .from("events")
    .insert({ ...rest, title: `${source.title} (copy)`, status: "draft" })
    .select()
    .single();
  if (copyError) throw copyError;

  const { data: types, error: typesError } = await supabase
    .from("participant_types")
    .select("*")
    .eq("event_id", sourceId);
  if (typesError) throw typesError;
  if (types.length === 0) return copy;

  const { data: questions, error: questionsError } = await supabase
    .from("form_questions")
    .select("*")
    .in("participant_type_id", types.map((type) => type.id));
  if (questionsError) throw questionsError;

  for (const type of types) {
    const { data: newType, error: typeError } = await supabase
      .from("participant_types")
      .insert({
        event_id: copy.id,
        name: type.name,
        capacity: type.capacity,
        opens_at: type.opens_at,
        closes_at: type.closes_at,
        sort_order: type.sort_order,
      })
      .select("id")
      .single();
    if (typeError) throw typeError;

    const typeQuestions = questions
      .filter((question) => question.participant_type_id === type.id)
      .map(({ id: _qid, created_at: _qcreated, ...question }) => ({
        ...question,
        participant_type_id: newType.id,
      }));
    if (typeQuestions.length > 0) {
      const { error: insertError } = await supabase.from("form_questions").insert(typeQuestions);
      if (insertError) throw insertError;
    }
  }

  return copy;
}

// Saves one event's participant types and questions.
// Rows whose id is not in existing*Ids are new (they only have a temporary id in the browser).
export async function saveEventForms({ eventId, types, questions, existingTypeIds, existingQuestionIds }) {
  const typeIdMap = new Map();

  for (const [index, type] of types.entries()) {
    const row = {
      event_id: eventId,
      name: type.name.trim(),
      capacity: type.capacity,
      opens_at: type.opens_at || null,
      closes_at: type.closes_at || null,
      sort_order: index,
    };

    if (existingTypeIds.includes(type.id)) {
      const { error } = await supabase.from("participant_types").update(row).eq("id", type.id);
      if (error) throw error;
      typeIdMap.set(type.id, type.id);
    } else {
      const { data, error } = await supabase.from("participant_types").insert(row).select("id").single();
      if (error) throw error;
      typeIdMap.set(type.id, data.id);
    }
  }

  const keptQuestionIds = [];
  for (const question of questions) {
    const typeId = typeIdMap.get(question.participant_type_id);
    if (!typeId) continue;

    const row = {
      participant_type_id: typeId,
      label: question.label,
      type: question.type,
      required: question.required,
      help_text: question.help_text || null,
      options: question.options,
      sort_order: question.sort_order,
    };

    if (existingQuestionIds.includes(question.id)) {
      const { error } = await supabase.from("form_questions").update(row).eq("id", question.id);
      if (error) throw error;
      keptQuestionIds.push(question.id);
    } else {
      const { error } = await supabase.from("form_questions").insert(row);
      if (error) throw error;
    }
  }

  const removedQuestionIds = existingQuestionIds.filter((id) => !keptQuestionIds.includes(id));
  if (removedQuestionIds.length > 0) {
    const { error } = await supabase.from("form_questions").delete().in("id", removedQuestionIds);
    if (error) throw error;
  }

  const removedTypeIds = existingTypeIds.filter((id) => !typeIdMap.has(id));
  if (removedTypeIds.length > 0) {
    const { error } = await supabase.from("participant_types").delete().in("id", removedTypeIds);
    if (error) throw error;
  }
}

export async function updateRegistrationStatus(id, status) {
  const { error } = await supabase.from("event_registrations").update({ status }).eq("id", id);
  if (error) throw error;
}