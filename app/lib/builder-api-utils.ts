/**
 * Utility functions for working with the Builder.io API
 */

/**
 * Gets the base URL for the Builder API based on the environment
 */
export function getBuilderApiBaseUrl(): string {
  return process.env.BUILDER_API_URL || 'https://cdn.builder.io/api/internal/user/basic-info';
}

/**
 * Interface for Builder API user information
 */
export interface BuilderUserInfo {
  user: {
    id: string;
    email: string;
    name: string;
    isEnterprise: boolean;
  };
  space: {
    id: string;
    name: string;
    subscription: string;
    hasParentOrganization: boolean;
  };
  permissions: {
    role: string;
  };
}

/**
 * Fetches user information from the Builder API
 * @param privateKey Builder private key
 * @param userId Builder user ID
 * @param apiKey Builder API key
 * @returns User information or null if an error occurs
 */
export async function fetchBuilderUserInfo(
  privateKey: string,
  userId: string,
  apiKey: string,
): Promise<BuilderUserInfo | null> {
  if (!privateKey || !userId || !apiKey) {
    console.error('Missing required parameters for Builder API request');
    return null;
  }

  try {
    const baseUrl = getBuilderApiBaseUrl();
    const url = new URL(baseUrl);
    url.searchParams.append('apiKey', apiKey);
    url.searchParams.append('userId', userId);

    const headers: HeadersInit = {
      Authorization: `Bearer ${privateKey}`,
    };

    // Set up controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url.toString(), {
        headers,
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Builder API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (
        fetchError &&
        typeof fetchError === 'object' &&
        'name' in fetchError &&
        fetchError.name === 'AbortError'
      ) {
        throw new Error('Builder API request timed out');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching Builder user info:', error);
    return null;
  }
}
