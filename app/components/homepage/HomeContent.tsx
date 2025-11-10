'use client';

import { Footer } from '@/components/navigation/Footer';
import { Button } from '../common/Button';
import { Carousel } from '../common/Carousel';
import { takeSurvey } from './takeSurvey';

export function HomeContent() {
  const carouselSlides = [
    // Builder.io Certification Card
    <div key="certification" className="w-full px-16">
      <div
        className="flex flex-col items-center justify-center mx-auto"
        style={{
          backgroundColor: 'rgba(74, 226, 226, 0.72)',
          borderRadius: '8px',
          maxWidth: '896px',
          padding: '48px',
          gap: '20px',
        }}
      >
        <h2 className="text-2xl font-medium text-black text-center">
          Builder.io Certification
        </h2>
        <p className="text-[#374151] text-center text-base leading-6 max-w-2xl">
          Become a certified Builder.io expert and showcase your skills to potential employers.
        </p>
        <Button>Learn More</Button>
      </div>
    </div>,

    // Upcoming Events Card
    <div key="events" className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="bg-[#FFEDD5] rounded-lg p-8 md:p-12 flex flex-col items-center justify-center gap-5 max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-black text-center">
          Upcoming Events
        </h2>
        <p className="text-[#374151] text-center text-base leading-6 max-w-2xl">
          Join our upcoming webinars and workshops to enhance your Builder.io knowledge.
        </p>
        <Button>View Events</Button>
      </div>
    </div>,
  ];

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

        <div className="mb-12">
          <Carousel
            slides={carouselSlides}
            autoPlay={5000}
            showArrows={true}
            showDots={true}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
