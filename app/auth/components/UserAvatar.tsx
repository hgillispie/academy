'use client';

import Image from 'next/image';
import { UserIcon } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  size?: number;
}

export function UserAvatar({ src, size = 32 }: UserAvatarProps) {
  if (!src) {
    return (
      <div
        className="bg-gray-100 rounded-full flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <UserIcon className="w-4/6 h-4/6 text-gray-500" />
      </div>
    );
  }

  return <Image src={src} alt="User avatar" width={size} height={size} className="rounded-full" />;
}
