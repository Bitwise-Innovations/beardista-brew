import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBarista,
  createAnnouncement,
  deleteAnnouncement,
  deleteBarista,
  getAnnouncements,
  getBaristaTeam,
  getFaqs,
  getStoreSettings,
  reorderAnnouncements,
  updateAnnouncement,
  updateBarista,
  updateStoreSetting,
  uploadSiteImage,
} from "../services/contentService";

export const contentQueryKeys = {
  all: ["content"],
  announcements: (options) => [...contentQueryKeys.all, "announcements", options],
  baristaTeam: () => [...contentQueryKeys.all, "barista-team"],
  faqs: () => [...contentQueryKeys.all, "faqs"],
  storeSettings: () => [...contentQueryKeys.all, "store-settings"],
};

function useInvalidate(key) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: key });
}

const announcementsKey = [...contentQueryKeys.all, "announcements"];

export function useAnnouncements(options = {}) {
  return useQuery({
    queryKey: contentQueryKeys.announcements(options),
    queryFn: () => getAnnouncements(options),
  });
}

export function useCreateAnnouncement() {
  const invalidate = useInvalidate(announcementsKey);
  return useMutation({ mutationFn: createAnnouncement, onSuccess: invalidate });
}

export function useUpdateAnnouncement() {
  const invalidate = useInvalidate(announcementsKey);
  return useMutation({
    mutationFn: ({ id, ...updates }) => updateAnnouncement(id, updates),
    onSuccess: invalidate,
  });
}

export function useDeleteAnnouncement() {
  const invalidate = useInvalidate(announcementsKey);
  return useMutation({ mutationFn: deleteAnnouncement, onSuccess: invalidate });
}

export function useReorderAnnouncements() {
  const invalidate = useInvalidate(announcementsKey);
  return useMutation({ mutationFn: reorderAnnouncements, onSettled: invalidate });
}

export function useBaristaTeam() {
  return useQuery({ queryKey: contentQueryKeys.baristaTeam(), queryFn: getBaristaTeam });
}

export function useAddBarista() {
  const invalidate = useInvalidate(contentQueryKeys.baristaTeam());
  return useMutation({ mutationFn: addBarista, onSuccess: invalidate });
}

export function useUpdateBarista() {
  const invalidate = useInvalidate(contentQueryKeys.baristaTeam());
  return useMutation({
    mutationFn: ({ id, ...updates }) => updateBarista(id, updates),
    onSuccess: invalidate,
  });
}

export function useDeleteBarista() {
  const invalidate = useInvalidate(contentQueryKeys.baristaTeam());
  return useMutation({ mutationFn: deleteBarista, onSuccess: invalidate });
}

export function useFaqs() {
  return useQuery({ queryKey: contentQueryKeys.faqs(), queryFn: getFaqs });
}

export function useStoreSettings() {
  return useQuery({ queryKey: contentQueryKeys.storeSettings(), queryFn: getStoreSettings });
}

export function useUpdateStoreSetting() {
  const invalidate = useInvalidate(contentQueryKeys.storeSettings());
  return useMutation({
    mutationFn: ({ key, value }) => updateStoreSetting(key, value),
    onSuccess: invalidate,
  });
}

export function useUploadSiteImage() {
  return useMutation({ mutationFn: ({ file, folder }) => uploadSiteImage(file, folder) });
}