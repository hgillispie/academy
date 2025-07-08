'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthButton } from '../components/AuthButton';
import { useAuthContext } from '@/providers/AuthProvider';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const returnUrl = searchParams.get('returnUrl') || '/courses';

  // If already authenticated, redirect to the return URL
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setRedirectMessage(
        `You're already signed in. Redirecting to ${returnUrl === '/courses' ? 'courses' : returnUrl}...`,
      );
      const timer = setTimeout(() => {
        router.push(returnUrl);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, router, returnUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Builder Academy</h1>
          <p className="mt-2 text-gray-600">Sign in to access courses</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {redirectMessage ? (
            <div className="mb-4 p-3 bg-green-50 rounded-md">
              <p className="text-green-800">{redirectMessage}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Access Builder Academy Content</h2>
                <p className="text-gray-600 mb-4">
                  Sign in with your Builder.io account to access course content and resources.
                </p>
                <div className="flex justify-center">
                  <AuthButton />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <p className="text-sm text-gray-500 text-center">
                  Need a Builder.io account?{' '}
                  <a
                    href="https://builder.io/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    Sign up for free
                  </a>
                </p>
              </div>
            </>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/" className="text-purple-600 hover:text-purple-800">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
