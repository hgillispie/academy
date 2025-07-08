'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import Link from 'next/link';

interface BuilderUserCheckProps {
  children: React.ReactNode;
  strictLock?: boolean;
  lockTitle?: string;
}

export function BuilderUserCheck({
  children,
  strictLock = true,
  lockTitle = 'Content Locked',
}: BuilderUserCheckProps) {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <div className="h-10 w-10 border-4 border-t-[#a97ff2] border-b-[#a97ff2] rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (!strictLock) {
      return (
        <div>
          <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-purple-800">
                  Sign in to unlock additional features
                </h3>
                <p className="text-purple-700">
                  Connect your Builder.io account for a better experience
                </p>
              </div>
              <Link
                href="/auth/signin"
                className="bg-[#a97ff2] text-white px-6 py-2 rounded-full hover:bg-[#9665d8] transition-colors whitespace-nowrap"
              >
                Sign In with Builder.io
              </Link>
            </div>
          </div>
          {children}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 bg-gray-50 rounded-lg p-8 border border-gray-200">
        <div className="text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-[#a97ff2] mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10v1m-5 3h10m-8 4h6a1 1 0 001-1V6a1 1 0 00-1-1H9a1 1 0 00-1 1v10a1 1 0 001 1z"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-2">{lockTitle}</h2>
          <p className="text-gray-600 mb-6">
            Please sign in with Builder.io to access this content and unlock all course materials.
          </p>
          <Link
            href="/auth/signin"
            className="bg-[#a97ff2] text-white px-6 py-2 rounded-full hover:bg-[#9665d8] transition-colors inline-block"
          >
            Sign In with Builder.io
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
