import { useMutation, useQuery } from "@tanstack/react-query";
import { getCustomerVoice, submitSurveyAnswers } from "../services/feedbackService";

export function useCustomerVoice() {
  return useQuery({ queryKey: ["customer-voice"], queryFn: () => getCustomerVoice(3) });
}

export function useSubmitSurvey() {
  return useMutation({ mutationFn: submitSurveyAnswers });
}