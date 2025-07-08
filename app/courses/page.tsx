import { getAvailableCourses } from '@/lib/builder-sdk';
import { BuilderModel, Course } from '@/types/builder';
import { CoursesList } from '@/components/courses/CoursesList';

// Server component for data fetching
export default async function CoursesPage() {
  // Fetch only available courses from Builder.io
  const courses = await getAvailableCourses();

  // Filter out courses with undefined IDs
  const validCourses = courses.filter(course => course.id);

  // Group courses by level
  const coursesByCategory = validCourses.reduce(
    (acc, course) => {
      const category = course.data?.level || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(course);
      return acc;
    },
    {} as Record<string, BuilderModel<Course>[]>,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-medium text-center mb-12">Available Courses</h1>

      {/* Display courses without authentication banner */}
      <CoursesList coursesByCategory={coursesByCategory} />
    </div>
  );
}
