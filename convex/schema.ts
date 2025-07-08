import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Define user types (for the type field)
export type UserType = 'free' | 'client' | 'partner' | 'super_admin';

// Define schema without the auth tables
export default defineSchema({
  // Sessions table for storing auth credentials
  sessions: defineTable({
    sessionToken: v.string(),
    // Auth credentials
    privateKey: v.string(),
    apiKey: v.string(),
    userId: v.string(),
    // Metadata
    orgName: v.optional(v.union(v.string(), v.null())),
    kind: v.optional(v.union(v.string(), v.null())),
    // Security tracking
    userAgent: v.optional(v.union(v.string(), v.null())),
    ipAddress: v.optional(v.union(v.string(), v.null())),
    // Timestamps
    createdAt: v.number(),
    expiresAt: v.number(),
    // Status
    isActive: v.boolean(),
  }).index('by_session_token', ['sessionToken']),

  // Status messages table
  status: defineTable({
    message: v.string(),
    timestamp: v.string(),
    user: v.optional(v.string()),
    source: v.optional(v.string()),
  }),

  // Course progress tracking - improved naming and added indexes
  courseProgress: defineTable({
    userId: v.string(),
    courseId: v.string(),
    moduleId: v.string(), // Use only moduleId field
    completed: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
    source: v.optional(v.string()),
  })
    .index('by_user_module', ['userId', 'moduleId'])
    .index('by_user_course', ['userId', 'courseId']),

  // Users table
  users: defineTable({
    // User identifiers
    id: v.string(), // Builder user ID
    // User information
    name: v.string(),
    email: v.optional(v.union(v.string(), v.null())),
    isEnterprise: v.optional(v.boolean()),
    // Space information
    spaceId: v.optional(v.union(v.string(), v.null())),
    spaceName: v.optional(v.union(v.string(), v.null())),
    subscription: v.optional(v.union(v.string(), v.null())),
    hasParentOrg: v.optional(v.boolean()),
    // Role information
    role: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal('free'),
        v.literal('client'),
        v.literal('partner'),
        v.literal('super_admin'),
      ),
    ),
    // Course progress information (supporting multiple courses)
    courses: v.optional(
      v.array(
        v.object({
          courseId: v.string(),
          courseName: v.string(),
          progress: v.number(),
          status: v.union(
            v.literal('not-started'),
            v.literal('in-progress'),
            v.literal('completed'),
          ),
          lastAccessedAt: v.string(),
        }),
      ),
    ),
    // For backward compatibility - represents the current/primary course
    course: v.optional(v.string()),
    progress: v.optional(v.number()),
    status: v.optional(
      v.union(v.literal('not-started'), v.literal('in-progress'), v.literal('completed')),
    ),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    // Auth status
    isAuthenticated: v.optional(v.boolean()),
  }).index('by_builder_id', ['id']),

  // Keep existing tables from your schema
  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    level: v.string(),
    lessons: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        slug: v.string(),
        duration: v.optional(v.number()),
        videoUrl: v.optional(v.string()),
        order: v.number(),
      }),
    ),
    modules: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          description: v.string(),
          order: v.number(),
          lessons: v.array(v.string()),
        }),
      ),
    ),
    published: v.boolean(),
    featured: v.optional(v.boolean()),
    completionRequirements: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_slug', ['slug']),

  // Simple table for course metadata
  courseMeta: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    moduleCount: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_slug', ['slug']),
});
