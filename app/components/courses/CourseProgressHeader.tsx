'use client';

import { useProgress } from '@/lib/services/progress-convex';
import { ProgressBar } from '../common/ProgressBar';
import { CheckCircle, Award, BookOpen } from 'lucide-react';
import { useAuthContext } from '@/providers/AuthProvider';

interface CourseProgressHeaderProps {
  courseId: string;
  totalModules: number;
}

export function CourseProgressHeader({ courseId, totalModules }: CourseProgressHeaderProps) {
  const { user } = useAuthContext();
  const progress = useProgress(courseId);

  // If no progress data yet, return minimal UI
  if (!progress) {
    return (
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-medium">Your Progress</h2>
          </div>
          <span className="text-sm text-gray-500">Just started</span>
        </div>
        <ProgressBar progress={0} height="h-2" className="mt-3" />
      </div>
    );
  }

  // Safety check: verify the progress belongs to the authenticated user
  if (progress.userId && user?.id && progress.userId !== user.id) {
    // If there's a mismatch, show the empty state
    return (
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-medium">Your Progress</h2>
          </div>
          <span className="text-sm text-gray-500">Loading progress...</span>
        </div>
        <ProgressBar progress={0} height="h-2" className="mt-3" />
      </div>
    );
  }

  const { completedLessons = [] } = progress;
  const completedModules = completedLessons.length;

  // Calculate completion percentage directly
  const calculatedPercentage =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const isCompleted = calculatedPercentage === 100;

  return (
    <div className={`mb-8 p-4 ${isCompleted ? 'bg-green-50' : 'bg-purple-50'} rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {isCompleted ? (
            <Award className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
          )}
          <h2 className="text-lg font-medium">
            {isCompleted ? 'Course Completed!' : 'Your Progress'}
          </h2>
        </div>
        <div className="flex items-center">
          {completedModules > 0 && (
            <span className="text-sm text-gray-600 mr-2">
              {completedModules} of {totalModules} modules completed
            </span>
          )}
          <span className="text-sm font-medium text-purple-700">
            {calculatedPercentage}% Complete
          </span>
        </div>
      </div>

      <ProgressBar
        progress={calculatedPercentage}
        height="h-2.5"
        className="mt-1"
        colorClass={isCompleted ? 'bg-green-500' : 'bg-purple-600'}
      />

      {isCompleted && (
        <div className="mt-3 text-center text-sm text-green-600 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Congratulations on completing this course!
        </div>
      )}
    </div>
  );
}
