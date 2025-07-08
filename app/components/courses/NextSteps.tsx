import Link from 'next/link';
import { Course } from '@/types/course';

export function NextSteps({ currentCourse }: { currentCourse: Course }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium mb-4">Recommended Next Steps</h3>
      <div className="grid gap-4">
        {currentCourse.nextRecommendedCourses?.map(course => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="p-4 border rounded-lg hover:border-[#cf0ec7] transition-colors"
          >
            <h4 className="font-medium">{course.title}</h4>
            <p className="text-sm text-gray-600">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
