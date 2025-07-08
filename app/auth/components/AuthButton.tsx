'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function AuthButton() {
  const {
    user,
    isLoading,
    isAuthenticated,
    wasPreviouslyAuthenticated,
    login,
    logout,
    isLoggingIn,
    isLoggingOut,
  } = useAuthContext();

  const [showAuthButton, setShowAuthButton] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      setShowAuthButton(true);
    } else if (!wasPreviouslyAuthenticated) {
      setShowAuthButton(true);
    } else {
      const timer = setTimeout(() => {
        setShowAuthButton(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, wasPreviouslyAuthenticated]);

  if (isLoading || !showAuthButton) {
    return (
      <button className="bg-gray-300 text-white px-4 py-2 rounded-full min-w-24" disabled>
        <span className="opacity-0">Loading</span>
      </button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{user.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {user.type
                ? user.type
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                : 'Free'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <button
              onClick={() => {
                logout();
                setIsDropdownOpen(false);
              }}
              disabled={isLoggingOut}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              {isLoggingOut ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full"></span>
                  <span>Signing out...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button onClick={() => login()} disabled={isLoggingIn} className="flex items-center gap-2">
      {isLoggingIn ? (
        <>
          <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          <span>Redirecting...</span>
        </>
      ) : (
        <span>Sign in with Builder.io</span>
      )}
    </Button>
  );
}
