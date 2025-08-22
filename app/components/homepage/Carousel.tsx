'use client';

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

/**
 * Configuration array containing all carousel slide data
 * Each item represents a slide with its content, styling, and actions
 */
const carouselItems = [
  {
    id: 'events',
    title: 'Upcoming Events',
    description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
    buttonText: 'View Events',
    buttonAction: () => {
      // Navigate to events page or external link
      window.open('/events', '_blank');
    },
    backgroundColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
  },
  {
    id: 'certification',
    title: 'Builder.io Certification',
    description:
      'Become a certified Builder.io expert and showcase your skills to potential employers.',
    buttonText: 'Learn More',
    buttonAction: () => {
      // Navigate to certification page or external link
      window.open('/certification', '_blank');
    },
    backgroundColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
];

/**
 * Carousel component that displays rotating content slides with navigation controls
 * Features auto-advance functionality, manual navigation, and accessibility support
 *
 * @returns {JSX.Element} A fully responsive carousel with events and certification content
 */
export function Carousel() {
  // Track which slide is currently being displayed (0-based index)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Control whether the carousel should automatically advance slides
  // Set to false when user manually navigates to prevent interference
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  /**
   * Auto-advance carousel functionality
   * Automatically moves to the next slide every 5 seconds when auto-play is enabled
   * Loops back to the first slide when reaching the end
   */
  useEffect(() => {
    // Exit early if auto-play is disabled (e.g., user is manually navigating)
    if (!isAutoPlaying) return;

    // Set up interval to advance slides every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        // If we're at the last slide, go back to first slide (index 0)
        // Otherwise, advance to the next slide
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000ms = 5 seconds

    // Cleanup function: clear the interval when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [isAutoPlaying]); // Re-run effect when isAutoPlaying changes

  /**
   * Navigate to a specific slide by index
   * Temporarily disables auto-play to prevent interference with user interaction
   * Re-enables auto-play after 10 seconds of inactivity
   *
   * @param {number} index - The slide index to navigate to (0-based)
   */
  const goToSlide = (index: number) => {
    // Update the current slide index
    setCurrentIndex(index);

    // Pause auto-play so it doesn't interfere with user's manual navigation
    setIsAutoPlaying(false);

    // Resume auto-play after 10 seconds of user inactivity
    // This provides a good balance between user control and automatic progression
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  /**
   * Navigate to the previous slide
   * Wraps around to the last slide if currently on the first slide
   */
  const goToPrevious = () => {
    // If we're on the first slide (index 0), wrap around to the last slide
    // Otherwise, go to the previous slide
    const newIndex = currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  /**
   * Navigate to the next slide
   * Wraps around to the first slide if currently on the last slide
   */
  const goToNext = () => {
    // If we're on the last slide, wrap around to the first slide (index 0)
    // Otherwise, advance to the next slide
    const newIndex = currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  // Get the data for the currently displayed slide
  const currentItem = carouselItems[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-12">
      {/* Main carousel container */}
      <div
        className={`relative overflow-hidden rounded-lg border transition-all duration-500 ${currentItem.backgroundColor} ${currentItem.borderColor}`}
        aria-live="polite"
        aria-label="Featured content carousel"
      >
        {/* Carousel content */}
        <div className="px-6 py-8 md:px-12 md:py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black mb-4 leading-tight">
            {currentItem.title}
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            {currentItem.description}
          </p>

          <Button
            onClick={currentItem.buttonAction}
            className="inline-flex items-center justify-center"
          >
            {currentItem.buttonText}
          </Button>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#a97ff2] focus:ring-offset-2"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#a97ff2] focus:ring-offset-2"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#a97ff2] focus:ring-offset-2 ${
              index === currentIndex ? 'bg-[#a97ff2] scale-110' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Screen reader only content for current slide info */}
      <div className="sr-only" aria-live="polite">
        Slide {currentIndex + 1} of {carouselItems.length}: {currentItem.title}
      </div>
    </div>
  );
}
