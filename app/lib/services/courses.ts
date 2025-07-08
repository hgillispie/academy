import { Course } from '@/types/course';
import { builderPublishPlatformCourses } from '../../data/courses';

/**
 * Fetches a course by ID from local data
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const course = builderPublishPlatformCourses.find(c => c.id === courseId);
    return course || null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

/**
 * Fetches all available courses
 */
export async function getAllCourses(): Promise<Course[]> {
  return builderPublishPlatformCourses;
}

/**
 * Get recommended courses based on a completed course
 */
export async function getRecommendedCourses(courseId: string): Promise<Course[]> {
  try {
    // Get the current course
    const course = await getCourse(courseId);

    if (course?.nextRecommendedCourses?.length) {
      // If the course has explicit recommendations, use those
      const recommendedCourseIds = course.nextRecommendedCourses.map(c => c.id);
      return builderPublishPlatformCourses.filter(c => recommendedCourseIds.includes(c.id));
    }

    // If no explicit recommendations, get courses with similar tags
    if (course?.tags?.length) {
      return builderPublishPlatformCourses
        .filter(c => c.id !== courseId && c.tags?.some(tag => course.tags?.includes(tag)))
        .slice(0, 3);
    }

    // Last resort: just return other courses
    return builderPublishPlatformCourses.filter(c => c.id !== courseId).slice(0, 3);
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    return [];
  }
}
