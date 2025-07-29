'use client';

import { Footer } from '@/components/navigation/Footer';
import { Button } from '../common/Button';
import { takeSurvey } from './takeSurvey';
import { Carousel } from './Carousel';

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

        <Carousel />
      </main>

      <Footer />
    </div>
  );
}
