'use client';

import { useState } from 'react';
import { Button } from '../common/Button';

const slides = [
  {
    id: 1,
    title: 'Upcoming Events',
    description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
    buttonText: 'View Events',
    backgroundColor: '#FFEDD5',
    buttonAction: () => {
      // Navigate to events page
      window.location.href = '/events';
    },
  },
  {
    id: 2,
    title: 'Builder.io Certification',
    description:
      'Become a certified Builder.io expert and showcase your skills to potential employers.',
    buttonText: 'Learn More',
    backgroundColor: '#E6F1FF',
    buttonAction: () => {
      // Navigate to certification page
      window.location.href = '/certification';
    },
  },
];

export function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-12">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map(slide => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <div
                className="flex flex-col justify-center items-center gap-5 py-8 px-6 sm:px-12 md:px-24 lg:px-32 rounded-lg text-center min-h-[200px]"
                style={{ backgroundColor: slide.backgroundColor }}
              >
                <h2 className="text-2xl font-medium text-black leading-8">{slide.title}</h2>
                <p className="text-gray-600 text-base leading-6 max-w-2xl">{slide.description}</p>
                <Button onClick={slide.buttonAction}>{slide.buttonText}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-[#a97ff2]' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-advance functionality */}
      <div className="sr-only">
        Carousel with {slides.length} slides. Use arrow keys or click dots to navigate.
      </div>
    </div>
  );
}
