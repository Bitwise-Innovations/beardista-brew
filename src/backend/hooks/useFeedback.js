import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardAnalytics,
  getReviews,
  getSurveys,
  submitReview,
  submitSurveyResponse,
  toggleReviewPublished,
} from "../services/feedbackService";

export const feedbackQueryKeys = {
  all: ["feedback"],
  reviews: (options) => [...feedbackQueryKeys.all, "reviews", options],
  surveys: (options) => [...feedbackQueryKeys.all, "surveys", options],
  dashboardAnalytics: () => [...feedbackQueryKeys.all, "dashboard-analytics"],
};

export function useReviews(options = {}) {
  return useQuery({
    queryKey: feedbackQueryKeys.reviews(options),
    queryFn: () => getReviews(options),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitReview,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...feedbackQueryKeys.all, "reviews"],
      }),
  });
}

export function useToggleReviewPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }) => toggleReviewPublished(id, isPublished),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...feedbackQueryKeys.all, "reviews"],
        }),
        queryClient.invalidateQueries({
          queryKey: feedbackQueryKeys.dashboardAnalytics(),
        }),
      ]),
  });
}

export function useSurveys(options = {}) {
  return useQuery({
    queryKey: feedbackQueryKeys.surveys(options),
    queryFn: () => getSurveys(options),
  });
}

export function useSubmitSurveyResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ surveyId, answers }) =>
      submitSurveyResponse(surveyId, answers),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: feedbackQueryKeys.all,
      }),
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: feedbackQueryKeys.dashboardAnalytics(),
    queryFn: getDashboardAnalytics,
  });
}
