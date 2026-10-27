import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearNotifications,
  getAuditLogs,
  getNotifications,
  markNotificationRead,
} from "../services/auditService";

export const auditQueryKeys = {
  all: ["audit"],
  logs: (options) => [...auditQueryKeys.all, "logs", options],
  notifications: () => [...auditQueryKeys.all, "notifications"],
};

export function useAuditLogs(options = {}) {
  return useQuery({
    queryKey: auditQueryKeys.logs(options),
    queryFn: () => getAuditLogs(options),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: auditQueryKeys.notifications(),
    queryFn: getNotifications,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: auditQueryKeys.notifications(),
      }),
  });
}

export function useClearNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: auditQueryKeys.notifications(),
      }),
  });
}
