'use client';

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  backgroundColor: string;
  backgroundClass: string;
}

export function FeatureCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: CarouselSlide[] = [
    {
      id: 'events',
      title: 'Upcoming Events',
      description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
      buttonText: 'View Events',
      buttonAction: () => {
        // Navigate to events page
        window.location.href = '/events';
      },
      backgroundColor: '#FFEDD5',
      backgroundClass: 'bg-orange-100',
    },
    {
      id: 'certification',
      title: 'Builder.io Certification',
      description:
        'Become a certified Builder.io expert and showcase your skills to potential employers.',
      buttonText: 'Learn More',
      buttonAction: () => {
        // Navigate to certification page
        window.location.href = '/certification';
      },
      backgroundColor: '#E6F1FF',
      backgroundClass: 'bg-blue-100',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full mb-12">
      <div className="relative overflow-hidden">
        {/* Carousel Container */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <div
                className="rounded-lg p-8 md:p-12 text-center"
                style={{ backgroundColor: slide.backgroundColor }}
              >
                <h2 className="text-2xl font-medium text-black mb-5">{slide.title}</h2>
                <p className="text-gray-600 text-base leading-6 mb-5 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <Button
                  onClick={slide.buttonAction}
                  className="bg-[#A97FF2] hover:bg-[#9770E8] text-white px-7 py-2 rounded-full transition-colors"
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all z-10"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all z-10"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-[#A97FF2] scale-110' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isAutoPlaying ? 'Pause' : 'Resume'} auto-play
        </button>
      </div>
    </div>
  );
}
