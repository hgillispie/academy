/**
 * NOTE: THIS FILE WAS USED DURING DEVELOPMENT AGAINST HARDCODED JSON DATA
 * IT DOES NOT MATCH THE LATEST VALUES
 */

export interface Instructor {
  name: string;
  avatar?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  type: 'single' | 'multiple';
}

export interface Quiz {
  questions: Question[];
  passingScore: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  docsUrl?: string;
  docsUrls?: string[];
  quiz?: Quiz;
  courseId?: string;
  order: number;
  comingSoon?: boolean;
  passingScore?: number;
  questions?: Question[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  level: 'Builder 101' | 'Intermediate' | 'Advanced';
  modules: CourseModule[];
  prerequisites?: string[];
  duration: string;
  comingSoon?: boolean;
  tags?: ('Dev' | 'Designer' | 'Editor' | 'Contributor' | 'Marketing' | 'Admin')[];
  instructor: {
    name: string;
    avatar?: string;
  };
  nextRecommendedCourses?: {
    id: string;
    title: string;
    description: string;
    image?: string;
  }[];
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  completed: boolean;
  score: number;
  lastAttempt: Date;
}

export interface CourseSection {
  title: string;
  courses: Course[];
}
