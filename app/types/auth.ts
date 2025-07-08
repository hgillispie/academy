import { z } from 'zod';

// Define user types as a union of literals
export const UserTypeEnum = z.enum(['free', 'client', 'partner', 'super_admin']);

export type UserType = z.infer<typeof UserTypeEnum>;

// User schema with Zod validation
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  isAuthenticated: z.boolean(),
  spaceId: z.string().optional(),
  spaceName: z.string().optional(),
  subscription: z.string().nullable().optional(),
  hasParentOrg: z.boolean().optional(),
  role: z.string().optional(),
  type: UserTypeEnum.optional(),
  isEnterprise: z.boolean().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

// Auth response schema
export const AuthResponseSchema = z.object({
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
});

// Export types derived from schemas
export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Auth status type
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
