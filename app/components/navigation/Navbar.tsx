'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { AuthButton } from '../../auth/components/AuthButton';
import { useAdminStatus } from '../../hooks/useAdminStatus';
import { useAuthContext } from '@/providers/AuthProvider';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/courses', label: 'Courses' },
  // { path: "/events", label: "Events" },
  // { path: "/certification", label: "Certification" },
  { path: '/help', label: 'Help' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { isAdmin } = useAdminStatus();
  const { isAuthenticated } = useAuthContext();

  const showAdminItems = isAdmin && isAuthenticated;

  return (
    <nav className="bg-white border-b border-[#d3d3d3] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Builder Academy"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center ml-8 space-x-4">
              {navItems.map(item => (
                <div key={item.path} className="relative h-16 flex items-center">
                  <Link
                    href={item.path}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-[#cf0ec7] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {pathname === item.path && (
                    <div className="bg-[#cf0ec7] absolute w-full h-0.5 bottom-0 left-0" />
                  )}
                </div>
              ))}

              {/* Admin Dashboard Link - Only shown to super_admin users who are authenticated */}
              {showAdminItems && (
                <div className="relative h-16 flex items-center">
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 text-sm text-gray-700 hover:text-[#cf0ec7] transition-colors"
                  >
                    Dashboard
                  </Link>
                  {pathname === '/dashboard' && (
                    <div className="bg-[#cf0ec7] absolute w-full h-0.5 bottom-0 left-0" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Auth Button */}
          <div className="flex-shrink-0">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
