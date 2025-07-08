interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: string;
  colorClass?: string;
  className?: string;
}

/**
 * A reusable progress bar component
 */
export function ProgressBar({
  progress,
  showPercentage = true,
  height = 'h-2.5',
  colorClass = 'bg-purple-600',
  className = '',
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(0, progress), 100);

  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${colorClass} ${height} rounded-full`}
          style={{ width: `${safeProgress}%` }}
        ></div>
      </div>
      {showPercentage && <div className="text-xs text-gray-500 mt-1">{safeProgress}%</div>}
    </div>
  );
}
