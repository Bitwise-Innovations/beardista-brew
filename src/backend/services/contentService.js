import { supabase } from "../lib/supabase";
import {
  mapAnnouncementFromDb,
  mapAnnouncementToDb,
  mapBaristaFromDb,
  mapFaqFromDb,
  mapStoreSettingFromDb,
} from "../mappers/contentMapper";

export async function getAnnouncements({ activeOnly = true } = {}) {
 let query = supabase
    .from("announcements")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false 
  });
  if (activeOnly) {
    const now = new Date().toISOString();
    query = query
      .eq("is_active", true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gt.${now}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapAnnouncementFromDb);
}

export async function updateAnnouncement(id, updates) {
  const { data, error } = await supabase
    .from("announcements")
    .update(mapAnnouncementToDb(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapAnnouncementFromDb(data);
}

export async function getBaristaTeam() {
  const { data, error } = await supabase
    .from("barista_team")
    .select("*")
    .order("display_order")
    .order("name");
  if (error) throw error;
  return data.map(mapBaristaFromDb);
}

export async function getFaqs() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order")
    .order("question");
  if (error) throw error;
  return data.map(mapFaqFromDb);
}

export async function getStoreSettings() {
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .order("key");
  if (error) throw error;
  return data.map(mapStoreSettingFromDb);
}

export async function updateStoreSetting(key, value) {
  const { data, error } = await supabase
    .from("store_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )
    .select()
    .single();
  if (error) throw error;
  return mapStoreSettingFromDb(data);
}
const SITE_IMAGE_BUCKET = "site-images";

export async function uploadSiteImage(file, folder = "misc") {
  const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
  const path = `${folder}/${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
  const { error } = await supabase.storage
    .from(SITE_IMAGE_BUCKET)
    .upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(SITE_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createAnnouncement(announcement) {
  const { data, error } = await supabase
    .from("announcements")
    .insert(mapAnnouncementToDb(announcement))
    .select()
    .single();
  if (error) throw error;
  return mapAnnouncementFromDb(data);
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

// Saves the order as sort_order 1, 2, 3...
export async function reorderAnnouncements(ids) {
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("announcements").update({ sort_order: index + 1 }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;
}

export async function addBarista(barista) {
  const { data, error } = await supabase
    .from("barista_team")
    .insert(barista)
    .select()
    .single();
  if (error) throw error;
  return mapBaristaFromDb(data);
}

export async function updateBarista(id, updates) {
  const { data, error } = await supabase
    .from("barista_team")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapBaristaFromDb(data);
}

export async function deleteBarista(id) {
  const { error } = await supabase.from("barista_team").delete().eq("id", id);
  if (error) throw error;
}