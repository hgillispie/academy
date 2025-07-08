/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from 'convex/server';
import type * as auth from '../auth.js';
import type * as builder from '../builder.js';
import type * as courses from '../courses.js';
import type * as http from '../http.js';
import type * as progress from '../progress.js';
import type * as roles from '../roles.js';
import type * as status from '../status.js';
import type * as users from '../users.js';

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  builder: typeof builder;
  courses: typeof courses;
  http: typeof http;
  progress: typeof progress;
  roles: typeof roles;
  status: typeof status;
  users: typeof users;
}>;
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, 'public'>>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, 'internal'>>;
