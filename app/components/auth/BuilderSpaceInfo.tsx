'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';

export function BuilderSpaceInfo() {
  const { user, isAuthenticated, refreshUser, isLoading: authLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user && !hasAttemptedFetch) {
      setIsLoading(true);
      setHasAttemptedFetch(true);
      refreshUser().finally(() => {
        setIsLoading(false);
      });
    }
  }, [isAuthenticated, user, refreshUser, hasAttemptedFetch]);

  if (authLoading || isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">Builder.io Space</h2>
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading space information...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !authLoading && !isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">Builder.io Space</h2>
        <p className="text-gray-600">Please sign in to view your space information.</p>
      </div>
    );
  }

  if (isAuthenticated && !user && !isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">Builder.io Space</h2>
        <p className="text-gray-600">
          Unable to load space information.{' '}
          <button
            onClick={() => {
              setIsLoading(true);
              refreshUser().finally(() => setIsLoading(false));
            }}
            className="text-blue-500 underline"
          >
            Retry
          </button>
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
        <h2 className="text-lg font-semibold text-purple-800">Builder.io Space</h2>

        <div className="mt-3 space-y-2">
          <div>
            <span className="font-medium">Space Name:</span>
            <span className="ml-2 text-purple-700">{user.spaceName || 'Not available'}</span>
          </div>

          <div>
            <span className="font-medium">Space ID:</span>
            <span className="ml-2 text-purple-700 font-mono text-sm">
              {user.spaceId || 'Not available'}
            </span>
          </div>

          <div>
            <span className="font-medium">Subscription:</span>
            <span className="ml-2 text-purple-700">{user.subscription || 'Not available'}</span>
          </div>

          <div>
            <span className="font-medium">Account Type:</span>
            <span className="ml-2 text-purple-700">
              {user.isEnterprise ? 'Enterprise' : 'Standard'}
            </span>
          </div>

          <div>
            <span className="font-medium">Parent Organization:</span>
            <span className="ml-2 text-purple-700">{user.hasParentOrg ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="mt-4">
          <a
            href="https://builder.io/account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Manage Builder Account
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold">Builder.io Space</h2>
      <p className="text-gray-600">Loading space information...</p>
    </div>
  );
}
