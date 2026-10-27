import { formatDate, todayISO } from "../events/eventUtils";

export const ANNOUNCEMENT_TYPES = {
  new_event: "New Event",
  new_drink: "New Drink",
  must_try: "Must Try",
  notice: "Notice",
  custom: "Custom",
};

export const DESCRIPTION_LIMIT = 140;

// How many "What's Brewing" cards the landing page shows.
export const LIVE_SLOTS = 2;

export const typeLabel = (announcement) =>
  announcement.type === "custom"
    ? announcement.custom_label.trim() || "Custom"
    : ANNOUNCEMENT_TYPES[announcement.type];

// "scheduled" (starts later) | "ended" | "running"
export const scheduleState = (announcement) => {
  const today = todayISO();
  if (announcement.starts_at && announcement.starts_at > today) return "scheduled";
  if (announcement.ends_at && announcement.ends_at < today) return "ended";
  return "running";
};

export const sortAnnouncements = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order);

// Ids of the cards the landing page shows right now: the first visible ones inside their dates.
export const liveIds = (list) =>
  sortAnnouncements(list)
    .filter((announcement) => announcement.is_visible && scheduleState(announcement) === "running")
    .slice(0, LIVE_SLOTS)
    .map((announcement) => announcement.id);

export const dateRange = ({ starts_at: start, ends_at: end }) => {
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  if (start) return `From ${formatDate(start)}`;
  if (end) return `Until ${formatDate(end)}`;
  return "No end date";
};

export const linkSummary = (announcement, events, menuItems) => {
  const target = announcement.link_target;
  if (announcement.link_type === "event") {
    return `Event: ${events.find((event) => event.id === Number(target))?.title ?? "event not found"}`;
  }
  if (announcement.link_type === "menu_item") {
    return `Menu: ${menuItems.find((item) => item.id === Number(target))?.name ?? "item not found"}`;
  }
  if (announcement.link_type === "url") return target;
  return "";
};
