import { supabase } from "../lib/supabase";
import {
  mapCategoryFromDb,
  mapCategoryToDb,
  mapMenuItemFromDb,
  mapMenuItemToDb,
} from "../mappers/menuMapper";

const MENU_IMAGE_BUCKET = "menu-images";

export async function fetchCategories({ activeOnly = false } = {}) {
  let query = supabase.from("categories").select("*").order("sort_order");
  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapCategoryFromDb);
}

export async function addCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert(mapCategoryToDb(category))
    .select()
    .single();
  if (error) throw error;
  return mapCategoryFromDb(data);
}

export async function editCategory(id, updates) {
  const { data, error } = await supabase
    .from("categories")
    .update(mapCategoryToDb(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapCategoryFromDb(data);
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderCategories(categories) {
  const updates = categories.map((category, index) => ({
    id: typeof category === "object" ? category.id : category,
    sort_order: index,
  }));
  const { error } = await supabase.rpc("reorder_categories", {
    category_orders: updates,
  });
  if (error) throw error;
}

export async function fetchMenuItems({
  categoryId,
  availableOnly = false,
} = {}) {
  let query = supabase.from("menu_items").select("*").order("sort_order");
  if (categoryId !== undefined) query = query.eq("category_id", categoryId);
  if (availableOnly) query = query.eq("is_available", true);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapMenuItemFromDb);
}

export async function addMenuItem(item) {
  const { data, error } = await supabase
    .from("menu_items")
    .insert(mapMenuItemToDb(item))
    .select()
    .single();
  if (error) throw error;
  return mapMenuItemFromDb(data);
}

export async function editMenuItem(id, updates) {
  const { data, error } = await supabase
    .from("menu_items")
    .update(mapMenuItemToDb(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapMenuItemFromDb(data);
}

export async function deleteMenuItem(id) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadMenuItemImage(file, filePath) {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop().toLowerCase()
    : "";
  const path =
    filePath ??
    `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
  const { error } = await supabase.storage
    .from(MENU_IMAGE_BUCKET)
    .upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function incrementItemViewCount(id) {
  const { data, error } = await supabase.rpc(
    "increment_menu_item_view_count",
    { p_item_id: id }
  );
  if (error) throw error;
  return data;
}
