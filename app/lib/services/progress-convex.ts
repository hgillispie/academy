'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuthContext } from '@/providers/AuthProvider';
export interface Progress {
  courseId: string;
  userId?: string;
  completionPercentage: number;
  moduleProgress: {
    moduleId: string;
    title: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
  }[];
  completedLessons: string[];
  lastAccessedAt: Date;
}

export function useProgress(courseId: string) {
  const { user } = useAuthContext();
  const builderUserId = user?.id;

  // Only query for progress if we have an authenticated user
  // Use "skip" instead of null to properly type the query arguments
  const progress = useQuery(
    api.progress.getCourseProgress,
    builderUserId ? { courseId, builderUserId } : 'skip',
  );

  if (!builderUserId) {
    return {
      courseId,
      userId: 'guest-user-id',
      completionPercentage: 0,
      moduleProgress: [],
      completedLessons: [],
      lastAccessedAt: new Date(),
    } as Progress;
  }

  if (progress === undefined) {
    return {
      courseId,
      userId: builderUserId,
      completionPercentage: 0,
      moduleProgress: [],
      completedLessons: [],
      lastAccessedAt: new Date(),
    } as Progress;
  }

  // CRITICAL: Ensure the progress data belongs to the current user
  // This is a safety check to prevent data leakage between users
  if (progress.userId && progress.userId !== builderUserId) {
    return {
      courseId,
      userId: builderUserId,
      completionPercentage: 0,
      moduleProgress: [],
      completedLessons: [],
      lastAccessedAt: new Date(),
    } as Progress;
  }

  const userProgress = {
    ...progress,
    lastAccessedAt: new Date(progress.lastAccessedAt),
  } as Progress;

  return userProgress;
}

export function useUpdateProgress() {
  const saveMutation = useMutation(api.progress.saveCourseProgress);
  const { user } = useAuthContext();

  return async (courseId: string, moduleId: string, completed: boolean) => {
    if (!user?.id) {
      return false;
    }

    try {
      await saveMutation({
        courseId,
        moduleId,
        completed,
        builderUserId: user.id,
      });
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };
}
