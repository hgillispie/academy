import { createRouteMatcher } from '@convex-dev/auth/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api';

// Initialize the Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const isSignInPage = createRouteMatcher(['/auth/signin']);
const isProtectedRoute = createRouteMatcher([
  '/courses/:courseId',
  '/courses/:courseId/:path*',
  '/events',
  '/admin',
  '/certification',
]);

const isAdminRoute = createRouteMatcher(['/dashboard', '/dashboard/:path*']);

const isCourseContentRoute = createRouteMatcher([
  '/courses/:courseId',
  '/courses/:courseId/:path*',
]);

export default async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const sessionToken = cookies.get('builder_session')?.value;
  const legacyUserId = cookies.get('builder.userId')?.value;
  const hasValidSession = !!sessionToken || !!legacyUserId;

  if (request.nextUrl.pathname === '/courses') {
    return NextResponse.next();
  }

  // Check access to course content based on user type
  if (isCourseContentRoute(request) && hasValidSession) {
    try {
      let user;
      if (convex && sessionToken) {
        const session = await convex.query(api.auth.getSessionByToken, { sessionToken });
        if (session) {
          user = await convex.query(api.auth.getUser, { builderUserId: session.userId });
        }
      } else if (legacyUserId && convex) {
        user = await convex.query(api.auth.getUser, { builderUserId: legacyUserId });
      }

      // Only allow super_admin, partner, and client user types to access courses
      if (user && user.type === 'free') {
        // Redirect free users to a page explaining the restriction
        return NextResponse.redirect(new URL('/courses', request.url));
      }
    } catch (error) {
      console.error('Error checking user access:', error);
    }
  }

  if (isAdminRoute(request)) {
    if (!hasValidSession) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    try {
      if (convex && sessionToken) {
        const session = await convex.query(api.auth.getSessionByToken, { sessionToken });

        if (session) {
          const user = await convex.query(api.auth.getUser, { builderUserId: session.userId });

          if (user?.type !== 'super_admin') {
            return NextResponse.redirect(new URL('/courses', request.url));
          }
        }
      } else if (legacyUserId && convex) {
        const user = await convex.query(api.auth.getUser, { builderUserId: legacyUserId });

        if (user?.type !== 'super_admin') {
          return NextResponse.redirect(new URL('/courses', request.url));
        }
      } else {
        return NextResponse.redirect(new URL('/courses', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/courses', request.url));
    }
  }

  if (isProtectedRoute(request) && !hasValidSession) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isSignInPage(request) && hasValidSession) {
    const returnUrl = request.nextUrl.searchParams.get('returnUrl');
    return NextResponse.redirect(new URL(returnUrl || '/courses', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/api/builder/')) {
    if (!hasValidSession) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const headers = new Headers(request.headers);
    if (sessionToken) {
      headers.set('X-Builder-Session-Token', sessionToken);
    }

    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/courses',
    '/courses/:path*',
    '/events/:path*',
    '/certification/:path*',
    '/auth/signin',
    '/api/builder/:path*',
  ],
};
