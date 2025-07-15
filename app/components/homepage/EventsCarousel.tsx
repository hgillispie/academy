'use client';

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

export function EventsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'events',
      title: 'Upcoming Events',
      description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
      buttonText: 'View Events',
      backgroundColor: '#FFEDD5',
      href: '/events',
    },
    {
      id: 'certification',
      title: 'Builder.io Certification',
      description:
        'Become a certified Builder.io expert and showcase your skills to potential employers.',
      buttonText: 'Learn More',
      backgroundColor: '#E6F1FF',
      href: '/certification',
    },
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

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
    <div className="w-full max-w-[954px] mx-auto mb-12">
      <div className="relative overflow-hidden rounded-lg bg-white">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <div
                className="flex flex-col justify-center items-center gap-5 px-6 sm:px-12 md:px-24 py-8 rounded-lg min-h-[200px]"
                style={{ backgroundColor: slide.backgroundColor }}
              >
                <h2 className="text-xl sm:text-2xl font-medium text-black text-center leading-tight">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed max-w-2xl">
                  {slide.description}
                </p>
                <Button
                  className="bg-[#A97FF2] hover:bg-[#9766E8] text-white px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base font-normal"
                  onClick={() => (window.location.href = slide.href)}
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
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-[#A97FF2]' : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
