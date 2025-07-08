import { Builder } from '@builder.io/sdk';
import { BuilderModel, Course, Module } from '@/types/builder';

// Initialize Builder with your API key
const builder = new Builder(
  process.env.NEXT_PUBLIC_BUILDER_API_KEY || '2fb19aaf0dcf4690970b30a8d97097ea',
);

/**
 * Fetch all courses from Builder.io
 */
export async function getCourses(): Promise<BuilderModel<Course>[]> {
  try {
    // Use Builder SDK instead of React for server components
    const courses = await builder.getAll('course', {
      options: {
        enrich: true,
      },
    });

    return courses as BuilderModel<Course>[]; // Type assertion
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

/**
 * Fetch a course by ID - Check both ID and courseId fields
 */
export async function getCourseById(courseId: string): Promise<BuilderModel<Course> | null> {
  try {
    // First try to fetch by ID
    let course = await builder
      .get('course', {
        query: {
          id: courseId,
        },
        options: {
          enrich: true,
        },
      })
      .promise();

    // If not found, try to fetch by courseId in data
    if (!course) {
      course = await builder
        .get('course', {
          query: {
            'data.courseId': courseId,
          },
          options: {
            enrich: true,
          },
        })
        .promise();
    }

    return course;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    return null;
  }
}

/**
 * Fetch modules for a course
 */
export async function getCourseModules(courseId: string) {
  try {
    const course = await getCourseById(courseId);

    return course?.data?.courseModules?.map(item => item.module.value) ?? [];
  } catch (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error);
    return [];
  }
}

export async function getModule(moduleId: string) {
  try {
    return (await builder
      .get('course-module', {
        query: { id: moduleId },
        options: { enrich: true },
      })
      .toPromise()) as BuilderModel<Module>;
  } catch (error) {
    console.error(`Error fetching module: ${moduleId}:`, error);
    return null;
  }
}

/**
 * Fetch only available courses (not coming soon)
 */
export async function getAvailableCourses(): Promise<BuilderModel<Course>[]> {
  try {
    const courses = await builder.getAll('course', {
      query: {
        // Get courses where comingSoon is not true
        'data.comingSoon': { $ne: true },
      },
      options: {
        enrich: true,
      },
    });

    return courses as BuilderModel<Course>[]; // Type assertion
  } catch (error) {
    console.error('Error fetching available courses:', error);
    return [];
  }
}
