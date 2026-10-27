import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getEventFormQuestions,
  getEventParticipantTypes,
  getEventSignups,
  registerForEvent,
  saveEventForms,
  updateEvent,
  verifyEventCode,
} from "../services/eventsService";

export const eventQueryKeys = {
  all: ["events"],
  lists: () => [...eventQueryKeys.all, "list"],
  list: (options) => [...eventQueryKeys.lists(), options],
  details: () => [...eventQueryKeys.all, "detail"],
  detail: (id, options) => [...eventQueryKeys.details(), id, options],
  participantTypes: (eventId) => [
    ...eventQueryKeys.all,
    "participant-types",
    eventId,
  ],
  formQuestions: (eventId) => [
    ...eventQueryKeys.all,
    "form-questions",
    eventId,
  ],
  signups: (eventId) => [...eventQueryKeys.all, "signups", eventId],
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

export function useEventParticipantTypes(eventId) {
  const query = useQuery({
    queryKey: eventQueryKeys.participantTypes(eventId),
    queryFn: () => getEventParticipantTypes(eventId),
    enabled: eventId !== undefined && eventId !== null,
  });
  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useEventFormQuestions(eventId) {
  const query = useQuery({
    queryKey: eventQueryKeys.formQuestions(eventId),
    queryFn: () => getEventFormQuestions(eventId),
    enabled: eventId !== undefined && eventId !== null,
  });
  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useEventSignups(eventId) {
  const query = useQuery({
    queryKey: eventQueryKeys.signups(eventId),
    queryFn: () => getEventSignups(eventId),
    enabled: eventId !== undefined && eventId !== null,
  });
  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useSaveEventForms() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: saveEventForms,
    onSuccess: (_result, variables) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.participantTypes(variables.eventId),
        }),
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.formQuestions(variables.eventId),
        }),
      ]),
  });
  return {
    ...mutation,
    data: mutation.data,
    loading: mutation.isPending,
    error: mutation.error,
  };
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerForEvent,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all }),
  });
}

export function useRegisterEvent() {
  const mutation = useRegisterForEvent();
  return {
    ...mutation,
    data: mutation.data,
    loading: mutation.isPending,
    error: mutation.error,
  };
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
