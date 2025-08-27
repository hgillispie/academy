'use client';

import { Button } from '../common/Button';

export function EventsCard() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-[#FFEDD5] rounded-lg">
      <div className="text-center space-y-5 max-w-md">
        <h3 className="text-2xl font-medium text-black leading-8">
          Upcoming Events
        </h3>
        <p className="text-[#374151] text-base leading-6">
          Join our upcoming webinars and workshops to enhance your Builder.io knowledge.
        </p>
        <div className="pt-1">
          <Button 
            onClick={() => {
              // Navigate to events page when it exists
              console.log('Navigate to events');
            }}
            className="px-8 py-2"
          >
            View Events
          </Button>
        </div>
      </div>
    </div>
  );
}
