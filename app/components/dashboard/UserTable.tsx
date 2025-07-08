'use client';

import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { useUsers } from '../../hooks/useConvexQuery';
import { UserProgress, UserProgressSchema } from '../../types/schemas';
import { StatusBadge, UserTypeBadge } from '../common/Badges';
import { ProgressBar } from '../common/ProgressBar';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface UserTableProps {
  searchText: string;
  userType: 'all' | 'client' | 'partner';
}

interface ExtendedUserProgress extends UserProgress {
  courses?: {
    courseId: string;
    courseName: string;
    progress: number;
    completedModules: number;
    totalModules: number;
    status: string;
    lastAccessedAt: string;
  }[];
}

export default function UserTable({ searchText, userType }: UserTableProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [sorting, setSorting] = useState<SortingState>([{ id: 'lastActive', desc: true }]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: convexUsers, isLoading, error, refetch } = useUsers(searchText, userType);

  const userProgressData: ExtendedUserProgress[] = useMemo(() => {
    if (!convexUsers || !Array.isArray(convexUsers)) return [];

    return convexUsers
      .map(user => {
        if (!user || !user.id || !user.name) {
          return null;
        }

        try {
          const validStatuses = ['not-started', 'in-progress', 'completed'] as const;
          type ValidStatus = (typeof validStatuses)[number];
          const status =
            user.status && validStatuses.includes(user.status as ValidStatus)
              ? (user.status as ValidStatus)
              : 'not-started';

          const validUserTypes = ['free', 'client', 'partner', 'super_admin'] as const;
          type ValidUserType = (typeof validUserTypes)[number];
          const userType =
            user.userType && validUserTypes.includes(user.userType as ValidUserType)
              ? (user.userType as ValidUserType)
              : 'free';

          const userProgress = {
            id: user.id,
            name: user.name,
            email: user.email,
            spaceId: user.spaceId || '',
            spaceName: user.spaceName || '',
            course: user.course || '',
            courseName: user.courseName || '',
            completedModules: user.completedModules || 0,
            totalModules: user.totalModules || 0,
            progress: user.progress || 0,
            lastActive: user.lastActive || new Date().toISOString(),
            status: status,
            userType: userType,
            courses: user.courses || [],
          };

          const result = UserProgressSchema.safeParse(userProgress);

          if (result.success) {
            return { ...result.data, courses: user.courses || [] };
          } else {
            return {
              ...UserProgressSchema.parse({
                id: user.id || 'unknown',
                name: user.name || 'Unknown User',
                email: null,
                spaceId: '',
                spaceName: '',
                course: '',
                progress: 0,
                lastActive: new Date().toISOString(),
                status: 'not-started',
                userType: 'free',
              }),
              courses: user.courses || [],
            };
          }
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ExtendedUserProgress[];
  }, [convexUsers]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const columnHelper = createColumnHelper<ExtendedUserProgress>();

  const toggleRowExpanded = (userId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <div>
          <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
          <div className="text-sm text-gray-500">{info.row.original.email}</div>
        </div>
      ),
    }),
    columnHelper.accessor('spaceName', {
      header: 'Space',
      cell: info => (
        <div>
          <div className="text-sm font-medium text-gray-900">{info.getValue() || '—'}</div>
          {info.row.original.spaceId && (
            <div className="text-xs text-gray-500 flex items-center group">
              <span>Key: {info.row.original.spaceId}</span>
              <button
                onClick={() => copyToClipboard(info.row.original.spaceId, info.row.original.id)}
                className="ml-2 invisible group-hover:visible focus:outline-none"
                aria-label="Copy space ID"
              >
                {copiedId === info.row.original.id ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('userType', {
      header: 'Type',
      cell: info => <UserTypeBadge type={info.getValue()} />,
    }),
    columnHelper.accessor('course', {
      header: 'Course',
      cell: info => {
        const userId = info.row.original.id;
        const courses = info.row.original.courses || [];
        const hasMultipleCourses = courses.length > 1;

        return (
          <div className="text-sm text-gray-900">
            <div className="flex items-center">
              {hasMultipleCourses && (
                <button
                  onClick={() => toggleRowExpanded(userId)}
                  className="mr-2 text-purple-600 hover:text-purple-800 focus:outline-none transition-colors"
                  aria-label={expandedRows[userId] ? 'Collapse courses' : 'Expand courses'}
                >
                  {expandedRows[userId] ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
              )}
              <div>
                {info.row.original.courseName || info.getValue() || '—'}
                {info.row.original.completedModules !== undefined && (
                  <div className="text-xs text-gray-500">
                    {info.row.original.completedModules} / {info.row.original.totalModules} modules
                  </div>
                )}
                {hasMultipleCourses && (
                  <div className="text-xs text-blue-600 font-medium">
                    {courses.length} courses in total
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: info => <ProgressBar progress={info.getValue()} />,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <StatusBadge status={info.getValue() as 'not-started' | 'in-progress' | 'completed'} />
      ),
    }),
    columnHelper.accessor('lastActive', {
      header: 'Last Active',
      cell: info => (
        <div className="text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
  ];

  const renderExpandedCoursesRow = (userId: string, courses: ExtendedUserProgress['courses']) => {
    if (!expandedRows[userId] || !courses || courses.length <= 1) {
      return null;
    }

    return (
      <tr className="bg-gray-50 border-b border-gray-200">
        <td colSpan={columns.length} className="px-0 py-0">
          <div className="p-4 border-t-2 border-purple-100">
            <div className="text-sm text-purple-800 font-medium mb-3 px-2">All Courses</div>
            <div className="rounded-md overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                      Progress
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{course.courseName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {course.completedModules} / {course.totalModules} modules
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={course.status as 'not-started' | 'in-progress' | 'completed'}
                        />
                      </td>
                      <td className="px-4 py-3 w-48">
                        <ProgressBar
                          progress={course.progress}
                          height="h-2"
                          colorClass={
                            course.status === 'completed' ? 'bg-green-500' : 'bg-purple-600'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(course.lastAccessedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const table = useReactTable({
    data: userProgressData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg p-6">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-red-500 mb-4">Error loading user data. Please try again later.</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
          {retryCount > 0 && (
            <div className="mt-2 text-sm text-gray-500">Retry attempts: {retryCount}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="ml-1">
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] || ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {renderExpandedCoursesRow(row.original.id, row.original.courses)}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  {userProgressData.length === 0
                    ? 'No users found'
                    : 'No users found in the database'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-700 mb-2 sm:mb-0">
            Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{' '}
            <span className="font-medium">{userProgressData.length}</span>{' '}
            {userProgressData.length === 1 ? 'user' : 'users'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>{' '}
              of <span className="font-medium">{table.getPageCount()}</span>
            </span>

            <button
              className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>

            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-2 py-1 text-sm rounded-md bg-gray-200 text-gray-700"
            >
              {[10, 25, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
