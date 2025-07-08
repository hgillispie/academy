import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from './components/navigation/Navbar';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import ConvexClientProvider from './components/providers/ConvexClientProvider';
import { QueryProvider } from './components/providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { AnalyticsProvider } from './providers/analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Builder Academy',
  description: 'Learn how to use Builder.io effectively',
  icons: {
    icon: '/logo.svg',
    apple: '/icon?size=180x180',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <QueryProvider>
              <AuthProvider>
                <AnalyticsProvider>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-1 bg-white">{children}</main>
                  </div>
                </AnalyticsProvider>
              </AuthProvider>
            </QueryProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
