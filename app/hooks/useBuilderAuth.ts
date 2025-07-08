'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useBuilderAuth() {
  const [builderUserId, setBuilderUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the user info from Convex using the Builder.io user ID
  const user = useQuery(api.auth.getUser, builderUserId ? { builderUserId } : {});

  // Check for Builder.io user ID cookie
  const checkBuilderUserId = useCallback(() => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const builderUserIdCookie = cookies.find(cookie => cookie.startsWith('builder.userId='));

    if (builderUserIdCookie) {
      const userId = builderUserIdCookie.split('=')[1];
      setBuilderUserId(userId);
      return true;
    }
    setBuilderUserId(null);
    return false;
  }, []);

  // Handle popup login
  const handleLoginClick = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();

      // Open popup window
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        'https://builder.io/login',
        'BuilderLogin',
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      // Check for cookie every second
      const checkInterval = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkInterval);
          return;
        }

        try {
          // Check if we got the cookie
          if (checkBuilderUserId()) {
            clearInterval(checkInterval);
            popup.close();
          }
        } catch {
          // Handle cross-origin errors silently
        }
      }, 1000);

      // Cleanup interval if popup closes
      const cleanupInterval = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(cleanupInterval);
          clearInterval(checkInterval);
          // Recheck cookie one last time in case user logged in
          checkBuilderUserId();
        }
      }, 500);
    },
    [checkBuilderUserId],
  );

  useEffect(() => {
    checkBuilderUserId();
    setIsLoading(false);
  }, [checkBuilderUserId]);

  return {
    user,
    builderUserId,
    isLoading,
    handleLoginClick,
    checkBuilderUserId,
  };
}
