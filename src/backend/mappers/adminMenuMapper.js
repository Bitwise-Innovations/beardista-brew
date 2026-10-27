// Converts menu rows to the shape the admin Menu Management page uses, and back.

export function toAdminCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? "",
    priority: row.sort_order ?? 0,
    description: row.description ?? "",
    group: row.group_name ?? "",
    color: row.color ?? "#E58422",
    badge: row.badge ?? "",
    iconImage: row.icon_url ?? "",
    showOnMenu: Boolean(row.is_active),
    status: row.status ?? "active",
  };
}

export function toCategoryPayload(values, iconUrl) {
  return {
    name: values.name,
    slug: values.slug,
    sort_order: values.priority,
    description: values.description || null,
    group_name: values.group || null,
    color: values.color,
    badge: values.badge || null,
    icon_url: iconUrl || null,
    is_active: values.showOnMenu,
    status: values.status,
  };
}

export function toAdminItem(row, categoryNameById = {}) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    categoryId: row.category_id,
    category: categoryNameById[row.category_id] ?? "",
    price: Number(row.price),
    available: Boolean(row.is_available),
    image: row.image_url ?? "",
    temperatures: row.temperatures ?? [],
    flavor: row.flavor_profile ?? "",
    calories: row.calories ?? null,
    tags: row.tags ?? [],
    addOns: row.add_ons ?? [],
  };
}

export function toItemPayload(values, categoryId, imageUrl) {
  return {
    category_id: categoryId,
    name: values.name,
    description: values.description || null,
    price: values.price,
    image_url: imageUrl || null,
    is_available: values.available,
    temperatures: values.temperatures,
    flavor_profile: values.flavor || null,
    calories: values.calories,
    tags: values.tags,
    add_ons: values.addOns,
  };
}

// A preview URL (blob:) only exists in this browser tab, so it is never saved.
export const savedUrl = (url) => (url && !url.startsWith("blob:") ? url : null);