import { z } from 'zod';

// Define common string enums
export const UserTypeEnum = z.enum(['free', 'client', 'partner', 'super_admin']);
export type UserType = z.infer<typeof UserTypeEnum>;

export const UserStatusEnum = z.enum(['not-started', 'in-progress', 'completed']);
export type UserStatus = z.infer<typeof UserStatusEnum>;

// User schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  isEnterprise: z.boolean().optional(),
  spaceId: z.string().nullable().optional(),
  spaceName: z.string().nullable().optional(),
  subscription: z.string().nullable().optional(),
  hasParentOrg: z.boolean().optional(),
  role: z.string().optional(),
  type: UserTypeEnum.optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  isAuthenticated: z.boolean().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Course schema
export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  duration: z.number().optional(),
  videoUrl: z.string().optional(),
  order: z.number(),
});

export type Lesson = z.infer<typeof LessonSchema>;

export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  lessons: z.array(z.string()),
});

export type Module = z.infer<typeof ModuleSchema>;

export const CourseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string().optional(),
  level: z.string(),
  lessons: z.array(LessonSchema),
  modules: z.array(ModuleSchema).optional(),
  published: z.boolean(),
  featured: z.boolean().optional(),
  completionRequirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;

// Progress schema
export const ProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  moduleId: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Progress = z.infer<typeof ProgressSchema>;

// Derived models for UI usage
export const UserProgressSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable().optional(),
  spaceId: z.string(),
  spaceName: z.string(),
  course: z.string(),
  courseName: z.string().optional(),
  completedModules: z.number().optional(),
  totalModules: z.number().optional(),
  progress: z.number(),
  lastActive: z.string(),
  status: z.enum(['not-started', 'in-progress', 'completed']),
  userType: z.enum(['free', 'client', 'partner', 'super_admin']),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;
