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
