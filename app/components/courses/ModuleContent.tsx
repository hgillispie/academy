'use client';

import { builder } from '@builder.io/sdk';
import { BuilderContent, useIsPreviewing } from '@builder.io/react';
import Link from 'next/link';
import { AutoDocumentationSection } from '@/components/courses/DocumentationCard';
import QuizSection from '@/components/courses/Quiz';
import { useEffect, useState, useCallback } from 'react';
import { getCourseById } from '@/lib/builder-sdk';
import VideoEmbed from '@/components/courses/VideoEmbed';
import { Spinner } from '@/components/common/Spinner';
import { RenderBuilderContent } from '@/components/builder';
import Section from '../common/Section';
import { BuilderModel, Module } from '@/types/builder';
import { useUpdateProgress } from '@/lib/services/progress-convex';
import { useAnalytics } from '@/providers/analytics';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '');

interface ModuleContentProps {
  courseId: string;
  moduleId: string;
  initialModuleContent?: BuilderModel<Module>; // Optional server-fetched content
}

export function ModuleContent({ courseId, moduleId, initialModuleContent }: ModuleContentProps) {
  const [moduleContent, setModuleContent] = useState(initialModuleContent);
  const [loading, setLoading] = useState(!initialModuleContent);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [moduleMarkedAsViewed, setModuleMarkedAsViewed] = useState(false);
  const { trackEvent } = useAnalytics();

  const isPreviewing = useIsPreviewing();
  const updateProgress = useUpdateProgress();

  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY || '';

  useEffect(() => {
    // Skip fetching if we already have content from the server
    if (initialModuleContent) {
      return;
    }

    // Fetch the module directly
    builder
      .get('course-module', {
        query: { id: moduleId },
        options: { enrich: true },
      })
      .toPromise()
      .then(content => {
        if (content) {
          setModuleContent(content);
          setLoading(false);
        } else {
          return fetchViaParentCourse();
        }
      })
      .catch(error => {
        console.error('Error loading module:', error);
        return fetchViaParentCourse();
      });

    // Fallback to course-based fetching
    async function fetchViaParentCourse() {
      try {
        const course = await getCourseById(courseId);
        if (!course) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        const moduleItem = course.data?.courseModules?.find(item => item.module?.id === moduleId);

        if (!moduleItem) {
          setError('Module not found in course');
          setLoading(false);
          return;
        }

        setModuleContent(moduleItem.module?.value);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error fetching via course:', fetchError);
        setError('Failed to load module content');
        setLoading(false);
      }
    }
  }, [courseId, moduleId, apiKey, initialModuleContent]);

  // Function to mark a module as completed
  const markModuleAsCompleted = useCallback(async () => {
    if (!moduleMarkedAsViewed) {
      setModuleMarkedAsViewed(true);
      try {
        await updateProgress(courseId, moduleId, true);
        console.log(`Module ${moduleId} marked as viewed/completed`);
      } catch (error) {
        console.error('Failed to update module progress:', error);
      }
    }
  }, [courseId, moduleId, moduleMarkedAsViewed, setModuleMarkedAsViewed, updateProgress]);

  // Mark module as viewed after specific time (30 seconds)
  useEffect(() => {
    if (loading || isPreviewing || moduleMarkedAsViewed || !moduleContent) {
      return;
    }

    const hasQuiz =
      moduleContent.data?.quizQuestions && moduleContent.data.quizQuestions.length > 0;

    // If module has no quiz, start a timer to mark it as completed
    // For modules with quizzes, completion happens after quiz submission
    if (!hasQuiz) {
      const timer = setTimeout(() => {
        markModuleAsCompleted();
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [loading, moduleContent, isPreviewing, moduleMarkedAsViewed, markModuleAsCompleted]);

  // Handle quiz completion
  const handleQuizComplete = async (score: number, passed: boolean) => {
    trackEvent('quiz completed', {
      courseId,
      moduleId,
      score,
      passed,
      isReview: quizCompleted,
    });
    if (passed && !quizCompleted) {
      setQuizCompleted(true);
      try {
        // Mark this module as completed
        // Module tracking is now done properly with moduleId
        await updateProgress(courseId, moduleId, true);
        // console.log(`Module ${moduleId} marked as completed`);
      } catch (error) {
        console.error('Failed to update module progress:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isPreviewing && (error || !moduleContent)) {
    trackEvent('module load error', {
      courseId,
      moduleId,
    });
    return (
      <div>
        <h1 className="text-2xl font-medium mb-4">Error loading module</h1>
        <p>{error || 'Module content not available'}</p>
        <Link href={`/courses/${courseId}`} className="text-purple-600 mt-4 inline-block">
          Back to course
        </Link>
      </div>
    );
  }

  // Now use BuilderContent for live updates
  return (
    <>
      <BuilderContent model="course-module" content={moduleContent} key={apiKey}>
        {(data: Module) => {
          const videoStyle = {
            aspectRatio: data?.videoAspectRatio ?? 16 / 9,
          };
          return (
            <>
              <h1 className="text-2xl font-medium mb-4">{data?.title}</h1>
              <p className="mb-8 text-gray-600">{data?.description}</p>

              {/* Video section with our custom component */}
              {data?.video && (
                <Section title="Video">
                  <div className="bg-gray-100 rounded-lg overflow-hidden" style={videoStyle}>
                    <VideoEmbed url={data.video} />
                  </div>
                </Section>
              )}

              {/* Custom Content Section - using BuilderComponent for real-time editing */}
              <RenderBuilderContent
                model="course-module"
                content={moduleContent}
                options={{
                  enrich: true,
                  includeRefs: true,
                }}
              />
              {/* Documentation section - remove duplicate heading */}
              {(data?.docs?.length ?? 0) > 0 && (
                <Section title="Documentation">
                  <AutoDocumentationSection docs={data.docs ?? []} />
                </Section>
              )}

              {/* Quiz section - remove duplicate heading */}
              {data?.quizQuestions?.length > 0 && (
                <Section title="Quiz">
                  <QuizSection module={data} moduleId={moduleId} onComplete={handleQuizComplete} />
                </Section>
              )}

              {/* Mark as completed button for modules without quizzes */}
              {!data?.quizQuestions?.length && !moduleMarkedAsViewed && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={markModuleAsCompleted}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}

              {/* Success message when module is marked as completed */}
              {moduleMarkedAsViewed && !quizCompleted && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700 font-medium">
                    Module completed! You can continue to the next module.
                  </p>
                </div>
              )}
            </>
          );
        }}
      </BuilderContent>
    </>
  );
}
