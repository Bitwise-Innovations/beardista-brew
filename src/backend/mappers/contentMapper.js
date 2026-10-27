export function mapAnnouncementFromDb(announcement) {
  if (!announcement) return announcement;

  return {
    ...announcement,
    isActive: announcement.is_active,
    startDate: announcement.start_date,
    endDate: announcement.end_date,
    createdAt: announcement.created_at,
  };
}

export function mapAnnouncementToDb(announcement) {
  const mapped = {};
  const fields = {
    title: "title",
    body: "body",
    isActive: "is_active",
    startDate: "start_date",
    endDate: "end_date",
  };

  for (const [source, target] of Object.entries(fields)) {
    if (Object.hasOwn(announcement, source)) mapped[target] = announcement[source];
  }
  for (const field of [
    "is_active", "start_date", "end_date", "type", "custom_label",
    "image_url", "button_label", "link_type", "link_target", "sort_order",
  ]) {
    if (Object.hasOwn(announcement, field)) mapped[field] = announcement[field];
  }

  return mapped;
}

export function mapBaristaFromDb(barista) {
  if (!barista) return barista;

  return {
    ...barista,
    photoUrl: barista.photo_url,
    displayOrder: barista.display_order,
    createdAt: barista.created_at,
  };
}

export function mapFaqFromDb(faq) {
  if (!faq) return faq;

  return {
    ...faq,
    displayOrder: faq.display_order ?? faq.sort_order,
    createdAt: faq.created_at,
  };
}

export function mapStoreSettingFromDb(setting) {
  if (!setting) return setting;

  return {
    ...setting,
    updatedAt: setting.updated_at,
  };
}