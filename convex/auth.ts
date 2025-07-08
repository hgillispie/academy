import { v } from 'convex/values';
import { query, mutation, action } from './_generated/server';
import { api } from './_generated/api';
import { determineUserType } from './roles';

export const storeBuilderAuth = mutation({
  args: {
    privateKey: v.string(),
    apiKey: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_builder_id', q => q.eq('id', args.userId))
      .first();

    if (existingUser) {
      // Update user
      return await ctx.db.patch(existingUser._id, {
        isAuthenticated: true,
        updatedAt: Date.now(),
      });
    } else {
      // Create new user
      return await ctx.db.insert('users', {
        id: args.userId,
        name: 'Builder User', // Adding a default name since it's required in the schema
        isAuthenticated: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const sessionSchema = {
  sessionToken: v.string(),
  privateKey: v.string(),
  apiKey: v.string(),
  userId: v.string(),
  orgName: v.optional(v.union(v.string(), v.null())),
  kind: v.optional(v.union(v.string(), v.null())),
  userAgent: v.optional(v.union(v.string(), v.null())),
  ipAddress: v.optional(v.union(v.string(), v.null())),
  createdAt: v.number(),
  expiresAt: v.number(),
  isActive: v.boolean(),
};

export const createSession = mutation({
  args: {
    sessionToken: v.string(),
    privateKey: v.string(),
    apiKey: v.string(),
    userId: v.string(),
    orgName: v.optional(v.union(v.string(), v.null())),
    kind: v.optional(v.union(v.string(), v.null())),
    userAgent: v.optional(v.union(v.string(), v.null())),
    ipAddress: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + 1000 * 60 * 60 * 24 * 7; // 7 days

    const sessionId = await ctx.db.insert('sessions', {
      sessionToken: args.sessionToken,
      privateKey: args.privateKey,
      apiKey: args.apiKey,
      userId: args.userId,
      orgName: args.orgName || null,
      kind: args.kind || null,
      userAgent: args.userAgent || null,
      ipAddress: args.ipAddress || null,
      createdAt: now,
      expiresAt: expiresAt,
      isActive: true,
    });

    return { sessionId };
  },
});

export const getSessionByToken = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    // Look up session by token
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_session_token', q => q.eq('sessionToken', args.sessionToken))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now() || !session.isActive) {
      return null;
    }

    return session;
  },
});

export const updateUserFromBuilderApi = mutation({
  args: {
    userData: v.object({
      user: v.object({
        id: v.string(),
        email: v.string(),
        name: v.string(),
        isEnterprise: v.boolean(),
      }),
      space: v.object({
        id: v.string(),
        name: v.string(),
        subscription: v.string(),
        hasParentOrganization: v.boolean(),
      }),
      permissions: v.object({
        role: v.string(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const { userData } = args;
    const builderId = userData.user.id;
    const type = determineUserType(userData.space.subscription, userData.user.email);

    const userDataToSave = {
      name: userData.user.name,
      email: userData.user.email,
      isAuthenticated: true,
      updatedAt: Date.now(),
      spaceId: userData.space.id,
      spaceName: userData.space.name,
      subscription: userData.space.subscription,
      hasParentOrg: userData.space.hasParentOrganization,
      role: userData.permissions.role,
      type,
      isEnterprise: userData.user.isEnterprise,
    };

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_builder_id', q => q.eq('id', builderId))
      .first();

    if (existingUser) {
      return await ctx.db.patch(existingUser._id, userDataToSave);
    } else {
      return await ctx.db.insert('users', {
        ...userDataToSave,
        id: builderId,
        createdAt: Date.now(),
      });
    }
  },
});

export const getUser = query({
  args: { builderUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.builderUserId) {
      return null;
    }

    const userId = args.builderUserId;

    const user = await ctx.db
      .query('users')
      .withIndex('by_builder_id', q => q.eq('id', userId))
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email || null,
      isAuthenticated: true,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt || Date.now(),
      spaceId: user.spaceId,
      spaceName: user.spaceName,
      subscription: user.subscription,
      hasParentOrg: user.hasParentOrg,
      role: user.role,
      type: user.type,
      isEnterprise: user.isEnterprise,
    };
  },
});

export const hasAccess = query({
  args: {
    resourceId: v.optional(v.string()),
    builderUserId: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    // TODO: Implement proper permission checking based on stored roles when the permission system is ready
    // For now, we just check if the user is authenticated with Builder.io
    return !!args.builderUserId;
  },
});

// Get user authentication status
export const getUserAuthStatus = query({
  args: { builderUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { builderUserId } = args;

    if (!builderUserId) {
      return {
        authenticated: false,
        userId: null,
        userInfo: null,
      };
    }

    // Check if the user exists in the database
    const user = await ctx.db
      .query('users')
      .withIndex('by_builder_id', q => q.eq('id', builderUserId))
      .first();

    if (user) {
      // Return user authentication status
      return {
        authenticated: true,
        userId: user._id,
        userInfo: user,
      };
    }

    return {
      authenticated: false,
      userId: null,
      userInfo: null,
    };
  },
});

// Interface for session data
interface SessionData {
  sessionToken: string;
  privateKey: string;
  apiKey: string;
  userId: string;
  isActive: boolean;
  // other optional fields
  [key: string]: any;
}

// Interface for Builder user data
interface BuilderUserData {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    isEnterprise?: boolean;
  };
  space?: {
    id?: string;
    name?: string;
    subscription?: string;
    hasParentOrganization?: boolean;
  };
  permissions?: {
    role?: string;
  };
}

// Update user data from Builder API using session credentials
export const updateUserDataFromBuilder = action({
  args: {
    sessionToken: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<{ userId: string }> => {
    // Get session for auth credentials
    const session: SessionData | null = await ctx.runQuery(api.auth.getSessionByToken, {
      sessionToken: args.sessionToken,
    });

    if (!session || !session.isActive) {
      throw new Error('Invalid session');
    }

    // Use server-side HTTP to fetch user data from Builder API
    const apiBaseUrl = 'https://cdn.builder.io/api/internal/user/basic-info';

    // Format the URL with query parameters as shown in the curl example
    const url = new URL(apiBaseUrl);
    url.searchParams.append('apiKey', session.apiKey);
    url.searchParams.append('userId', session.userId);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${session.privateKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const userData: BuilderUserData = await response.json();

    // Store user data in Convex using a mutation
    const userId: string = userData.user?.id || args.userId;

    // Determine the role based on subscription and email
    const userEmail = userData.user?.email || null;
    const subscription = userData.space?.subscription || null;

    const userRecord = {
      name: userData.user?.name || 'Builder User',
      email: userEmail,
      isEnterprise: userData.user?.isEnterprise || false,
      spaceId: userData.space?.id || null,
      spaceName: userData.space?.name || null,
      subscription: subscription,
      hasParentOrg: userData.space?.hasParentOrganization || false,
      role: userData.permissions?.role || 'member', // We'll override this in storeUserData
      updatedAt: Date.now(), // Always use number for timestamps
      isAuthenticated: true,
    };

    // Run a mutation to store the user data
    return await ctx.runMutation(api.auth.storeUserData, {
      userId,
      userRecord,
    });
  },
});

// Helper mutation to store user data (called by the action)
export const storeUserData = mutation({
  args: {
    userId: v.string(),
    userRecord: v.object({
      name: v.string(),
      email: v.union(v.string(), v.null()),
      isEnterprise: v.boolean(),
      spaceId: v.union(v.string(), v.null()),
      spaceName: v.union(v.string(), v.null()),
      subscription: v.union(v.string(), v.null()),
      hasParentOrg: v.boolean(),
      role: v.string(),
      updatedAt: v.number(), // Only accept number for timestamp
      isAuthenticated: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    // Determine type based on subscription
    const type = determineUserType(args.userRecord.subscription, args.userRecord.email);

    // Create the record with the calculated type
    const userRecordWithType = {
      ...args.userRecord,
      type,
    };

    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_builder_id', q => q.eq('id', args.userId))
      .first();

    // Update or create user record
    if (existingUser) {
      await ctx.db.patch(existingUser._id, userRecordWithType);
      return { userId: existingUser._id };
    } else {
      const newUserId = await ctx.db.insert('users', {
        id: args.userId,
        ...userRecordWithType,
        createdAt: Date.now(),
      });
      return { userId: newUserId };
    }
  },
});

// Update a user's type directly
export const updateUserType = mutation({
  args: {
    userId: v.string(),
    type: v.union(
      v.literal('free'),
      v.literal('client'),
      v.literal('partner'),
      v.literal('super_admin'),
    ),
  },
  handler: async (ctx, args) => {
    // Find the user by Builder ID
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_builder_id', q => q.eq('id', args.userId))
      .first();

    if (!existingUser) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // Update the user's type
    await ctx.db.patch(existingUser._id, {
      type: args.type,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      userId: existingUser._id,
      oldType: existingUser.type,
      newType: args.type,
    };
  },
});

// Add the invalidateSession mutation
export const invalidateSession = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the session by token
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_session_token', q => q.eq('sessionToken', args.sessionToken))
      .first();

    if (!session) {
      return { success: false, reason: 'session_not_found' };
    }

    // Mark the session as inactive
    await ctx.db.patch(session._id, {
      isActive: false,
    });

    return { success: true };
  },
});
