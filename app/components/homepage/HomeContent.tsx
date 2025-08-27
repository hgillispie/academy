'use client';

import { Footer } from '@/components/navigation/Footer';
import { Button } from '../common/Button';
import { takeSurvey } from './takeSurvey';
import { Carousel } from './Carousel';
import { EventsCard } from './EventsCard';
import { CertificationCard } from './CertificationCard';

export function HomeContent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow flex flex-col max-w-[1030px] w-full mx-auto px-6 py-12">
        <h1 className="text-[42px] font-normal text-black mb-12 text-center">
          Welcome to Builder Academy
        </h1>

        <div className="mb-16">
          <Carousel
            slides={[<EventsCard key="events" />, <CertificationCard key="certification" />]}
            size="lg"
            autoPlay={5000}
            showArrows={true}
            showDots={true}
            className="max-w-4xl mx-auto"
          />
        </div>

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
      </main>

      <Footer />
    </div>
  );
}
