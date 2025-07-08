import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { UserSchema } from '../../types/schemas';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

type ErrorResponse = {
  error: string;
  details?: string;
};

/**
 * API route to get user info from a secure session
 * This uses the session token to securely access Builder credentials
 */
export async function GET(request: NextRequest) {
  // Get parameters
  const searchParams = request.nextUrl.searchParams;
  const updateConvex = searchParams.get('update') === 'true';

  try {
    const sessionToken = request.cookies.get('builder_session')?.value;

    if (!sessionToken) {
      const errorResponse: ErrorResponse = {
        error: 'Authentication required',
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    if (!convex) {
      const errorResponse: ErrorResponse = {
        error: 'Server configuration error',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const session = await convex.query(api.auth.getSessionByToken, {
      sessionToken,
    });

    if (!session) {
      const errorResponse: ErrorResponse = {
        error: 'Session expired or invalid',
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const userData = await convex.query(api.auth.getUser, {
      builderUserId: session.userId,
    });

    if (!userData) {
      const errorResponse: ErrorResponse = {
        error: 'User not found',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const userResult = UserSchema.safeParse(userData);

    if (!userResult.success) {
      console.error('Invalid user data from Convex:', userResult.error);
      return NextResponse.json(userData);
    }

    if (updateConvex) {
      await convex.action(api.auth.updateUserDataFromBuilder, {
        sessionToken,
        userId: session.userId,
      });

      const updatedUserData = await convex.query(api.auth.getUser, {
        builderUserId: session.userId,
      });

      const updatedUserResult = UserSchema.safeParse(updatedUserData);

      if (!updatedUserResult.success) {
        console.error('Invalid updated user data from Convex:', updatedUserResult.error);
        return NextResponse.json(updatedUserData);
      }

      return NextResponse.json(updatedUserResult.data);
    }

    return NextResponse.json(userResult.data);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };

    console.error('Error in user-info API:', error);

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
