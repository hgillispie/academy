import { User, AuthResponseSchema } from '@/types/auth';

/**
 * Auth Storage - Centralized storage utilities for authentication
 */
export const AuthStorage = {
  // Session token management
  getSessionToken(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const sessionCookie = cookies.find(cookie => cookie.startsWith('builder_session='));
    return sessionCookie ? sessionCookie.split('=')[1] : null;
  },

  // User ID management
  getUserId(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const userIdCookie = cookies.find(cookie => cookie.startsWith('builder_user_id='));
    return userIdCookie ? userIdCookie.split('=')[1] : null;
  },

  // Auth state persistence
  setPreviouslyAuthenticated(value: boolean): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('builder_was_authenticated', value ? 'true' : 'false');
    }
  },

  getPreviouslyAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('builder_was_authenticated') === 'true';
  },

  // Auth flow flags
  setAuthPending(value: boolean): void {
    if (typeof sessionStorage !== 'undefined') {
      if (value) {
        sessionStorage.setItem('builder_auth_pending', 'true');
      } else {
        sessionStorage.removeItem('builder_auth_pending');
      }
    }
  },

  getAuthPending(): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem('builder_auth_pending') === 'true';
  },

  // Clear all auth data
  clearAll(): void {
    // Clear cookies
    document.cookie = 'builder_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'builder_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'builder.userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'builder.apiKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

    // Clear storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('builder_auth_pending');
      // Don't remove 'builder_was_authenticated' as we use it to optimize the UI
    }
  },

  // Clear all auth data from client storage
  clearLocalData(): void {
    // Clear storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('builder_auth_pending');
      // Don't remove 'builder_was_authenticated' as we use it to optimize the UI
    }
  },
};

/**
 * Auth API - Functions for interacting with authentication endpoints
 */
export const AuthAPI = {
  // Fetch current user information
  async getCurrentUser(update = false): Promise<User | null> {
    const url = update ? '/api/user-info?update=true' : '/api/user-info';

    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    // Use Zod to validate the response
    const validatedResponse = AuthResponseSchema.parse({
      user: data,
      isAuthenticated: !!data,
    });

    return validatedResponse.user;
  },

  // Get Builder.io auth URL
  getBuilderAuthURL(): string {
    const BUILDER_CLI_AUTH_URL = 'https://builder.io/cli-auth';
    const redirectURL = `${window.location.origin}/api/auth/callback`;

    const authURL = new URL(BUILDER_CLI_AUTH_URL);
    authURL.searchParams.set('response_type', 'code');
    authURL.searchParams.set('host', window.location.origin);
    authURL.searchParams.set('client_id', 'Builder Academy');
    authURL.searchParams.set('redirect_url', redirectURL);

    // Current path to return to after auth
    const currentPath = window.location.pathname;
    authURL.searchParams.set('preview-url', currentPath);

    return authURL.toString();
  },

  // Start authentication flow
  startAuthFlow(): string {
    // Set auth pending flag
    AuthStorage.setAuthPending(true);

    return this.getBuilderAuthURL();
  },

  // Complete authentication flow after redirect
  async completeAuthFlow(): Promise<User | null> {
    // If we have an auth pending flag and a user ID, consider auth successful
    if (AuthStorage.getAuthPending() && AuthStorage.getUserId()) {
      // Clear pending flag
      AuthStorage.setAuthPending(false);
      // Mark as previously authenticated
      AuthStorage.setPreviouslyAuthenticated(true);

      // Fetch updated user data
      return await this.getCurrentUser(true);
    }

    return null;
  },

  // Log out
  async logout(): Promise<void> {
    try {
      // Call the server logout endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear client-side data regardless of server response
      AuthStorage.clearLocalData();

      if (!response.ok) {
        console.error('Logout API error:', response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local data even if API call fails
      AuthStorage.clearLocalData();
    }
  },
};
