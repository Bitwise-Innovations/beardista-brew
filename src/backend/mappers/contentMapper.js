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
// ---------------------------------------------------------------------------
// Customer home page: the second "What's Brewing" card.
// Takes the first live announcement (already filtered and ordered by the database).
// ---------------------------------------------------------------------------
const ANNOUNCEMENT_LABELS = {
  new_event: "NEW EVENT",
  new_drink: "NEW DRINK",
  must_try: "MUST TRY",
  notice: "NOTICE",
};

export function buildFeaturedAnnouncement(announcements) {
  const first = Array.isArray(announcements) ? announcements[0] : null;
  if (!first) return null;

  return {
    id: first.id,
    tag:
      first.type === "custom"
        ? (first.custom_label || "").toUpperCase()
        : ANNOUNCEMENT_LABELS[first.type] ?? "WHAT'S NEW",
    title: first.title,
    description: first.body ?? "",
    image: first.image_url || null,
    buttonLabel: first.link_type && first.link_type !== "none" ? first.button_label : null,
    linkType: first.link_type ?? "none",
    linkTarget: first.link_target ?? null,
  };
}

// ---------------------------------------------------------------------------
// Customer site: store info and social links from Settings, with fallbacks.
// ---------------------------------------------------------------------------
const SITE_FALLBACK = {
  storeName: "Beardista Brew",
  address: "2837 Yellowbell St., Area C, Brgy. 174 Camarin, Caloocan City",
  openingTime: "4:00 PM",
  closingTime: "12:00 AM",
  social: {
    facebook: "https://www.facebook.com/Beardistabrew",
    instagram: "https://www.instagram.com/beardistabrew",
    tiktok: "https://www.tiktok.com/@beardista",
  },
};

const filled = (value, fallback) => (typeof value === "string" && value.trim() ? value.trim() : fallback);

export function buildSiteInfo(settings) {
  const find = (key) => (Array.isArray(settings) ? settings.find((setting) => setting.key === key)?.value : null);
  const store = find("store_info") ?? {};
  const savedSocial = find("social_links");

  const openingTime = filled(store.openingTime, SITE_FALLBACK.openingTime);
  const closingTime = filled(store.closingTime, SITE_FALLBACK.closingTime);

  // Once Social Links is saved, an empty link means "hide this button".
  const social = savedSocial
    ? {
        facebook: filled(savedSocial.facebook, ""),
        instagram: filled(savedSocial.instagram, ""),
        tiktok: filled(savedSocial.tiktok, ""),
      }
    : SITE_FALLBACK.social;

  return {
    storeName: filled(store.storeName, SITE_FALLBACK.storeName),
    address: filled(store.address, SITE_FALLBACK.address),
    hours: `${openingTime} - ${closingTime}`,
    social,
  };
}