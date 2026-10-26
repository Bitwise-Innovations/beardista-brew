import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAnnouncements,
  getBaristaTeam,
  getFaqs,
  getStoreSettings,
  updateAnnouncement,
  updateStoreSetting,
} from "../services/contentService";

export const contentQueryKeys = {
  all: ["content"],
  announcements: (options) => [...contentQueryKeys.all, "announcements", options],
  baristaTeam: () => [...contentQueryKeys.all, "barista-team"],
  faqs: () => [...contentQueryKeys.all, "faqs"],
  storeSettings: () => [...contentQueryKeys.all, "store-settings"],
};

export function useAnnouncements(options = {}) {
  return useQuery({
    queryKey: contentQueryKeys.announcements(options),
    queryFn: () => getAnnouncements(options),
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => updateAnnouncement(id, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...contentQueryKeys.all, "announcements"],
      }),
  });
}

export function useBaristaTeam() {
  return useQuery({
    queryKey: contentQueryKeys.baristaTeam(),
    queryFn: getBaristaTeam,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: contentQueryKeys.faqs(),
    queryFn: getFaqs,
  });
}

export function useStoreSettings() {
  return useQuery({
    queryKey: contentQueryKeys.storeSettings(),
    queryFn: getStoreSettings,
  });
}

export function useUpdateStoreSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }) => updateStoreSetting(key, value),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.storeSettings(),
      }),
  });
}
