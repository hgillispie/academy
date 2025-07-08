import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Query to check user authentication status
export const getUserStatus = query({
  args: {
    builderUserId: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    // If we have a Builder.io user ID, use that
    if (args.builderUserId) {
      return {
        authenticated: true,
        userId: args.builderUserId,
        source: 'builder.io',
      };
    }

    // Fall back to guest mode
    return {
      authenticated: true,
      userId: 'guest-user-id',
      source: 'guest',
    };
  },
});

// Query to get course progress for a user
export const getCourseProgress = query({
  args: {
    courseId: v.string(),
    builderUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // CRITICAL: Ensure we have a valid user ID before attempting to fetch progress
    if (!args.builderUserId) {
      // Return empty progress data for proper initialization
      return {
        courseId: args.courseId,
        userId: 'guest-user-id',
        completionPercentage: 0,
        moduleProgress: [],
        completedLessons: [],
        lastAccessedAt: new Date().toISOString(),
      };
    }

    const userId = args.builderUserId;

    // Get all progress records STRICTLY for this specific user and course
    // Using both userId AND courseId in the filter to ensure data isolation
    const progressRecords = await ctx.db
      .query('courseProgress')
      .withIndex('by_user_course', q => q.eq('userId', userId).eq('courseId', args.courseId))
      .collect();

    // VERIFICATION: Double-check that all returned records belong to the requesting user
    const validRecords = progressRecords.filter(record => record.userId === userId);

    // Get course data
    const course = await ctx.db
      .query('courses')
      .filter(q => q.eq(q.field('_id'), args.courseId))
      .first();

    // Default to empty modules if none are found
    const courseModules = course?.modules || [];

    // We're tracking at module level - each moduleId field
    // is considered a completed module
    const completedModuleIds = validRecords
      .filter(record => record.completed)
      .map(record => record.moduleId);

    // Calculate total number of modules
    const totalModules = courseModules.length;

    // Calculate completion percentage based on completed modules
    const completionPercentage =
      totalModules > 0 ? Math.round((completedModuleIds.length / totalModules) * 100) : 0;

    // Create module progress data - track per module
    const moduleProgress = courseModules.map(module => {
      // Check if this module is completed
      const isModuleCompleted = completedModuleIds.includes(module.id);

      return {
        moduleId: module.id,
        title: module.title,
        totalLessons: 1, // Each module counts as 1 unit
        completedLessons: isModuleCompleted ? 1 : 0,
        progress: isModuleCompleted ? 100 : 0, // Module is either 100% complete or 0%
      };
    });

    return {
      courseId: args.courseId,
      userId,
      completionPercentage,
      moduleProgress,
      completedLessons: completedModuleIds,
      lastAccessedAt: new Date().toISOString(),
    };
  },
});

// Save course progress for a user
export const saveCourseProgress = mutation({
  args: {
    courseId: v.string(),
    moduleId: v.string(), // Only use moduleId, no backward compatibility needed
    completed: v.boolean(),
    builderUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // If no builder user ID is provided, we shouldn't save progress
    if (!args.builderUserId) {
      return { success: false, reason: 'No user ID provided' };
    }

    const userId = args.builderUserId;

    // Look for existing progress record
    const existingProgress = await ctx.db
      .query('courseProgress')
      .withIndex('by_user_course', q => q.eq('userId', userId).eq('courseId', args.courseId))
      .filter(q => q.eq(q.field('moduleId'), args.moduleId))
      .unique();

    if (existingProgress) {
      // Verify the record belongs to the current user
      if (existingProgress.userId !== userId) {
        return { success: false, reason: 'Record belongs to another user' };
      }

      // Update existing record
      await ctx.db.patch(existingProgress._id, {
        completed: args.completed,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, id: existingProgress._id };
    } else {
      // Create new record
      const id = await ctx.db.insert('courseProgress', {
        userId,
        courseId: args.courseId,
        moduleId: args.moduleId,
        completed: args.completed,
        source: 'builder.io', // Since we only save for authenticated users now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { success: true, id };
    }
  },
});
