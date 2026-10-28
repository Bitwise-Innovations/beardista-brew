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

// No slug here: the database creates it from the name.
export function toCategoryPayload(values, iconUrl) {
  return {
    name: values.name.trim(),
    sort_order: values.priority,
    description: values.description?.trim() || null,
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
    tags: row.tags ?? [],
    addOns: row.add_ons ?? [],
  };
}

export function toItemPayload(values, categoryId, imageUrl) {
  return {
    category_id: categoryId,
    name: values.name.trim(),
    description: values.description?.trim() || null,
    price: values.price,
    image_url: imageUrl || null,
    is_available: values.available,
    temperatures: values.temperatures,
    flavor_profile: values.flavor?.trim() || null,
    tags: values.tags,
    add_ons: values.addOns,
  };
}

// A preview URL (blob:) only exists in this browser tab, so it is never saved.
export const savedUrl = (url) => (url && !url.startsWith("blob:") ? url : null);

// Turns a database error into a friendly message for the category form.
export function categoryErrorMessage(error, name) {
  const text = `${error?.message ?? ""} ${error?.details ?? ""}`;
  if (error?.code === "23505" || /categories_name_unique/i.test(text)) {
    return `A category named "${name}" already exists.`;
  }
  if (/categories_name_length/i.test(text)) return "Category name must be 1 to 40 characters.";
  if (/categories_description_length/i.test(text)) return "Description must be 200 characters or fewer.";
  return `We couldn't save ${name}. Please try again.`;
}