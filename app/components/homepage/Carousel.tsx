'use client';

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

interface CarouselCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  backgroundColor: string;
  onClick: () => void;
}

const carouselData: CarouselCard[] = [
  {
    id: 'events',
    title: 'Upcoming Events',
    description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
    buttonText: 'View Events',
    backgroundColor: '#FFEDD5',
    onClick: () => {
      // Navigate to events page when implemented
      window.location.href = '/events';
    }
  },
  {
    id: 'certification',
    title: 'Builder.io Certification',
    description: 'Become a certified Builder.io expert and showcase your skills to potential employers.',
    buttonText: 'Learn More',
    backgroundColor: '#E6F1FF',
    onClick: () => {
      // Navigate to certification page when implemented
      window.location.href = '/certification';
    }
  }
];

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-lg"
        role="region" 
        aria-label="Featured content carousel"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Cards Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselData.map((card, index) => (
            <div
              key={card.id}
              className="w-full flex-shrink-0"
              aria-hidden={index !== currentIndex}
            >
              <div
                className="flex flex-col justify-center items-center gap-5 p-8 md:p-12 rounded-lg min-h-[200px]"
                style={{ backgroundColor: card.backgroundColor }}
              >
                <h2 className="text-xl md:text-2xl font-medium text-black text-center leading-8">
                  {card.title}
                </h2>
                <p className="text-sm md:text-base text-gray-700 text-center leading-6 max-w-2xl">
                  {card.description}
                </p>
                <Button 
                  onClick={card.onClick}
                  className="px-7 md:px-8 py-2 bg-[#A97FF2] hover:bg-[#9665d8] text-white rounded-full transition-colors"
                >
                  {card.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-[#A97FF2] scale-110' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Screen Reader Only Content */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing slide {currentIndex + 1} of {carouselData.length}: {carouselData[currentIndex].title}
      </div>
    </div>
  );
}
