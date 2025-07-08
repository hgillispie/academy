import { query } from './_generated/server';
import { v } from 'convex/values';

interface CourseProgressData {
  completed: number;
  total: number;
  lastUpdated: Date;
  completedModules: Set<string>;
}

export const listUsers = query({
  args: {
    searchText: v.optional(v.string()),
    userType: v.optional(v.union(v.literal('all'), v.literal('client'), v.literal('partner'))),
  },
  handler: async (ctx, args) => {
    let users = await ctx.db.query('users').collect();

    if (args.userType && args.userType !== 'all') {
      users = users.filter(user => user.type === args.userType);
    }

    if (args.searchText) {
      const searchLower = args.searchText.toLowerCase();
      users = users.filter(
        user =>
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          (user.spaceName && user.spaceName.toLowerCase().includes(searchLower)) ||
          (user.spaceId && user.spaceId.toLowerCase().includes(searchLower)),
      );
    }

    // Get course data for module counting
    const courseData = await ctx.db.query('courses').collect();

    // Build course map with detailed information
    const courseMap: Record<string, { name: string; moduleCount: number; totalModules: number }> =
      {};

    courseData.forEach(course => {
      // Calculate total modules count
      let totalModules = 0;
      if (course.modules && Array.isArray(course.modules)) {
        totalModules = course.modules.length;
      }

      courseMap[course._id.toString()] = {
        name: course.title,
        moduleCount: totalModules || 1, // Minimum 1 module
        totalModules: totalModules || 1, // Ensure we don't divide by zero
      };
    });

    // Additionally check the courseMeta table for more accurate module counts
    const courseMetaData = await ctx.db.query('courseMeta').collect();

    courseMetaData.forEach(course => {
      // If we have data in courseMeta, it's more accurate
      courseMap[course.slug] = {
        name: course.title,
        moduleCount: course.moduleCount,
        totalModules: course.moduleCount,
      };
    });

    // Calculate module counts from progress data to have realistic numbers
    const allProgressRecords = await ctx.db.query('courseProgress').collect();

    // Count unique module IDs per course
    const uniqueModulesByCourse: Record<string, Set<string>> = {};

    allProgressRecords.forEach(record => {
      const { courseId, moduleId } = record;
      if (!uniqueModulesByCourse[courseId]) {
        uniqueModulesByCourse[courseId] = new Set();
      }
      uniqueModulesByCourse[courseId].add(moduleId);
    });

    // Only use progress records for courses that don't already have module data
    Object.entries(uniqueModulesByCourse).forEach(([courseId, moduleIds]) => {
      // Only add course info if it doesn't already exist from the course definitions
      if (!courseMap[courseId]) {
        const moduleCount = moduleIds.size;
        if (moduleCount > 0) {
          courseMap[courseId] = {
            name: formatCourseId(courseId),
            moduleCount: moduleCount,
            totalModules: moduleCount,
          };
        }
      }
    });

    const usersWithProgress = await Promise.all(
      users.map(async user => {
        const userType = user.type || 'free';

        const progressRecords = await ctx.db
          .query('courseProgress')
          .filter(q => q.eq(q.field('userId'), user.id))
          .collect();

        const courseProgress: Record<string, CourseProgressData> = {};

        for (const record of progressRecords) {
          if (!courseProgress[record.courseId]) {
            courseProgress[record.courseId] = {
              completed: 0,
              total: 0,
              lastUpdated: new Date(0),
              completedModules: new Set(),
            };
          }

          if (record.completed) {
            courseProgress[record.courseId].completed++;
            // Track unique module IDs
            courseProgress[record.courseId].completedModules.add(record.moduleId);
          }

          courseProgress[record.courseId].total++;

          const recordDate = new Date(record.updatedAt);
          if (recordDate > courseProgress[record.courseId].lastUpdated) {
            courseProgress[record.courseId].lastUpdated = recordDate;
          }
        }

        const courses = Object.entries(courseProgress).map(([courseId, data]) => {
          const courseInfo = courseMap[courseId];

          // Calculate progress based on unique completed modules
          const totalModules = courseInfo?.totalModules || 10; // Default to 10 modules if not found
          const completedModulesCount = data.completedModules.size;

          // Calculate percentage based on completed unique modules
          const percentage = Math.min(
            Math.round((completedModulesCount / totalModules) * 100),
            100,
          );

          let status = 'not-started';
          if (percentage === 100) {
            status = 'completed';
          } else if (percentage > 0) {
            status = 'in-progress';
          }

          const courseName = courseInfo?.name || formatCourseId(courseId);

          return {
            courseId,
            courseName,
            progress: percentage,
            completedModules: completedModulesCount,
            totalModules,
            status,
            lastAccessedAt: data.lastUpdated.toISOString(),
          };
        });

        courses.sort((a, b) => {
          return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
        });

        const primaryCourse = courses.length > 0 ? courses[0] : null;

        return {
          id: user.id,
          name: user.name || 'Unknown',
          email: user.email || '',
          spaceId: user.spaceId || '',
          spaceName: user.spaceName || '',
          userType: userType,
          lastActive: user.updatedAt
            ? new Date(user.updatedAt).toISOString()
            : new Date().toISOString(),
          course: primaryCourse?.courseId || '',
          courseName: primaryCourse?.courseName || '',
          completedModules: primaryCourse?.completedModules || 0,
          totalModules: primaryCourse?.totalModules || 0,
          progress: primaryCourse?.progress || 0,
          status: primaryCourse?.status || 'not-started',
          courses,
        };
      }),
    );

    return usersWithProgress;
  },
});

function formatCourseId(courseId: string): string {
  return courseId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const getUserCourses = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('id'), args.userId))
      .first();

    if (!user) {
      return { courses: [] };
    }

    const courseData = await ctx.db.query('courses').collect();
    const courseMap: Record<string, { name: string; moduleCount: number; totalModules: number }> =
      {};

    courseData.forEach(course => {
      let totalModules = 0;
      if (course.modules && Array.isArray(course.modules)) {
        totalModules = course.modules.length;
      }

      courseMap[course._id.toString()] = {
        name: course.title,
        moduleCount: totalModules || 1, // Minimum 1 module
        totalModules: totalModules || 1, // Ensure we don't divide by zero
      };
    });

    const progressRecords = await ctx.db
      .query('courseProgress')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .collect();

    const courseProgress: Record<string, CourseProgressData> = {};

    for (const record of progressRecords) {
      if (!courseProgress[record.courseId]) {
        courseProgress[record.courseId] = {
          completed: 0,
          total: 0,
          lastUpdated: new Date(0),
          completedModules: new Set(),
        };
      }

      if (record.completed) {
        courseProgress[record.courseId].completed++;
        courseProgress[record.courseId].completedModules.add(record.moduleId);
      }

      courseProgress[record.courseId].total++;

      const recordDate = new Date(record.updatedAt);
      if (recordDate > courseProgress[record.courseId].lastUpdated) {
        courseProgress[record.courseId].lastUpdated = recordDate;
      }
    }

    const courses = Object.entries(courseProgress).map(([courseId, data]) => {
      const courseInfo = courseMap[courseId];

      const totalModules = courseInfo?.totalModules || 10; // Default to 10 modules if not found
      const completedModulesCount = data.completedModules.size;

      const percentage = Math.min(Math.round((completedModulesCount / totalModules) * 100), 100);

      let status = 'not-started';
      if (percentage === 100) {
        status = 'completed';
      } else if (percentage > 0) {
        status = 'in-progress';
      }

      const courseName = courseInfo?.name || formatCourseId(courseId);

      return {
        courseId,
        courseName,
        progress: percentage,
        completedModules: completedModulesCount,
        totalModules,
        status,
        lastAccessedAt: data.lastUpdated.toISOString(),
      };
    });

    courses.sort((a, b) => {
      return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
    });

    return { courses };
  },
});

// Define a type for the course object returned by our function
interface CourseWithProgress {
  courseId: string;
  courseName: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  status: string;
  lastAccessedAt: string;
}

/**
 * Get users with pre-calculated course progress
 * This combines user data with their course progress in a single query
 */
export const getUsersWithProgress = query({
  args: {
    searchText: v.optional(v.string()),
    userType: v.optional(v.union(v.literal('all'), v.literal('client'), v.literal('partner'))),
  },
  handler: async (ctx, args) => {
    let users = await ctx.db.query('users').collect();

    if (args.searchText) {
      const searchLower = args.searchText.toLowerCase();
      users = users.filter(
        user =>
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.email && user.email?.toLowerCase().includes(searchLower)) ||
          (user.spaceName && user.spaceName?.toLowerCase().includes(searchLower)) ||
          (user.spaceId && user.spaceId?.toLowerCase().includes(searchLower)),
      );
    }

    if (args.userType && args.userType !== 'all') {
      users = users.filter(user => user.type === args.userType);
    }

    const courseData = await ctx.db.query('courses').collect();

    const courseMap: Record<string, { name: string; moduleCount: number; totalModules: number }> =
      {};

    courseData.forEach(course => {
      let totalModules = 0;
      if (course.modules && Array.isArray(course.modules)) {
        totalModules = course.modules.length;
      }

      courseMap[course._id.toString()] = {
        name: course.title,
        moduleCount: totalModules || 1,
        totalModules: totalModules || 1,
      };

      if (course.slug) {
        courseMap[course.slug] = {
          name: course.title,
          moduleCount: totalModules || 1,
          totalModules: totalModules || 1,
        };
      }
    });

    // Additionally check the courseMeta table for more accurate module counts
    const courseMetaData = await ctx.db.query('courseMeta').collect();

    courseMetaData.forEach(course => {
      // If we have data in courseMeta, it's more accurate
      courseMap[course.slug] = {
        name: course.title,
        moduleCount: course.moduleCount,
        totalModules: course.moduleCount,
      };
    });

    const allProgressRecords = await ctx.db.query('courseProgress').collect();

    const uniqueModulesByCourse: Record<string, Set<string>> = {};

    allProgressRecords.forEach(record => {
      const { courseId, moduleId } = record;
      if (!uniqueModulesByCourse[courseId]) {
        uniqueModulesByCourse[courseId] = new Set();
      }
      uniqueModulesByCourse[courseId].add(moduleId);
    });

    // Only use progress records for courses that don't already have module data
    Object.entries(uniqueModulesByCourse).forEach(([courseId, moduleIds]) => {
      // Only add course info if it doesn't already exist from the course definitions
      if (!courseMap[courseId]) {
        const moduleCount = moduleIds.size;
        if (moduleCount > 0) {
          courseMap[courseId] = {
            name: formatCourseId(courseId),
            moduleCount: moduleCount,
            totalModules: moduleCount,
          };
        }
      }
    });

    const usersWithProgress = await Promise.all(
      users.map(async user => {
        const progressRecords = await ctx.db
          .query('courseProgress')
          .filter(q => q.eq(q.field('userId'), user.id))
          .collect();

        const courseProgress: Record<
          string,
          { completed: number; total: number; lastUpdated: Date; completedModules: Set<string> }
        > = {};

        for (const record of progressRecords) {
          if (!courseProgress[record.courseId]) {
            courseProgress[record.courseId] = {
              completed: 0,
              total: 0,
              lastUpdated: new Date(0),
              completedModules: new Set(),
            };
          }

          if (record.completed) {
            courseProgress[record.courseId].completed++;
            courseProgress[record.courseId].completedModules.add(record.moduleId);
          }

          courseProgress[record.courseId].total++;

          const recordDate = new Date(record.updatedAt);
          if (recordDate > courseProgress[record.courseId].lastUpdated) {
            courseProgress[record.courseId].lastUpdated = recordDate;
          }
        }

        const courses: CourseWithProgress[] = Object.entries(courseProgress).map(
          ([courseId, data]) => {
            const courseInfo = courseMap[courseId];

            const totalModules = courseInfo?.totalModules || 10; // Default to 10 modules if not found
            const completedModulesCount = data.completedModules.size;

            const percentage = Math.min(
              Math.round((completedModulesCount / totalModules) * 100),
              100,
            );

            let status = 'not-started';
            if (percentage === 100) {
              status = 'completed';
            } else if (percentage > 0) {
              status = 'in-progress';
            }

            const courseName = courseInfo?.name || formatCourseId(courseId);

            return {
              courseId,
              courseName,
              progress: percentage,
              completedModules: completedModulesCount,
              totalModules,
              status,
              lastAccessedAt: data.lastUpdated.toISOString(),
            };
          },
        );

        courses.sort((a, b) => {
          return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
        });

        const primaryCourse = courses.length > 0 ? courses[0] : null;

        return {
          id: user.id,
          name: user.name || 'Unknown',
          email: user.email || '',
          spaceId: user.spaceId || '',
          spaceName: user.spaceName || '',
          userType: user.type || 'free',
          lastActive: user.updatedAt
            ? new Date(user.updatedAt).toISOString()
            : new Date().toISOString(),
          course: primaryCourse?.courseId || '',
          courseName: primaryCourse?.courseName || '',
          completedModules: primaryCourse?.completedModules || 0,
          totalModules: primaryCourse?.totalModules || 0,
          progress: primaryCourse?.progress || 0,
          status: primaryCourse?.status || 'not-started',
          courses,
        };
      }),
    );

    return usersWithProgress;
  },
});
