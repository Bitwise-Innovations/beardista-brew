// Converts event rows to the shape the admin Events page uses, and back.
// All dates and times are shown in Manila time.

const TZ = "Asia/Manila";

const datePart = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleDateString("en-CA", { timeZone: TZ }) : "";

const timePart = (timestamp) =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString("en-GB", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

// "2026-11-18" + "10:00" -> "2026-11-18T10:00:00+08:00"
const toTimestamp = (date, time) => (date && time ? `${date}T${time}:00+08:00` : null);

// "YYYY-MM-DDTHH:MM:00" in Manila time, the format eventUtils expects.
const toLocalDateTime = (timestamp) =>
  timestamp ? `${datePart(timestamp)}T${timePart(timestamp)}:00` : "";

export function toAdminEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    event_date: row.event_date ?? datePart(row.start_time || row.created_at),
    start_time: timePart(row.start_time),
    end_time: timePart(row.end_time),
    venue: row.location ?? "",
    cover_image_url: row.image_url ?? "",
    status: row.status,
    registration_opens_at: row.registration_opens_at ?? "",
    registration_closes_at: row.registration_closes_at ?? "",
  };
}

export function toEventPayload(values, coverUrl) {
  return {
    title: values.title,
    description: values.description || null,
    event_date: values.event_date,
    start_time: toTimestamp(values.event_date, values.start_time),
    end_time: toTimestamp(values.event_date, values.end_time),
    location: values.venue,
    image_url: coverUrl || null,
    registration_opens_at: values.registration_opens_at || null,
    registration_closes_at: values.registration_closes_at || null,
  };
}

export function toAdminType(row) {
  return {
    id: row.id,
    event_id: row.event_id,
    name: row.name,
    capacity: row.capacity,
    opens_at: row.opens_at ?? "",
    closes_at: row.closes_at ?? "",
  };
}

export function toAdminQuestion(row) {
  return {
    id: row.id,
    participant_type_id: row.participant_type_id,
    label: row.label,
    type: row.type,
    required: row.required,
    help_text: row.help_text ?? "",
    options: row.options ?? [],
    sort_order: row.sort_order,
  };
}

export function toAdminRegistration(row) {
  return {
    id: row.id,
    event_id: row.event_id,
    participant_type_id: row.participant_type_id,
    name: row.full_name,
    email: row.user_email,
    status: row.status,
    email_verified: row.is_verified,
    verification_sent_at: toLocalDateTime(row.verification_sent_at),
    registered_at: toLocalDateTime(row.created_at),
  };
}

export function toAdminAnswer(row) {
  return {
    id: row.id,
    registration_id: row.registration_id,
    question_id: row.question_id,
    value: row.value,
  };
}