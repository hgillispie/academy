/** Builder Reference Type - used for references between models
 * Typically used in conjuction with BuilderModel,
 * like `Reference<BuilderModel<Course>>`
 */
export interface Reference<T> {
  id: string;
  model: string;
  /** Value will exist only if the content is enriched */
  value?: T;
}

// Generic type for any Builder model.
export interface BuilderModel<T> {
  id: string;
  name?: string;
  data: T;
}

/*
from @builder.io/sdk/dist/src/types/content.d.ts:

export interface BuilderContentVariation {
    data?: {
        blocks?: BuilderElement[];
        inputs?: Input[];
        state?: {
            [key: string]: any;
        };
        [key: string]: any;
    };
    name?: string;
    testRatio?: number;
    id?: string;
}
export interface BuilderContent extends BuilderContentVariation {
    '@version'?: number;
    id?: string;
    name?: string;
    published?: 'published' | 'draft' | 'archived';
    modelId?: string;
    priority?: number;
    firstPublished?: number;
    lastUpdated?: number;
    startDate?: number;
    endDate?: number;
    variations?: {
        [id: string]: BuilderContentVariation | undefined;
    };
    testVariationId?: string;
    testVariationName?: string;
}
*/

// Course Type
export interface Course {
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  comingSoon?: boolean;
  tags?: string[];
  courseId?: string;
  instructor?: Reference<BuilderModel<Instructor>>;
  courseModules: {
    module: Reference<BuilderModel<Module>>;
  }[];
}

// Module Type
export interface Module {
  title: string;
  description?: string;
  video?: string;
  videoAspectRatio?: number;
  docs?: DocumentItem[];
  order: number;
  quizQuestions: Question[];
  comingSoon?: boolean;
  passingScore?: number;
}

export interface Question {
  question: string;
  answers: { answer: string; isCorrect: boolean }[];
  isMultipleChoice?: boolean;
}

export const DOCTYPES = ['article', 'reference', 'tutorial', 'api'] as const;
export type DocumentItem = {
  url: string;
  //depreciated, but legacy
  doc: string;
  linkText?: string;
  description?: string;
  docType?: (typeof DOCTYPES)[number];
};

// Instructor Type
export interface Instructor {
  name: string;
  title?: string;
  bio?: string;
  /** Avatar Image URL */
  avatar?: string;
}
