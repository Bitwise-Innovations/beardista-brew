export function mapEventFromDb(event) {
  if (!event) return event;

  return {
    ...event,
    startTime: event.start_time,
    endTime: event.end_time,
    imageUrl: event.image_url,
    createdAt: event.created_at,
    isActive: event.is_active,
  };
}

export function mapEventToDb(event) {
  const mapped = {};
  const fields = {
    title: "title",
    description: "description",
    location: "location",
    startTime: "start_time",
    endTime: "end_time",
    capacity: "capacity",
    status: "status",
    imageUrl: "image_url",
    isActive: "is_active",
  };

  for (const [source, target] of Object.entries(fields)) {
    if (Object.hasOwn(event, source)) mapped[target] = event[source];
  }

  for (const field of ["start_time", "end_time", "image_url", "is_active"]) {
    if (Object.hasOwn(event, field)) mapped[field] = event[field];
  }

  return mapped;
}

export function mapEventRegistrationFromDb(registration) {
  if (!registration) return registration;

  return {
    ...registration,
    eventId: registration.event_id,
    userEmail: registration.user_email,
    fullName: registration.full_name,
    verificationCode: registration.verification_code,
    verificationAttempts: registration.verification_attempts,
    verificationExpiresAt: registration.verification_expires_at,
    verificationSentAt: registration.verification_sent_at,
    isVerified: registration.is_verified,
    createdAt: registration.created_at,
  };
}

// ---------------------------------------------------------------------------
// Customer home page: "What's Brewing" event card.
// Picks the next event that is still running (not draft / cancelled / done)
// and returns the card shape. Returns null when there is none, so the page
// can keep showing its sample data.
// ---------------------------------------------------------------------------
const HIDDEN_STATUSES = ["draft", "cancelled", "canceled", "completed", "closed", "concluded"];

export function buildFeaturedEvent(events, now = new Date()) {
  if (!Array.isArray(events)) return null;

  const running = events.filter(
    (e) =>
      e.isActive !== false &&
      !HIDDEN_STATUSES.includes(String(e.status ?? "").toLowerCase())
  );
  if (running.length === 0) return null;

  // events arrive ordered by start time: take the next upcoming one,
  // or the most recent one if every running event has already started
  const upcoming = running.filter((e) => !e.startTime || new Date(e.startTime) >= now);
  const pick = upcoming[0] ?? running[running.length - 1];

  return {
    id: pick.id,
    tag: pick.tag || "COMMUNITY EVENT",
    title: pick.title,
    description: pick.description ?? "",
    buttonLabel: pick.button_label || "REGISTER & JOIN",
    location: pick.location ?? "",
    startTime: pick.startTime ?? null,
    endTime: pick.endTime ?? null,
    image: pick.imageUrl ?? null,
  };
}