// Labels and small helpers shared by the three Events tabs.

export const REGISTRATION_STATUS = {
  pending: { label: "Pending verification", className: "bg-sky-50 text-sky-700" },
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700" },
  waitlisted: { label: "Waitlisted", className: "bg-amber-50 text-amber-700" },
  cancelled: { label: "Cancelled", className: "bg-rose-50 text-rose-600" },
};

// Statuses an admin can pick by hand ("pending" only changes when the person verifies their email).
export const ADMIN_STATUSES = ["confirmed", "waitlisted", "cancelled"];

export const PRESET_TYPES = ["Competitor", "Spectator/Guest", "Sponsor", "Volunteer"];

export const QUESTION_TYPES = {
  short_answer: "Short answer",
  paragraph: "Paragraph",
  multiple_choice: "Multiple choice",
  checkboxes: "Checkboxes",
  dropdown: "Dropdown",
  date: "Date",
  email: "Email",
  phone: "Phone",
};

// Question types that need a list of options.
export const CHOICE_TYPES = ["multiple_choice", "checkboxes", "dropdown"];

export const chipClass = (active) =>
  `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition ${
    active
      ? "border-[#E58422] bg-[#FFF3E7] text-[#B96916]"
      : "border-[#EAE5DF] bg-white text-slate-600 hover:bg-slate-50"
  }`;

export const nextId = (rows) => Math.max(0, ...rows.map((row) => row.id)) + 1;

const pad = (number) => String(number).padStart(2, "0");

export const todayISO = () => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

// Local time as "YYYY-MM-DDTHH:MM:00", the same shape as the sample timestamps.
export const nowISO = () => {
  const now = new Date();
  return `${todayISO()}T${pad(now.getHours())}:${pad(now.getMinutes())}:00`;
};

// "YYYY-MM-DD" is read as a local date (not UTC) so it never shifts by a day.
export const parseDate = (value) => {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (
  value,
  options = { month: "short", day: "numeric", year: "numeric" }
) => (value ? parseDate(value).toLocaleDateString("en-US", options) : "Not set");

// "16:00" → "4:00 PM"
export const formatTime = (value) => {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours % 12 || 12}:${pad(minutes)} ${hours < 12 ? "AM" : "PM"}`;
};

// "2026-10-22T09:55:00" → "Oct 22, 2026 · 9:55 AM"
export const formatDateTime = (value) =>
  value ? `${formatDate(value)} · ${formatTime(value.slice(11, 16))}` : "Never";

export const timeRange = (event) =>
  [event.start_time, event.end_time].filter(Boolean).map(formatTime).join(" – ") ||
  "Time not set";

// "past" | "active" (happening today) | "upcoming"
export const eventPhase = (event) => {
  const today = todayISO();
  if (event.event_date < today) return "past";
  if (event.event_date === today) return "active";
  return "upcoming";
};

export const answerText = (value) =>
  Array.isArray(value) ? value.join(", ") : value ?? "";

export const confirmedCount = (registrations, typeId) =>
  registrations.filter(
    (registration) =>
      registration.participant_type_id === typeId && registration.status === "confirmed"
  ).length;

// Confirmed spots and total capacity across all participant types of one event.
export const eventTotals = (event, participantTypes, registrations) => {
  const types = participantTypes.filter((type) => type.event_id === event.id);
  return {
    types,
    taken: types.reduce((sum, type) => sum + confirmedCount(registrations, type.id), 0),
    capacity: types.reduce((sum, type) => sum + type.capacity, 0),
  };
};

// The pill shown on event cards and in the View More pop-up.
export const eventPill = (event, participantTypes, registrations) => {
  const phase = eventPhase(event);
  const { taken, capacity } = eventTotals(event, participantTypes, registrations);

  if (event.status === "draft") return { label: "Draft", dot: "bg-gray-400", text: "text-gray-600" };
  if (event.status === "cancelled") return { label: "Cancelled", dot: "bg-rose-500", text: "text-rose-700" };
  if (phase === "past" || event.status === "completed") return { label: "Past", dot: "bg-gray-400", text: "text-gray-600" };
  if (phase === "active") return { label: "Happening now", dot: "bg-violet-500 animate-pulse", text: "text-violet-700" };
  if (event.status === "closed") return { label: "Registration closed", dot: "bg-amber-500", text: "text-amber-700" };
  if (event.registration_opens_at && event.registration_opens_at > todayISO()) {
    return {
      label: `Opens ${formatDate(event.registration_opens_at, { month: "short", day: "numeric" })}`,
      dot: "bg-sky-500",
      text: "text-sky-700",
    };
  }
  if (capacity > 0 && taken >= capacity) return { label: "Full", dot: "bg-rose-500", text: "text-rose-700" };
  return { label: "Registration open", dot: "bg-emerald-500", text: "text-emerald-700" };
};

export const sortQuestions = (questions) =>
  [...questions].sort((a, b) => a.sort_order - b.sort_order);
