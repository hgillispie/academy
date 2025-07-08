import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Query to check API status and connectivity
export const getStatus = query({
  args: {},
  handler: async ctx => {
    const status = {
      message: 'Convex API is operational',
      timestamp: new Date().toISOString(),
    };

    // Also try to get all status messages from the database
    const messages = await ctx.db.query('status').collect();

    return {
      ...status,
      messagesCount: messages.length,
    };
  },
});

// Mutation to record a status update
export const recordStatus = mutation({
  args: {
    message: v.string(),
    builderUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // If we have a Builder.io user ID, use that
    const userId = args.builderUserId || 'guest-user-id';
    const isBuilderUser = !!args.builderUserId;

    // Record the status
    const id = await ctx.db.insert('status', {
      message: args.message,
      timestamp: new Date().toISOString(),
      user: userId,
      source: isBuilderUser ? 'builder.io' : 'guest',
    });

    return { id };
  },
});
