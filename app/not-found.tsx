'use client';

import { Footer } from '@/components/navigation/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-[600px] text-center">
          <Image
            src="/builder-404.svg"
            alt="Page not found"
            width={300}
            height={200}
            className="mx-auto mb-8"
            priority
          />

          <h1 className="text-4xl font-medium text-black mb-4">404 - Page Not Found</h1>

          <p className="text-gray-600 mb-8 text-lg">
            Oops! It seems like you&apos;ve ventured into uncharted territory. The page you&apos;re
            looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-[#a97ff2] text-white px-6 py-3 rounded-full inline-flex items-center justify-center gap-2 hover:bg-[#9665d8] transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/courses"
              className="border-2 border-[#a97ff2] text-[#a97ff2] px-6 py-3 rounded-full inline-flex items-center justify-center hover:bg-[#f5f0ff] transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          <div className="mt-12 p-6 bg-[#f5f0ff] rounded-lg border border-[#a97ff2]">
            <h2 className="text-xl font-medium mb-4 text-black">Looking for something specific?</h2>
            <ul className="text-gray-600 space-y-2 text-left">
              <li>
                • Check out our{' '}
                <Link href="/courses" className="text-[#a97ff2] hover:underline">
                  course catalog
                </Link>
              </li>
              <li>
                • Visit the{' '}
                <Link href="/help" className="text-[#a97ff2] hover:underline">
                  help center
                </Link>
              </li>
              <li>
                • Learn about{' '}
                <Link href="/certification" className="text-[#a97ff2] hover:underline">
                  certification
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
