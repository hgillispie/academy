'use client';

import { useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { AuthStorage } from '@/lib/services/auth';

/**
 * A hook that automatically refreshes user state when needed.
 * Can be used in layout components and on pages that require fresh auth state.
 *
 * @param options Configuration options
 * @returns Object with auth state and methods
 */
export function useAuthRefresh(
  options: {
    /**
     * Whether to check for pending auth on mount
     * This is useful for components that are loaded after login
     */
    checkPendingAuth?: boolean;
    /**
     * Whether to refresh on mount regardless of pending status
     */
    refreshOnMount?: boolean;
  } = {},
) {
  const { user, isLoading, refreshUser, isAuthenticated } = useAuthContext();

  useEffect(() => {
    const isPendingAuth = AuthStorage.getAuthPending();

    if (options.refreshOnMount) {
      refreshUser();
    } else if (options.checkPendingAuth && isPendingAuth) {
      refreshUser();
      AuthStorage.setAuthPending(false);
    }
  }, [refreshUser, options.refreshOnMount, options.checkPendingAuth]);

  return {
    user,
    isLoading,
    refreshUser,
    isAuthenticated,
  };
}
