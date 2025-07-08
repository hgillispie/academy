import { UserStatus, UserType } from '../../types/schemas';

interface BadgeProps {
  children: React.ReactNode;
  color: 'green' | 'blue' | 'gray' | 'purple' | 'yellow' | 'red';
}

/**
 * A generic badge component with different color options
 */
export function Badge({ children, color }: BadgeProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}

/**
 * A badge component for user status
 */
export function StatusBadge({ status }: { status: UserStatus }) {
  switch (status) {
    case 'completed':
      return <Badge color="green">Completed</Badge>;
    case 'in-progress':
      return <Badge color="blue">In Progress</Badge>;
    case 'not-started':
      return <Badge color="gray">Not Started</Badge>;
  }
}

/**
 * A badge component for user types
 */
export function UserTypeBadge({ type }: { type: UserType }) {
  switch (type) {
    case 'client':
      return <Badge color="purple">Client</Badge>;
    case 'partner':
      return <Badge color="yellow">Partner</Badge>;
    case 'free':
      return <Badge color="gray">Free</Badge>;
    case 'super_admin':
      return <Badge color="red">Admin</Badge>;
  }
}
