import { UserType } from './schema';
import { mutation } from './_generated/server';

export type SubscriptionTier =
  | 'free'
  | 'development'
  | 'basic'
  | 'growth'
  | 'enterprise'
  | 'internal'
  | 'partner'
  | 'poc'
  | 'legacy'
  | 'pro';

/**
 * Determines user type based on subscription tier and email
 * @param subscription The user's subscription string (e.g. "cms:v2:enterprise")
 * @param email The user's email address
 * @returns The appropriate type for the user
 */
export function determineUserType(
  subscription: string | null | undefined,
  email: string | null | undefined,
): UserType {
  // Check for Builder.io emails first to ensure they always get super_admin
  if (email?.includes('@builder.io')) {
    return 'super_admin';
  }

  // Then check subscription status
  if (!subscription) {
    return 'free';
  }

  const subscriptionTier = extractSubscriptionTier(subscription);

  if (['free', 'development', 'basic', 'growth', 'poc'].includes(subscriptionTier)) {
    return 'free';
  } else if (['enterprise', 'legacy', 'pro'].includes(subscriptionTier)) {
    return 'client';
  } else if (subscriptionTier === 'partner') {
    return 'partner';
  }

  // Default to free for any unrecognized tier
  return 'free';
}

/**
 * Extracts the subscription tier from a formatted subscription string
 * @param subscription The subscription string (e.g. "cms:v2:enterprise" or "cms:v2:enterprise-internal")
 * @returns The extracted tier (e.g. "enterprise")
 */
export function extractSubscriptionTier(subscription: string): string {
  // Check if subscription contains partner anywhere in the string
  if (subscription.includes('partner')) {
    return 'partner';
  }

  // Handle subscription strings like "cms:v2:enterprise" or "cms:v2:enterprise-internal"
  const parts = subscription.split(':');
  const lastPart = parts[parts.length - 1] || subscription;

  // Handle hyphenated tiers (e.g. "enterprise-internal" -> "enterprise")
  const hyphenatedParts = lastPart.split('-');
  return hyphenatedParts[0] || lastPart;
}

export const updateAllUserTypes = mutation({
  handler: async ctx => {
    const users = await ctx.db.query('users').collect();
    const updatedUsers = [];

    for (const user of users) {
      const newType = determineUserType(user.subscription, user.email);

      if (user.type !== newType) {
        await ctx.db.patch(user._id, { type: newType });
        updatedUsers.push({
          id: user.id,
          email: user.email,
          subscription: user.subscription,
          oldType: user.type,
          newType,
        });
      }
    }

    return {
      updatedCount: updatedUsers.length,
      updatedUsers,
    };
  },
});
