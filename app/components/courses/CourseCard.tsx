import Link from 'next/link';
import { BuilderModel, Course } from '@/types/builder';
import { useAuthContext } from '@/providers/AuthProvider';
import { LockIcon, LogInIcon } from 'lucide-react';
import { Button } from '../common/Button';

interface CourseCardProps {
  course: BuilderModel<Course>;
}

export function CourseCard({ course }: CourseCardProps) {
  const { user, isAuthenticated } = useAuthContext();
  const isFreeUser = user?.type === 'free';
  const { id, data } = course;

  // Early return if no data
  if (!data) return null;

  const { title, description, level, duration, comingSoon, tags, instructor } = data;

  // Use courseId from data or fallback to id from Builder
  const linkPath = `/courses/${data.courseId || id}`;

  return (
    <div
      className={`border ${!isAuthenticated || isFreeUser ? 'border-gray-300' : 'border-gray-200'} rounded-lg overflow-hidden flex flex-col h-full relative`}
    >
      {/* Lock overlay for free users or non-authenticated users */}
      {isFreeUser && (
        <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 p-1 rounded-full z-10">
          <LockIcon size={16} />
        </div>
      )}

      {!isAuthenticated && (
        <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 p-1 rounded-full z-10">
          <LogInIcon size={16} />
        </div>
      )}

      <div className="p-6 flex-grow">
        {/* Badge for level/category */}
        <div className="mb-3">
          <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            {level || 'Builder 101'}
          </span>
        </div>

        <h3 className="text-xl font-medium mb-2">{title}</h3>

        <p className="text-gray-600 mb-4">{description}</p>

        {/* Course metadata */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{duration || '20 minutes'}</span>
          {instructor?.value && (
            <>
              <span className="mx-2">•</span>
              <span>{instructor.value?.data?.name}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map(tag => (
              <span
                key={tag}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  tag === 'Dev'
                    ? 'bg-blue-200 text-blue-800'
                    : tag === 'Designer'
                      ? 'bg-purple-200 text-purple-800'
                      : tag === 'Editor'
                        ? 'bg-green-200 text-green-800'
                        : tag === 'Contributor'
                          ? 'bg-orange-200 text-orange-800'
                          : tag === 'Admin'
                            ? 'bg-red-200 text-red-800'
                            : tag === 'Marketing'
                              ? 'bg-pink-200 text-pink-800'
                              : 'bg-gray-200 text-gray-800'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action button at the bottom */}
      <div className="px-6 pb-6 mt-auto">
        {comingSoon ? (
          <button
            disabled
            className="text-sm text-gray-400 bg-gray-50 px-3 py-2 rounded inline-block cursor-not-allowed"
          >
            Coming Soon
          </button>
        ) : !isAuthenticated ? (
          <Link
            href="/auth/signin"
            className="bg-blue-100 text-blue-700 py-2 px-4 rounded-full block text-center hover:bg-blue-200 transition-colors"
          >
            Sign in to Access
          </Link>
        ) : isFreeUser ? (
          <a
            href="https://www.builder.io/m/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-full block text-center hover:bg-gray-200 transition-colors"
          >
            Upgrade to Access
          </a>
        ) : (
          <Link href={linkPath} legacyBehavior passHref>
            <a className="block text-center">
              <Button className="py-2 px-4 w-full">Start Course</Button>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
