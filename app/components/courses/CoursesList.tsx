'use client';

import { useState } from 'react';
import { CourseCard } from './CourseCard';
import { BuilderModel, Course } from '@/types/builder';
import { useAuthContext } from '@/providers/AuthProvider';
import Link from 'next/link';
import { Button } from '../common/Button';

interface CoursesListProps {
  coursesByCategory: Record<string, BuilderModel<Course>[]>;
}

export function CoursesList({ coursesByCategory }: CoursesListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthContext();

  // Check if user is a free user
  const isFreeUser = user?.type === 'free';

  // Get all unique tags from all courses
  const allTags = Array.from(
    new Set(
      Object.values(coursesByCategory)
        .flat()
        .flatMap(course => course.data?.tags || []),
    ),
  );

  // Filter courses by selected tag
  const filteredCoursesByCategory: typeof coursesByCategory = {};

  if (selectedTag) {
    Object.entries(coursesByCategory).forEach(([category, courses]) => {
      const filtered = courses.filter(course => course.data?.tags?.includes(selectedTag));

      if (filtered.length > 0) {
        filteredCoursesByCategory[category] = filtered;
      }
    });
  }

  const displayedCourses = selectedTag ? filteredCoursesByCategory : coursesByCategory;

  return (
    <>
      {/* Access restriction banner for non-logged in users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Sign in to access Builder Academy courses.
                <Link
                  href="/auth/signin"
                  className="font-medium underline text-blue-700 hover:text-blue-600 ml-1"
                >
                  Sign in with Builder.io
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Access restriction banner for free users */}
      {isAuthenticated && isFreeUser && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your free account doesn&apos;t have access to course content.
                <a
                  href="https://www.builder.io/m/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1"
                >
                  Upgrade your account
                </a>{' '}
                to get access to all courses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => setSelectedTag(null)}
              className={`text-sm ${selectedTag !== null ? 'bg-gray-100 hover:bg-gray-200 text-black' : ''}`}
            >
              All
            </Button>

            {allTags.map(tag => (
              <Button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-sm ${selectedTag !== tag ? 'bg-gray-100 hover:bg-gray-200 text-black' : ''}`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Display courses by category */}
      {Object.entries(displayedCourses).length > 0 ? (
        Object.entries(displayedCourses).map(([category, courses]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-medium mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                return <CourseCard key={course.id} course={course} />;
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses match the selected filter.</p>
        </div>
      )}
    </>
  );
}
