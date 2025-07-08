import { builder } from '@builder.io/react';

// Initialize Builder with your API key (also done in builder-registry.ts)
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '2fb19aaf0dcf4690970b30a8d97097ea');

/**
 * Fetch all courses from Builder.io
 */
export async function getCourses() {
  return builder.getAll('course', {
    options: {
      enrich: true,
    },
  });
}

/**
 * Fetch a course by ID
 */
export async function getCourseById(courseId: string) {
  return builder
    .get('course', {
      query: {
        id: courseId,
      },
      enrich: true,
    })
    .promise();
}

/**
 * Fetch modules for a course
 */
export async function getCourseModules(courseId: string) {
  interface ModuleValue {
    id: string;
    name: string;
    moduleOrder?: number;
    lessons?: {
      id: string;
      name: string;
      lessonOrder?: number;
      content?: string;
    }[];
  }

  interface CourseModule {
    module: {
      value: ModuleValue;
    };
  }

  const course = await getCourseById(courseId);
  return course?.data?.courseModules?.map((item: CourseModule) => item.module?.value) || [];
}

/**
 * Fetch quiz questions by their IDs
 */
export async function getQuizQuestions(questionIds: string[]) {
  if (!questionIds?.length) return [];

  return Promise.all(
    questionIds.map(id =>
      builder
        .get('quizz-question', {
          query: { id },
          enrich: true,
        })
        .promise(),
    ),
  );
}

/**
 * Gets Builder.io credentials from cookies
 * @returns Object containing apiKey and userId
 */
export function getBuilderCredentials(): { apiKey: string | null; userId: string | null } {
  if (typeof document === 'undefined') {
    return { apiKey: null, userId: null };
  }

  const cookies = document.cookie.split(';').map(cookie => cookie.trim());

  const apiKeyCookie = cookies.find(cookie => cookie.startsWith('builder.apiKey='));
  const userIdCookie = cookies.find(cookie => cookie.startsWith('builder.userId='));

  return {
    apiKey: apiKeyCookie ? apiKeyCookie.split('=')[1] : null,
    userId: userIdCookie ? userIdCookie.split('=')[1] : null,
  };
}
