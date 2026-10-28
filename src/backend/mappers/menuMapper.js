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

  for (const field of [
    "sort_order", "is_active", "slug", "description",
    "group_name", "color", "badge", "icon_url", "status",
  ]) {
    if (Object.hasOwn(category, field)) mapped[field] = category[field];
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
    "category_id", "image_url", "is_available", "is_favorite",
    "view_count", "sort_order", "flavor_profile", "temperatures",
    "calories", "tags", "add_ons", "is_archived",
  ]) {
    if (Object.hasOwn(item, field)) mapped[field] = item[field];
  }

  return mapped;
}

// ---------------------------------------------------------------------------
// Display mappers: ONE shape used by the customer site.
// Input rows come from menuService (already passed through mapMenuItemFromDb /
// mapCategoryFromDb). Output matches what MenuPage, CustomerFavorites and
// ItemDetailsModal expect.
// ---------------------------------------------------------------------------

export function mapMenuItemForDisplay(item, categoryNameById = {}, storeOnline = true) {
  if (!item) return item;

  const isAvailable = storeOnline && Boolean(item.isAvailable ?? item.is_available);
  const categoryId = item.categoryId ?? item.category_id;

  return {
    id: item.id,
    name: item.name,
    categoryId,
    category: categoryNameById[categoryId] ?? "",
    description: item.description ?? "",
    price: `₱${Number(item.price)}`, // shown to customers, e.g. "₱140"
    priceValue: Number(item.price),
    image: item.image_url || fallbackImg,
    isAvailable,
    status: isAvailable ? "AVAILABLE" : storeOnline ? "SOLD OUT" : "PAUSED",
    isFavorite: Boolean(item.isFavorite ?? item.is_favorite),
    viewCount: item.viewCount ?? item.view_count ?? 0,
    flavorProfile: item.flavor_profile || undefined,
    contains: item.tags?.length ? item.tags.join(", ").toUpperCase() : undefined,
    temperatures: Array.isArray(item.temperatures) ? item.temperatures : [],
    calories: item.calories ?? null,
    addOns: Array.isArray(item.add_ons) ? item.add_ons : [],
  };
}
export function mapCategoryForDisplay(category) {
  if (!category) return category;

  return {
    id: category.id,
    name: category.name,
    icon: category.icon_url ?? null, // null -> the page picks a default icon
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
// All items, ready to show. Returns [] when there is nothing yet.
export function buildMenuItems(items, categories, storeOnline = true) {
  if (!Array.isArray(items)) return [];
  const byId = categoryLookup(categories);
  return items.map((item) => mapMenuItemForDisplay(item, byId, storeOnline));
}

// Home page "Customer Favorites": items marked favorite, else the most viewed,
// else the first available items. Never sample data.
export function buildFavorites(items, categories, limit = 3) {
  const available = buildMenuItems(items, categories).filter((item) => item.isAvailable);
  const marked = available.filter((item) => item.isFavorite);
  if (marked.length > 0) return marked.slice(0, limit);

  const viewed = available.filter((item) => item.viewCount > 0).sort((a, b) => b.viewCount - a.viewCount);
  if (viewed.length > 0) return viewed.slice(0, limit);

  return available.slice(0, limit);
}
// Categories, ready to show. Returns [] when there is nothing yet.
export function buildCategories(categories) {
  if (!Array.isArray(categories)) return [];
  return categories.map(mapCategoryForDisplay);
}


