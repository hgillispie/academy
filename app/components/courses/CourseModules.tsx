'use client';

import Link from 'next/link';
import { Course } from '@/types/builder';
import { useProgress } from '@/lib/services/progress-convex';
import { ProgressBar } from '../common/ProgressBar';
import { CheckCircle } from 'lucide-react';
import { useAuthContext } from '@/providers/AuthProvider';

interface CourseModulesProps {
  courseId: string;
  modules: NonNullable<Course['courseModules']>;
}

export function CourseModules({ courseId, modules }: CourseModulesProps) {
  // Fetch progress data for this course
  const { user } = useAuthContext();
  const progress = useProgress(courseId);

  if (!modules.length) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No modules available for this course yet.</p>
      </div>
    );
  }

  // Sort modules by order if available
  const sortedModules = [...modules].sort((a, b) => {
    const orderA = a.module?.value?.data?.order || 0;
    const orderB = b.module?.value?.data?.order || 0;
    return orderA - orderB;
  });

  // Safety check: only use progress if it belongs to the current user
  let completedModuleIds: string[] = [];
  if (!progress?.userId || !user?.id || progress.userId === user.id) {
    completedModuleIds = progress?.completedLessons || [];
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Course Content</h2>

      <div className="border rounded-lg divide-y">
        {sortedModules.map((moduleItem, index) => {
          const moduleData = moduleItem.module?.value?.data;
          if (!moduleData) return null;

          const { title, description, comingSoon } = moduleData;
          const moduleId = moduleItem.module.id;

          // Check if this module is completed
          const isModuleCompleted = completedModuleIds.includes(moduleId);
          const progressPercentage = isModuleCompleted ? 100 : 0;

          return (
            <div key={moduleItem.module.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Module {index + 1}: {title}
                    </h3>
                    {isModuleCompleted && (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{description}</p>
                </div>

                {/* TODO: Check login state here */}

                {comingSoon ? (
                  <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/courses/${courseId}/modules/${moduleItem.module.id}`}
                    className="text-sm text-purple-600 bg-purple-50 px-3 py-1.5 rounded hover:bg-purple-100 transition-colors"
                  >
                    {isModuleCompleted ? 'Review' : 'Start'}
                  </Link>
                )}
              </div>

              {/* Show module progress */}
              <div className="mt-2">
                <ProgressBar
                  progress={progressPercentage}
                  showPercentage={false}
                  height="h-1.5"
                  colorClass={isModuleCompleted ? 'bg-green-500' : 'bg-purple-600'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
