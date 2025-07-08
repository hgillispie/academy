import { action } from './_generated/server';
import { v } from 'convex/values';

// Builder.io API endpoint and key
const BUILDER_API_ENDPOINT = 'https://cdn.builder.io/api/v3/content';
const BUILDER_API_KEY = process.env.BUILDER_API_KEY;

// Fetch course data from Builder.io
export const getCourseData = action({
  args: {
    courseId: v.string(),
  },
  handler: async (_, args) => {
    try {
      // First try to fetch by ID
      const url = `${BUILDER_API_ENDPOINT}/course/${args.courseId}?apiKey=${BUILDER_API_KEY}&includeRefs=true`;
      const response = await fetch(url);

      if (!response.ok) {
        // If not found by ID, try to fetch by courseId field
        const queryUrl = `${BUILDER_API_ENDPOINT}/course?apiKey=${BUILDER_API_KEY}&query.data.courseId=${args.courseId}&includeRefs=true`;
        const queryResponse = await fetch(queryUrl);

        if (!queryResponse.ok) {
          return { success: false, error: 'Course not found' };
        }

        const data = await queryResponse.json();
        if (data.results && data.results.length > 0) {
          const course = data.results[0];
          const moduleCount = course.data?.courseModules?.length || 0;

          return {
            success: true,
            course: {
              ...course,
              moduleCount,
            },
          };
        }

        return { success: false, error: 'Course not found' };
      }

      const data = await response.json();
      const moduleCount = data.data?.courseModules?.length || 0;

      return {
        success: true,
        course: {
          ...data,
          moduleCount,
        },
      };
    } catch (error) {
      console.error('Error fetching course from Builder.io:', error);
      return { success: false, error: 'Failed to fetch course data' };
    }
  },
});

// Fetch all courses from Builder.io with module counts
export const getAllCourses = action({
  args: {},
  handler: async () => {
    try {
      const url = `${BUILDER_API_ENDPOINT}/course?apiKey=${BUILDER_API_KEY}&includeRefs=true`;
      const response = await fetch(url);

      if (!response.ok) {
        return { success: false, error: 'Failed to fetch courses' };
      }

      const data = await response.json();

      // Process each course to extract name and module count
      const processedCourses = (data.results || []).map((course: any) => {
        const moduleCount = course.data?.courseModules?.length || 0;
        return {
          id: course.id,
          name: course.data?.title || course.name,
          courseId: course.data?.courseId,
          level: course.data?.level,
          moduleCount,
          ...course,
        };
      });

      return {
        success: true,
        courses: processedCourses,
      };
    } catch (error) {
      console.error('Error fetching courses from Builder.io:', error);
      return { success: false, error: 'Failed to fetch courses' };
    }
  },
});
