'use client';

import { useState, useEffect } from 'react';
import { useBuilderAuth } from './useBuilderAuth';
import { useAuthContext } from '@/providers/AuthProvider';

interface AdminStatusResponse {
  isAdmin: boolean;
  user?: {
    id: string;
    email: string | null;
    type?: string;
    subscription?: string | null;
  };
}

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<AdminStatusResponse['user'] | null>(null);
  const { isLoading: authLoading } = useBuilderAuth();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    async function checkAdminStatus() {
      if (authLoading) return;

      if (!isAuthenticated) {
        setIsAdmin(false);
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/check-admin');

        if (response.ok) {
          const data: AdminStatusResponse = await response.json();
          setIsAdmin(data.isAdmin);
          setUserData(data.user || null);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [authLoading, isAuthenticated]);

  return {
    isAdmin,
    isLoading,
    userData,
  };
}
