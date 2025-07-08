'use client';

import { useQuery as useTanStackQuery } from '@tanstack/react-query';
import { useQuery as useConvexQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEffect, useState } from 'react';

/**
 * A general hook to wrap TanStack Query around data fetching functions
 */
export function useTanStackWrappedQuery<T>(
  queryKey: string[],
  queryFn: () => T | undefined,
  options: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number | false;
  } = {},
) {
  const { enabled = true, staleTime, refetchInterval } = options;

  return useTanStackQuery({
    queryKey,
    // TanStack Query requires that query functions never return undefined
    queryFn: async () => {
      const result = queryFn();
      // Return an empty array if the result is undefined
      return result === undefined ? ([] as unknown as T) : result;
    },
    enabled,
    staleTime,
    refetchInterval,
  });
}

/**
 * Hook for fetching users with TanStack Query
 */
export function useUsers(searchText: string = '', userType: 'all' | 'client' | 'partner' = 'all') {
  // Use our new optimized endpoint that calculates progress on the server
  const convexUsersResult = useConvexQuery(api.users.getUsersWithProgress, {
    searchText,
    userType,
  });

  // Setup a periodic refresh for user data
  useEffect(() => {
    const interval = setInterval(() => {
      // The Convex useQuery hook will handle refreshes automatically
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Return result directly since all calculations are now done server-side
  return {
    data: Array.isArray(convexUsersResult) ? convexUsersResult : [],
    isLoading: convexUsersResult === undefined,
    error: null,
    refetch: () => {}, // Empty function as Convex handles refreshes
  };
}

/**
 * Hook to fetch all courses with their module counts
 */
export function useCourses() {
  interface Course {
    id: string;
    name: string;
    description?: string;
    modules?: number;
    lessons?: number;
    // Add other properties as needed
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the action to fetch courses
  const getAllCourses = useAction(api.builder.getAllCourses);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const result = await getAllCourses();

        if (result.success) {
          setCourses(result.courses);
        } else {
          setError(result.error || 'Unknown error occurred');
        }
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();

    // Refresh course data every 5 minutes
    const interval = setInterval(fetchCourses, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [getAllCourses]);

  return {
    courses,
    isLoading,
    error,
  };
}

/**
 * Hook to check a user's progress in a specific course
 */
export function useUserCourseProgress(userId: string, courseId: string) {
  const progressQuery = useConvexQuery(api.progress.getCourseProgress, {
    courseId,
    builderUserId: userId,
  });

  // Extract and format progress data
  const progress = progressQuery
    ? {
        completionPercentage: progressQuery.completionPercentage || 0,
        moduleProgress: progressQuery.moduleProgress || [],
        completedLessons: progressQuery.completedLessons || [],
        lastAccessedAt: new Date(progressQuery.lastAccessedAt || new Date()),
      }
    : null;

  return {
    progress,
    isLoading: progressQuery === undefined,
    completionPercentage: progress?.completionPercentage || 0,
    completedModules: progress?.completedLessons?.length || 0,
  };
}
