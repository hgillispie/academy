import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Convex client for server-side mutations
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Auth callback handler for Builder CLI authentication
 * This is server-side code that securely handles the auth credentials
 */
export async function GET(request: NextRequest) {
  // Get auth parameters from query
  const searchParams = request.nextUrl.searchParams;
  const privateKey = searchParams.get('p-key');
  const apiKey = searchParams.get('api-key');
  const userId = searchParams.get('user-id');
  const previewUrl = searchParams.get('preview-url');
  const orgName = searchParams.get('org-name');
  const kind = searchParams.get('kind');

  // Sanitize preview URL: if it points back to the callback, ignore it
  const safePreviewUrl =
    previewUrl && !previewUrl.includes('/api/auth/callback') ? previewUrl : null;

  // Validate required parameters
  if (!privateKey || !apiKey || !userId) {
    return NextResponse.redirect(new URL('/auth/error?reason=missing_params', request.url));
  }

  try {
    // Generate a secure session token
    const sessionToken = uuidv4();

    // Store auth data in Convex
    if (!convex) {
      return NextResponse.redirect(new URL('/auth/error?reason=server_error', request.url));
    }

    // Create session record in Convex with all auth data
    await convex.mutation(api.auth.createSession, {
      sessionToken,
      privateKey,
      apiKey,
      userId,
      orgName: orgName || null,
      kind: kind || null,
      userAgent: request.headers.get('user-agent') || null,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
    });

    // Also store user data for quick access
    await convex.action(api.auth.updateUserDataFromBuilder, {
      sessionToken,
      userId,
    });

    // Determine redirect URL
    const redirectUrl = safePreviewUrl || '/dashboard';

    // Create response with session cookie and redirect
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    // Set secure HTTP-only cookie with session token
    response.cookies.set('builder_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set a user ID cookie (non-secure, for UI purposes only)
    response.cookies.set('builder_user_id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error?reason=server_error', request.url));
  }
}
