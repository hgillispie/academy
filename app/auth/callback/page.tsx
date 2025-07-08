'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeBuilderAuthMutation = useMutation(api.auth.storeBuilderAuth);

  useEffect(() => {
    const privateKey = searchParams.get('p-key');
    const apiKey = searchParams.get('api-key');
    const userId = searchParams.get('user-id');

    if (privateKey && apiKey && userId) {
      // Get existing cookies
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const existingApiKey = cookies
        .find(cookie => cookie.startsWith('builder.apiKey='))
        ?.split('=')[1];
      const existingUserId = cookies
        .find(cookie => cookie.startsWith('builder.userId='))
        ?.split('=')[1];

      // Only set cookies if they don't exist or are different
      if (existingApiKey !== apiKey) {
        document.cookie = `builder.apiKey=${apiKey}; path=/; secure; max-age=2592000; SameSite=Strict`;
      }

      if (existingUserId !== userId) {
        // Set both cookie formats to ensure compatibility with both auth systems
        document.cookie = `builder.userId=${userId}; path=/; secure; max-age=2592000; SameSite=Strict`;
        document.cookie = `builder_user_id=${userId}; path=/; secure; max-age=2592000; SameSite=Strict`;

        // Also set a session cookie for the new auth system
        const sessionToken = crypto.randomUUID();
        document.cookie = `builder_session=${sessionToken}; path=/; secure; max-age=2592000; SameSite=Strict`;
      }

      // Store in Convex database for server-side use
      storeBuilderAuthMutation({
        privateKey,
        apiKey,
        userId,
      })
        .then(() => {
          setStatus('success');
          // Redirect after brief delay
          setTimeout(() => {
            // Store a flag in sessionStorage to trigger auth refresh in other components
            sessionStorage.setItem('builder_auth_pending', 'true');
            router.push('/courses');
          }, 1500);
        })
        .catch(error => {
          console.error('Error storing auth data:', error);
          setStatus('error');
        });
    } else {
      setStatus('error');
    }
  }, [searchParams, router, storeBuilderAuthMutation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
          <h1 className="mt-6 text-2xl font-bold">Authenticating with Builder.io...</h1>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Authentication Successful</h1>
          <p className="mt-2 text-gray-600">Redirecting you to the courses...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Authentication Failed</h1>
          <p className="mt-2 text-gray-600">Unable to authenticate with Builder.io</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push('/')}
          >
            Return Home
          </button>
        </>
      )}
    </div>
  );
}
