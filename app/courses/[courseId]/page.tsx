import { getCourseById } from '@/lib/builder-sdk';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseModules } from '@/components/courses/CourseModules';
import { CourseProgressHeader } from '@/components/courses/CourseProgressHeader';
import { Suspense } from 'react';
import { Spinner } from '@/components/common/Spinner';
import Link from 'next/link';

// Define correct props type for this page
type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export const revalidate = 500;

// Keep the async function
export default async function CoursePage({ params }: CoursePageProps) {
  // Await the params Promise before accessing properties
  const resolvedParams = await params;
  const { courseId } = resolvedParams;

  // Wrap the data fetching in try/catch
  try {
    const course = await getCourseById(courseId);

    if (!course) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-medium mb-4">Course not found</h1>
          <p>The course you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>
      );
    }

    // Get course data with proper null checks
    const courseData = course.data || {};
    const { title, description, level, instructor, courseModules = [] } = courseData;
    const totalModules = courseModules.length;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb navigation */}
        <nav className="mb-6">
          <Link href="/courses" className="text-sm text-gray-500 mb-6 inline-block">
            ← Back to all courses
          </Link>
        </nav>

        <CourseHeader
          title={title}
          description={description}
          level={level}
          instructor={instructor?.value?.data}
        />

        {/* Course Progress Overview */}
        <Suspense fallback={null}>
          <CourseProgressHeader courseId={courseId} totalModules={totalModules} />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          }
        >
          <CourseModules courseId={courseId} modules={courseModules} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading course:', error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-4">Error loading course</h1>
        <p>There was a problem loading this course. Please try again later.</p>
      </div>
    );
  }
}
