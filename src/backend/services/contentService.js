import { supabase } from "../../lib/supabase";
import {
  mapAnnouncementFromDb,
  mapAnnouncementToDb,
  mapBaristaFromDb,
  mapFaqFromDb,
  mapStoreSettingFromDb,
} from "../mappers/contentMapper";

export async function getAnnouncements({ activeOnly = true } = {}) {
  let query = supabase.from("announcements").select("*").order("created_at", {
    ascending: false,
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
