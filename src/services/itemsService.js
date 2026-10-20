import { supabase } from "@/lib/supabase";

export async function getFeatured() {
  const { data, error } = await supabase
    .from("items")
    .select("*, categories(name)")
    .eq("is_featured", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}