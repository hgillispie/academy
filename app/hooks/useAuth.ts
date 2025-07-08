'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthAPI, AuthStorage } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';

// Auth query keys
export const authQueryKeys = {
  user: ['auth', 'user'] as const,
};

/**
 * Primary authentication hook using TanStack Query
 * This centralizes all auth-related functionality
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // User query - uses staleTime to avoid unnecessary refetches
  const userQuery = useQuery({
    queryKey: authQueryKeys.user,
    queryFn: () => AuthAPI.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Always return null instead of throwing when error occurs
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    // Initialize with enabled if we have a user ID in storage
    enabled: typeof window !== 'undefined' && !!AuthStorage.getUserId(),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      // Get the auth URL and set pending flag
      const authURL = AuthAPI.startAuthFlow();
      // Redirect to Builder.io auth
      router.push(authURL);
      // This doesn't actually return anything useful since we're redirecting
      return null;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Call the server-side logout API
      await AuthAPI.logout();
      // Invalidate user query after logout
      queryClient.setQueryData(authQueryKeys.user, null);
      router.push('/');
      return null;
    },
  });

  // Auth completion effect
  useEffect(() => {
    // Check if we need to complete the auth flow
    if (AuthStorage.getAuthPending() && AuthStorage.getUserId()) {
      // Complete the auth flow and update the query cache
      AuthAPI.completeAuthFlow().then(user => {
        if (user) {
          queryClient.setQueryData(authQueryKeys.user, user);
        }
      });
    }
  }, [queryClient]);

  // Refresh user data
  const refreshUser = async () => {
    return queryClient.fetchQuery({
      queryKey: authQueryKeys.user,
      queryFn: () => AuthAPI.getCurrentUser(true),
    });
  };

  // Check if previously authenticated (for UI optimization)
  const wasPreviouslyAuthenticated = AuthStorage.getPreviouslyAuthenticated();

  return {
    // User data and loading state
    user: userQuery.data,
    isLoading: userQuery.isLoading || userQuery.isFetching,
    isError: userQuery.isError,
    status: userQuery.status,

    // Auth state
    isAuthenticated: !!userQuery.data,
    wasPreviouslyAuthenticated,

    // Auth actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refreshUser,

    // Auth action states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
