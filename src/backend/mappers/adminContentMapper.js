// Converts content rows to the shape the admin Content Management page uses, and back.

// Dates are shown as "YYYY-MM-DD" in Manila time.
const toDateInput = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }) : "";

const startOfDay = (date) => (date ? `${date}T00:00:00+08:00` : null);
const endOfDay = (date) => (date ? `${date}T23:59:59+08:00` : null);

const NUMBER_LINKS = ["event", "menu_item"];

export function toAdminAnnouncement(row) {
  return {
    id: row.id,
    type: row.type ?? "notice",
    custom_label: row.custom_label ?? "",
    title: row.title,
    description: row.body ?? "",
    image_url: row.image_url ?? "",
    button_label: row.button_label ?? "",
    link_type: row.link_type ?? "none",
    link_target: NUMBER_LINKS.includes(row.link_type)
      ? Number(row.link_target)
      : row.link_target ?? "",
    starts_at: toDateInput(row.start_date),
    ends_at: toDateInput(row.end_date),
    is_visible: Boolean(row.is_active),
    sort_order: row.sort_order ?? 0,
  };
}

export function toAnnouncementPayload(values, imageUrl) {
  const hasLink = values.link_type !== "none";
  return {
    type: values.type,
    custom_label: values.type === "custom" ? values.custom_label : null,
    title: values.title,
    body: values.description,
    image_url: imageUrl || null,
    button_label: hasLink ? values.button_label : null,
    link_type: values.link_type,
    link_target: hasLink ? String(values.link_target) : null,
    start_date: startOfDay(values.starts_at),
    end_date: endOfDay(values.ends_at),
  };
}

export function toAdminBarista(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "Barista",
    description: row.bio ?? "",
    photo: row.photo_url ?? "",
    displayOrder: row.display_order ?? 0,
  };
}