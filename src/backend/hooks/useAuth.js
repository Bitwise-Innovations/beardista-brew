import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import {
  changePassword,
  getProfile,
  getSession,
  logIn,
  logOut,
  sendPasswordReset,
} from "../services/authService";

const AUTH_QUERY_KEY = ["auth", "current"];
const EMPTY_AUTH = { user: null, profile: null };

export function useAuth() {
  const queryClient = useQueryClient();
  const currentAuth = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const session = await getSession();
      if (!session?.user) return EMPTY_AUTH;

      const profile = await getProfile(session.user.id);
      return { user: session.user, profile };
    },
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        queryClient.setQueryData(AUTH_QUERY_KEY, EMPTY_AUTH);
      } else {
        void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => logIn(email, password),
    onSuccess: (auth) => queryClient.setQueryData(AUTH_QUERY_KEY, auth),
  });

  const logoutMutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => queryClient.setQueryData(AUTH_QUERY_KEY, EMPTY_AUTH),
  });

  const passwordMutation = useMutation({ mutationFn: changePassword });
  const resetMutation = useMutation({ mutationFn: sendPasswordReset });

  return {
    user: currentAuth.data?.user ?? null,
    profile: currentAuth.data?.profile ?? null,
    isLoading: currentAuth.isPending,
    error: currentAuth.error,
    logIn: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logOut: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    changePassword: passwordMutation.mutateAsync,
    isChangingPassword: passwordMutation.isPending,
    sendPasswordReset: resetMutation.mutateAsync,
    isSendingPasswordReset: resetMutation.isPending,
  };
}
