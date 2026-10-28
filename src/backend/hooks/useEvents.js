import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  createEventRow,
  deleteEvent,
  duplicateEventRow,
  getAdminEventsData,
  getEventById,
  getEventForm,
  getEvents,
  registerForEvent,
  resendEventCode,
  saveEventForms,
  updateEvent,
  updateEventRow,
  updateRegistrationStatus,
  verifyEventCode,
} from "../services/eventsService";

export const eventQueryKeys = {
  all: ["events"],
  lists: () => [...eventQueryKeys.all, "list"],
  list: (options) => [...eventQueryKeys.lists(), options],
  details: () => [...eventQueryKeys.all, "detail"],
  detail: (id, options) => [...eventQueryKeys.details(), id, options],
};

// ---------------------------------------------------------------------------
// Customer hooks
// ---------------------------------------------------------------------------

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

export function useEventForm(eventId) {
  return useQuery({
    queryKey: [...eventQueryKeys.all, "form", eventId],
    queryFn: () => getEventForm(eventId),
    enabled: Boolean(eventId),
  });
}

export function useRegisterForEvent() {
  return useMutation({ mutationFn: registerForEvent });
}

export function useVerifyEventCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registrationId, code }) => verifyEventCode(registrationId, code),
    // Refresh spots left once someone is confirmed.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useResendEventCode() {
  return useMutation({ mutationFn: resendEventCode });
}

// ---------------------------------------------------------------------------
// Old admin hooks (kept for anything still using them)
// ---------------------------------------------------------------------------

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => updateEvent(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

// ---------------------------------------------------------------------------
// Admin hooks. Every change refreshes all event data.
// ---------------------------------------------------------------------------

function useEventsMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useAdminEventsData() {
  return useQuery({
    queryKey: [...eventQueryKeys.all, "admin"],
    queryFn: getAdminEventsData,
  });
}

export const useCreateAdminEvent = () => useEventsMutation(createEventRow);
export const useUpdateAdminEvent = () =>
  useEventsMutation(({ id, ...payload }) => updateEventRow(id, payload));
export const useDeleteAdminEvent = () => useEventsMutation(deleteEvent);
export const useDuplicateAdminEvent = () => useEventsMutation(duplicateEventRow);
export const useSaveEventForms = () => useEventsMutation(saveEventForms);
export const useUpdateRegistrationStatus = () =>
  useEventsMutation(({ id, status }) => updateRegistrationStatus(id, status));