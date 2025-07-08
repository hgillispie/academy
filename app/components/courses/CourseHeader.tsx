interface CourseHeaderProps {
  title?: string;
  description?: string;
  level?: string;
  instructor?: {
    name?: string;
    title?: string;
  };
}

export function CourseHeader({ title, description, level, instructor }: CourseHeaderProps) {
  return (
    <div className="mb-10">
      <div className="mb-2">
        <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
          {level || 'Builder 101'}
        </span>
      </div>

      <h1 className="text-3xl font-medium mb-4">{title}</h1>

      <p className="text-gray-600 mb-4">{description}</p>

      {instructor && (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-700">
            {instructor.name?.[0] || 'I'}
          </div>
          <div className="ml-2">
            <div className="font-medium">{instructor.name}</div>
            {instructor.title && <div className="text-sm text-gray-500">{instructor.title}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
