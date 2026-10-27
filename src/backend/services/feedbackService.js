import { supabase } from "../lib/supabase";
import {
  mapDashboardAnalyticsFromDb,
  mapReviewFromDb,
  mapReviewToDb,
  mapSurveyFromDb,
} from "../mappers/feedbackMapper";

export async function getReviews({ publishedOnly = true } = {}) {
  let query = supabase.from("reviews").select("*").order("created_at", {
    ascending: false,
  });
  if (publishedOnly) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapReviewFromDb);
}

export async function submitReview(review) {
  const payload = mapReviewToDb(review);
  const { error } = await supabase.from("reviews").insert(payload);
  if (error) throw error;
  return mapReviewFromDb({
    ...payload,
    is_published: false,
    created_at: new Date().toISOString(),
  });
}

export async function toggleReviewPublished(id, isPublished) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapReviewFromDb(data);
}

export async function getSurveys({ activeOnly = true } = {}) {
  let query = supabase.from("surveys").select("*").order("created_at", {
    ascending: false,
  });
  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapSurveyFromDb);
}

export async function submitSurveyResponse(surveyId, answers) {
  const { error } = await supabase
    .from("survey_responses")
    .insert({ survey_id: surveyId, answers });
  if (error) throw error;
  return { surveyId, answers };
}

export async function getDashboardAnalytics() {
  const { data, error } = await supabase.rpc("get_dashboard_analytics");
  if (error) throw error;
  return mapDashboardAnalyticsFromDb(data);
}
// ---------------------------------------------------------------------------
// Admin: Analytics
// ---------------------------------------------------------------------------

export async function getSurveyResponsesAdmin() {
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateSurveyResponse(id, updates) {
  const { error } = await supabase.from("survey_responses").update(updates).eq("id", id);
  if (error) throw error;
}

// Saves the builder questions to the active survey, or creates one.
export async function saveSurveyQuestions(surveyId, questions) {
  const query = surveyId
    ? supabase.from("surveys").update({ questions }).eq("id", surveyId)
    : supabase.from("surveys").insert({ title: "Customer Survey", questions, is_active: true });
  const { error } = await query;
     if (error) throw error;
   }

export async function updateSurveyResponseAdmin(id, updates) {
  const { error } = await supabase.from("survey_responses").update(updates).eq("id", id);
  if (error) throw error;
}

export async function getActiveSurveyAdmin() {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveSurveyQuestionsAdmin(surveyId, questions) {
  const query = surveyId
    ? supabase.from("surveys").update({ questions }).eq("id", surveyId)
    : supabase.from("surveys").insert({ title: "Customer Survey", questions, is_active: true });
  const { error } = await query;
  if (error) throw error;
}