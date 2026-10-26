import fallbackImg from "@/assets/beardista_brew.jpg";

export function mapCategoryFromDb(category) {
  if (!category) return category;

  return {
    ...category,
    sortOrder: category.sort_order,
    isActive: category.is_active,
    createdAt: category.created_at,
  };
}

export function mapMenuItemFromDb(item) {
  if (!item) return item;

  return {
    ...item,
    categoryId: item.category_id,
    isAvailable: item.is_available,
    isFavorite: item.is_favorite,
    viewCount: item.view_count,
    sortOrder: item.sort_order,
    createdAt: item.created_at,
  };
}

export function mapCategoryToDb(category) {
  const mapped = {};
  const fields = {
    name: "name",
    sortOrder: "sort_order",
    isActive: "is_active",
  };

  for (const [source, target] of Object.entries(fields)) {
    if (Object.hasOwn(category, source)) mapped[target] = category[source];
  }

  if (Object.hasOwn(category, "sort_order")) {
    mapped.sort_order = category.sort_order;
  }
  if (Object.hasOwn(category, "is_active")) {
    mapped.is_active = category.is_active;
  }

  return mapped;
}

export function mapMenuItemToDb(item) {
  const mapped = {};
  const fields = {
    categoryId: "category_id",
    name: "name",
    description: "description",
    price: "price",
    imageUrl: "image_url",
    isAvailable: "is_available",
    isFavorite: "is_favorite",
    viewCount: "view_count",
    sortOrder: "sort_order",
  };

  for (const [source, target] of Object.entries(fields)) {
    if (Object.hasOwn(item, source)) mapped[target] = item[source];
  }

  for (const field of [
    "category_id",
    "image_url",
    "is_available",
    "is_favorite",
    "view_count",
    "sort_order",
  ]) {
    if (Object.hasOwn(item, field)) mapped[field] = item[field];
  }

  return mapped;
}


// ---------------------------------------------------------------------------
// Display mappers: ONE shape used by BOTH the customer site and the admin.
// Input rows come from menuService (already passed through mapMenuItemFromDb /
// mapCategoryFromDb). Output matches what MenuPage, CustomerFavorites and
// ItemDetailsModal expect.
// ---------------------------------------------------------------------------

export function mapMenuItemForDisplay(item, categoryNameById = {}) {
  if (!item) return item;

  const isAvailable = Boolean(item.isAvailable ?? item.is_available);
  const categoryId = item.categoryId ?? item.category_id;

  return {
    id: item.id,
    name: item.name,
    categoryId,
    category: categoryNameById[categoryId] ?? "",
    description: item.description ?? "",
    price: `₱${Number(item.price)}`, // shown to customers, e.g. "₱140"
    priceValue: Number(item.price), // plain number, for admin forms
    image: item.image_url || fallbackImg,
    isAvailable,
    status: isAvailable ? "AVAILABLE" : "SOLD OUT",
    isFavorite: Boolean(item.isFavorite ?? item.is_favorite),
    viewCount: item.viewCount ?? item.view_count ?? 0,
    // Optional columns. Only filled if they exist in the database;
    // otherwise undefined and ItemDetailsModal uses its own defaults.
    flavorProfile: item.flavor_profile ?? undefined,
    contains: item.contains ?? undefined,
    details: item.details ?? undefined,
  };
}

export function mapCategoryForDisplay(category) {
  if (!category) return category;

  return {
    id: category.id,
    name: category.name,
    icon: category.icon ?? null, // null -> the page picks a default icon
  };
}

function categoryLookup(categories) {
  const byId = {};
  (Array.isArray(categories) ? categories : []).forEach((c) => {
    byId[c.id] = c.name;
  });
  return byId;
}

// All items, ready to show. Returns [] when there is nothing yet.
export function buildMenuItems(items, categories) {
  if (!Array.isArray(items)) return [];
  const byId = categoryLookup(categories);
  return items.map((item) => mapMenuItemForDisplay(item, byId));
}

// Categories, ready to show. Returns [] when there is nothing yet.
export function buildCategories(categories) {
  if (!Array.isArray(categories)) return [];
  return categories.map(mapCategoryForDisplay);
}

// Home page "Customer Favorites" (max `limit`, available items only).
export function buildFavorites(items, categories, limit = 3) {
  return buildMenuItems(items, categories)
    .filter((item) => item.isFavorite && item.isAvailable)
    .slice(0, limit);
}


// ---------------------------------------------------------------------------
// Admin shape: what the admin Menu Management page and its drawers expect.
// Same database rows as the customer site, different display shape
// (category as a name, price as a plain number, "available"/"availability").
// ---------------------------------------------------------------------------

export function mapMenuItemForAdmin(item, categoryNameById = {}) {
  if (!item) return item;

  const isAvailable = Boolean(item.isAvailable ?? item.is_available);
  const categoryId = item.categoryId ?? item.category_id;

  return {
    id: item.id,
    name: item.name,
    categoryId,
    category: categoryNameById[categoryId] ?? "",
    description: item.description ?? "",
    price: Number(item.price),
    image: item.image_url ?? "",
    available: isAvailable,
    availability: isAvailable,
    isFavorite: Boolean(item.isFavorite ?? item.is_favorite),
    viewCount: item.viewCount ?? item.view_count ?? 0,
  };
}

// All items for the admin. Returns [] while loading or on error.
export function buildAdminMenuItems(items, categories) {
  if (!Array.isArray(items)) return [];
  const byId = categoryLookup(categories);
  return items.map((item) => mapMenuItemForAdmin(item, byId));
}