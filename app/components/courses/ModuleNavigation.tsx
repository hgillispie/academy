import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BuilderModel, Course } from '@/types/builder';

interface ModuleNavigationProps {
  courseId: string;
  moduleId: string;
  course: BuilderModel<Course>;
}

export function ModuleNavigation({ courseId, moduleId, course }: ModuleNavigationProps) {
  // Sort modules by order
  const sortedModules = [...(course.data?.courseModules || [])].sort((a, b) => {
    const orderA = a.module?.value?.data?.order || 0;
    const orderB = b.module?.value?.data?.order || 0;
    return orderA - orderB;
  });

  // Find current module index
  const currentIndex = sortedModules.findIndex(item => item.module?.id === moduleId);

  // Get previous and next modules
  const prevModule = currentIndex > 0 ? sortedModules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < sortedModules.length - 1 ? sortedModules[currentIndex + 1] : null;

  return (
    <div className="flex justify-between items-center mt-8 border-t pt-6">
      <div>
        {prevModule && !prevModule.module?.value?.data?.comingSoon && (
          <Link
            href={`/courses/${courseId}/modules/${prevModule.module?.id}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">Previous: {prevModule.module?.value?.data?.title}</span>
          </Link>
        )}
      </div>
      <div>
        {nextModule && !nextModule.module?.value?.data?.comingSoon && (
          <Link
            href={`/courses/${courseId}/modules/${nextModule.module?.id}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <span className="text-sm">Next: {nextModule.module?.value?.data?.title}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
}
