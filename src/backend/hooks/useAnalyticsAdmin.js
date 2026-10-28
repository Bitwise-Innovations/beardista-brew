import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActiveSurveyAdmin,
  getSurveyResponsesAdmin,
  saveSurveyQuestionsAdmin,
  updateSurveyResponseAdmin,
} from "../services/feedbackService";

const KEYS = {
  responses: ["analytics-admin", "responses"],
  survey: ["analytics-admin", "survey"],
};

export function useSurveyResponsesAdmin() {
  return useQuery({ queryKey: KEYS.responses, queryFn: getSurveyResponsesAdmin });
}

export function useActiveSurveyAdmin() {
  return useQuery({ queryKey: KEYS.survey, queryFn: getActiveSurveyAdmin });
}

export function useUpdateSurveyResponseAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => updateSurveyResponseAdmin(id, updates),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEYS.responses }),
  });
}

export function useSaveSurveyQuestionsAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ surveyId, questions }) => saveSurveyQuestionsAdmin(surveyId, questions),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEYS.survey }),
  });
}