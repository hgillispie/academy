'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function AuthStatus() {
  const [builderUserId, setBuilderUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the auth status from Convex using the Builder.io user ID
  const status = useQuery(api.auth.getUserAuthStatus, builderUserId ? { builderUserId } : {});

  useEffect(() => {
    // Check for Builder.io cookies on the client side
    const checkBuilderCookies = () => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const builderUserIdCookie = cookies.find(cookie => cookie.startsWith('builder.userId='));

      if (builderUserIdCookie) {
        const userId = builderUserIdCookie.split('=')[1];
        setBuilderUserId(userId);
      }

      setIsLoading(false);
    };

    checkBuilderCookies();
  }, []);

  return (
    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 my-4">
      <h2 className="text-xl font-bold mb-2">Authentication Status</h2>

      {isLoading ? (
        <p className="mb-4">Loading authentication status...</p>
      ) : (
        <>
          <p className="mb-2">
            Status: <span className="text-green-600 font-semibold">Authenticated</span>
          </p>

          <p className="mb-4">
            Source:{' '}
            {builderUserId ? (
              <span className="text-blue-600 font-semibold">Builder.io User ({builderUserId})</span>
            ) : (
              <span className="text-green-600 font-semibold">Guest Mode</span>
            )}
          </p>

          {builderUserId ? (
            <p className="text-sm text-gray-600">
              You&apos;re signed in using your Builder.io account
            </p>
          ) : (
            <p className="text-sm text-gray-600">You&apos;re using the application in guest mode</p>
          )}

          {status?.authenticated && (
            <div className="mt-4">
              <a
                href="https://builder.io/account"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors inline-block"
              >
                Manage Builder.io Account
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
