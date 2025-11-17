'use client';

import { Footer } from '@/components/navigation/Footer';
import { Button } from '../common/Button';
import { Carousel } from '../common/Carousel';
import { takeSurvey } from './takeSurvey';
import Link from 'next/link';

export function HomeContent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow flex flex-col max-w-[1030px] w-full mx-auto px-6 py-12">
        <h1 className="text-[42px] font-normal text-black mb-12 text-center">
          Welcome to Builder Academy
        </h1>

        <div className="bg-[#f5f0ff] p-8 rounded-2xl border border-[#a97ff2] mb-12">
          <h2 className="text-2xl font-medium mb-4 text-black">
            Help Us Improve Your Learning Experience
          </h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Take a quick survey to customize your learning journey and help us provide better
            content.
          </p>
          <Button
            onClick={() => {
              takeSurvey();
            }}
          >
            Take Survey
          </Button>
        </div>

        {/* Carousel Section */}
        <div className="mb-12">
          <Carousel autoPlay={true} interval={5000}>
            {/* Certification Card */}
            <div className="w-full px-2">
              <div className="bg-[#E6F1FF] rounded-lg p-8 md:p-12 flex flex-col items-center justify-center gap-5 text-center min-h-[200px]">
                <h2 className="text-2xl md:text-[24px] font-medium leading-8 text-black">
                  Builder.io Certification
                </h2>
                <p className="text-base text-[#374151] leading-6 max-w-[600px]">
                  Become a certified Builder.io expert and showcase your skills to potential
                  employers.
                </p>
                <Link href="/certification">
                  <Button>Learn More</Button>
                </Link>
              </div>
            </div>

            {/* Events Card */}
            <div className="w-full px-2">
              <div className="bg-[#FFEDD5] rounded-lg p-8 md:p-12 flex flex-col items-center justify-center gap-5 text-center min-h-[200px]">
                <h2 className="text-2xl md:text-[24px] font-medium leading-8 text-black">
                  Upcoming Events
                </h2>
                <p className="text-base text-[#374151] leading-6 max-w-[600px]">
                  Join our upcoming webinars and workshops to enhance your Builder.io knowledge.
                </p>
                <Link href="/events">
                  <Button>View Events</Button>
                </Link>
              </div>
            </div>
          </Carousel>
        </div>
      </main>

      <Footer />
    </div>
  );
}
