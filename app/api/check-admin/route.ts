import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

// Initialize the Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * API route to check if current user has admin status
 */
export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('builder_session')?.value;
    const legacyUserId = request.cookies.get('builder.userId')?.value;

    // Require session token for authentication
    if (!sessionToken && !legacyUserId) {
      return NextResponse.json({ isAdmin: false });
    }

    if (!convex) {
      console.error('Convex client not initialized');
      return NextResponse.json({ isAdmin: false });
    }

    // If we have a session token, use that for the check
    if (sessionToken) {
      // Get session data from Convex
      const session = await convex.query(api.auth.getSessionByToken, { sessionToken });

      if (!session) {
        return NextResponse.json({ isAdmin: false });
      }

      // Get user data from Convex
      const user = await convex.query(api.auth.getUser, { builderUserId: session.userId });

      if (!user) {
        return NextResponse.json({ isAdmin: false });
      }

      // Check admin status - user must have type 'super_admin'
      return NextResponse.json({
        isAdmin: user.type === 'super_admin',
      });
    }

    // Fall back to legacy user ID if no session token
    if (legacyUserId) {
      const user = await convex.query(api.auth.getUser, { builderUserId: legacyUserId });

      if (!user) {
        return NextResponse.json({ isAdmin: false });
      }

      // Check admin status - user must have type 'super_admin'
      return NextResponse.json({
        isAdmin: user.type === 'super_admin',
      });
    }

    // Default to false if no user found
    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false });
  }
}
