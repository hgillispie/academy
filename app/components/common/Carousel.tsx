'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Props for the Carousel component
 */
interface CarouselProps {
  /** Array of React nodes to display as carousel slides */
  slides: React.ReactNode[];
  /** Auto-play interval in milliseconds. Set to 0 to disable auto-play. Default: 0 */
  autoPlay?: number;
  /** Whether to show navigation arrows. Default: true */
  showArrows?: boolean;
  /** Whether to show pagination dots. Default: true */
  showDots?: boolean;
  /** Additional CSS classes to apply to the carousel container */
  className?: string;
}

/**
 * Carousel component with support for auto-play, arrow navigation, dot pagination,
 * and touch/swipe gestures for mobile devices.
 *
 * Features:
 * - Infinite looping through slides
 * - Auto-play with configurable interval
 * - Previous/Next arrow buttons
 * - Pagination dots with active state
 * - Touch/swipe support for mobile (75px threshold)
 * - Smooth CSS transitions between slides
 * - Accessible with ARIA labels
 */
export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoPlay = 0,
  showArrows = true,
  showDots = true,
  className = '',
}) => {
  // Track the index of the currently visible slide
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track touch coordinates for swipe gesture detection
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  /**
   * Advances to the next slide in the carousel.
   * Wraps around to the first slide after reaching the last slide.
   * Uses useCallback to memoize the function and prevent unnecessary re-renders.
   */
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  /**
   * Goes back to the previous slide in the carousel.
   * Wraps around to the last slide when going back from the first slide.
   * Uses useCallback to memoize the function and prevent unnecessary re-renders.
   */
  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  /**
   * Navigates directly to a specific slide by index.
   * Used by pagination dots to jump to any slide.
   *
   * @param index - The zero-based index of the slide to navigate to
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  /**
   * Sets up auto-play functionality if enabled.
   * Creates an interval that advances to the next slide at the specified interval.
   * Cleans up the interval when the component unmounts or dependencies change.
   */
  useEffect(() => {
    if (autoPlay > 0) {
      const interval = setInterval(nextSlide, autoPlay);
      return () => clearInterval(interval);
    }
  }, [autoPlay, nextSlide]);

  /**
   * Records the initial X coordinate when a touch gesture starts.
   * Used to calculate swipe distance and direction.
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  /**
   * Records the current X coordinate as the user moves their finger.
   * Updated continuously during the swipe gesture.
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  /**
   * Handles the end of a touch gesture and determines if a swipe occurred.
   * If the swipe distance exceeds 75px, navigates to the next or previous slide.
   * - Swipe left (touchStart > touchEnd + 75): Next slide
   * - Swipe right (touchStart < touchEnd - 75): Previous slide
   */
  const handleTouchEnd = () => {
    // Swiped left - go to next slide
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    // Swiped right - go to previous slide
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  return (
    // Main carousel container with relative positioning for absolute-positioned controls
    <div className={`relative w-full ${className}`}>
      {/* Slide viewport - hides overflow and handles touch events for swipe gestures */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/*
          Slides container - uses flexbox to arrange slides horizontally.
          Transform property shifts the container left/right to show different slides.
          Each slide is 100% width, so translateX(-100%) shows slide 2, translateX(-200%) shows slide 3, etc.
          Transition provides smooth animation when changing slides.
        */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Render each slide as a full-width, non-shrinking flex item */}
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - only shown if enabled and there's more than one slide */}
      {showArrows && slides.length > 1 && (
        <>
          {/* Previous slide button - positioned on the left, vertically centered */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all z-10"
            aria-label="Previous slide"
          >
            {/* Left chevron icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next slide button - positioned on the right, vertically centered */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all z-10"
            aria-label="Next slide"
          >
            {/* Right chevron icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination dots - only shown if enabled and there's more than one slide */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {/* Render a dot for each slide */}
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                // Active dot is wider and uses brand color, inactive dots are gray
                index === currentIndex ? 'bg-[#a97ff2] w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
