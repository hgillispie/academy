import { builder } from '@builder.io/sdk';
import Link from 'next/link';
import { ModuleContent } from '@/components/courses/ModuleContent';
import { Suspense } from 'react';
import { Spinner } from '@/components/common/Spinner';
import { getModule, getCourseById } from '@/lib/builder-sdk';
import { ModuleNavigation } from '@/components/courses/ModuleNavigation';

// Define correct props type for this page
type ModulePageProps = {
  params: Promise<{
    courseId: string;
    moduleId: string;
  }>;
};

export const revalidate = 500;

export const dynamic = 'force-dynamic';
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '');
// Server component - can use async/await directly
export default async function ModulePage({ params }: ModulePageProps) {
  // Await the params Promise before accessing properties
  const resolvedParams = await params;
  const { courseId, moduleId } = resolvedParams;

  // Fetch both module and course data
  let initialModuleContent;
  let course;

  try {
    // Fetch module content
    const content = await getModule(moduleId);
    if (content) {
      initialModuleContent = content;
    }
    // Fetch course data for navigation
    course = await getCourseById(courseId);
  } catch (error) {
    console.error('Error pre-fetching content:', error);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href={`/courses/${courseId}`} className="text-sm text-gray-500 mb-6 inline-block">
        ← Back to course
      </Link>

      {/* Client component with all the interactive logic */}
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        }
      >
        <ModuleContent
          courseId={courseId}
          moduleId={moduleId}
          initialModuleContent={initialModuleContent}
        />
      </Suspense>

      {/* Add module navigation */}
      {course && <ModuleNavigation courseId={courseId} moduleId={moduleId} course={course} />}
    </div>
  );
}
