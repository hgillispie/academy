'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

interface CarouselCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  backgroundColor: string;
}

const carouselCards: CarouselCard[] = [
  {
    id: 'events',
    title: 'Upcoming Events',
    description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
    buttonText: 'View Events',
    buttonAction: () => {
      // Navigate to events page
      window.location.href = '/events';
    },
    backgroundColor: '#FFEDD5', // Orange/peach background
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
    backgroundColor: '#E6F1FF', // Blue background
  },
];

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % carouselCards.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false); // Stop auto-play when user manually navigates
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? carouselCards.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % carouselCards.length;
    goToSlide(newIndex);
  };

  const currentCard = carouselCards[currentIndex];

  return (
    <div className="w-full mb-12">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg">
        {/* Card */}
        <div
          className="flex flex-col justify-center items-center gap-5 px-6 py-8 md:px-16 md:py-8 transition-all duration-500 ease-in-out"
          style={{ backgroundColor: currentCard.backgroundColor }}
        >
          {/* Title */}
          <h2 className="text-2xl font-medium text-black text-center leading-8">
            {currentCard.title}
          </h2>

          {/* Description */}
          <p className="text-gray-700 text-center text-base leading-6 max-w-2xl">
            {currentCard.description}
          </p>

          {/* Button */}
          <Button
            onClick={currentCard.buttonAction}
            className="bg-[#A97FF2] hover:bg-[#9665d8] text-white px-7 py-2 rounded-full"
          >
            {currentCard.buttonText}
          </Button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {carouselCards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-[#A97FF2] scale-110' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          {isAutoPlay ? 'Pause auto-play' : 'Resume auto-play'}
        </button>
      </div>
    </div>
  );
}
