'use client';

import React from 'react';
import { Button } from './Button';

interface CertificationBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const CertificationBanner: React.FC<CertificationBannerProps> = ({
  title = 'Builder.io Certification',
  description = 'Become a certified Builder.io expert and showcase your skills to potential employers.',
  buttonText = 'Learn More',
  onButtonClick,
  className = '',
}) => {
  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="bg-[#E6F1FF] rounded-lg p-8 md:py-8 md:px-24 flex flex-col justify-center items-center gap-5 text-center">
        <h2 className="text-black text-xl md:text-2xl font-medium leading-8 font-sans">{title}</h2>

        <p className="text-[#374151] text-sm md:text-base font-normal leading-6 font-sans max-w-2xl">
          {description}
        </p>

        <Button onClick={onButtonClick} className="px-7 py-2">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
