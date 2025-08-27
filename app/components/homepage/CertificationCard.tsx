'use client';

import { Button } from '../common/Button';

export function CertificationCard() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-[#E6F1FF] rounded-lg">
      <div className="text-center space-y-5 max-w-md">
        <h3 className="text-2xl font-medium text-black leading-8">
          Builder.io Certification
        </h3>
        <p className="text-[#374151] text-base leading-6">
          Become a certified Builder.io expert and showcase your skills to potential employers.
        </p>
        <div className="pt-1">
          <Button 
            onClick={() => {
              // Navigate to certification page
              window.location.href = '/certification';
            }}
            className="px-8 py-2"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
