import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  registerForEvent,
  updateEvent,
  verifyEventCode,
} from "../services/eventsService";

export const eventQueryKeys = {
  all: ["events"],
  lists: () => [...eventQueryKeys.all, "list"],
  list: (options) => [...eventQueryKeys.lists(), options],
  details: () => [...eventQueryKeys.all, "detail"],
  detail: (id, options) => [...eventQueryKeys.details(), id, options],
};

export function useEvents(options = {}) {
  return useQuery({
    queryKey: eventQueryKeys.list(options),
    queryFn: () => getEvents(options),
  });
}

export function useEvent(id, options = {}) {
  return useQuery({
    queryKey: eventQueryKeys.detail(id, options),
    queryFn: () => getEventById(id, options),
    enabled: id !== undefined && id !== null,
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerForEvent,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useVerifyEventCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registrationId, code }) =>
      verifyEventCode(registrationId, code),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => updateEvent(id, updates),
    onSuccess: (_event, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.detail(variables.id),
        }),
      ]),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}
