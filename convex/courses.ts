import { mutation, action, query } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

// Builder.io API endpoint and key
const BUILDER_API_ENDPOINT = 'https://cdn.builder.io/api/v3/content';
const BUILDER_API_KEY = process.env.BUILDER_API_KEY;

// Store course data in the database
export const storeCourseData = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    moduleCount: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if course already exists
    const existingCourse = await ctx.db
      .query('courseMeta')
      .withIndex('by_slug', q => q.eq('slug', args.slug))
      .first();

    if (existingCourse) {
      // Update existing course
      return await ctx.db.patch(existingCourse._id, {
        ...args,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new course
      return await ctx.db.insert('courseMeta', args);
    }
  },
});

// Fetch course details and store in the database
export const syncCourseDetails = action({
  args: {},
  handler: async ctx => {
    try {
      // Fetch all courses from Builder.io
      const url = `${BUILDER_API_ENDPOINT}/course?apiKey=${BUILDER_API_KEY}&includeRefs=true`;
      const response = await fetch(url);

      if (!response.ok) {
        return { success: false, error: 'Failed to fetch courses' };
      }

      const data = await response.json();
      const courses = data.results || [];

      // Process and store each course
      const results = await Promise.all(
        courses.map(async (course: any) => {
          // Count modules
          const moduleCount = course.data?.courseModules?.length || 0;

          // Extract core course details
          const courseData = {
            title: course.data?.title || course.name,
            slug: course.data?.courseId || `course-${course.id}`,
            description: course.data?.description || '',
            moduleCount: moduleCount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Store in database using API reference
          const courseId = await ctx.runMutation(api.courses.storeCourseData, courseData);

          return {
            id: courseId,
            title: courseData.title,
            slug: courseData.slug,
            moduleCount: courseData.moduleCount,
          };
        }),
      );

      return {
        success: true,
        message: `Synced ${results.length} courses`,
        courses: results,
      };
    } catch (error) {
      console.error('Error syncing courses:', error);
      return { success: false, error: 'Failed to sync courses' };
    }
  },
});

// Get all courses with module counts
export const getCourses = query({
  args: {},
  handler: async ctx => {
    const courses = await ctx.db.query('courseMeta').collect();

    return courses.map(course => ({
      id: course._id,
      title: course.title,
      slug: course.slug,
      moduleCount: course.moduleCount,
      lastUpdated: course.updatedAt,
    }));
  },
});
