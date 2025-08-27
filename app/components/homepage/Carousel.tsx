'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../common/Button';

/**
 * Props interface for the Carousel component
 * Defines all configurable options and event handlers for the carousel
 */
export interface CarouselProps {
  /** Array of slide content - can be image URLs (strings) or React components */
  slides: (string | React.ReactNode)[];
  /** Size variant - affects height: 'md' = 256px, 'lg' = 320px */
  size?: 'md' | 'lg';
  /** Theme variant for styling (currently supports primary, dark, light) */
  theme?: 'primary' | 'dark' | 'light';
  /** Auto-play interval in milliseconds. Set to 0 to disable auto-play */
  autoPlay?: number;
  /** Whether to show navigation arrow buttons on left/right sides */
  showArrows?: boolean;
  /** Whether to show pagination dots below the carousel */
  showDots?: boolean;
  /** Alt text array for image slides (accessibility) - should match slides array length */
  altTexts?: string[];
  /** Callback fired when slide changes - receives the new slide index */
  onSlideChange?: (index: number) => void;
  /** Additional CSS classes to apply to the carousel container */
  className?: string;
  /** Whether the carousel is disabled (prevents all interactions) */
  disabled?: boolean;
}

/**
 * Carousel Component
 *
 * A fully-featured carousel component that displays slides with:
 * - Navigation controls (arrow buttons and pagination dots)
 * - Auto-play functionality with configurable timing
 * - Touch/swipe support for mobile devices
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Support for both image slides and custom React content
 * - Responsive design with size variants
 *
 * The carousel manages its own internal state for slide navigation and provides
 * callbacks for external state management when needed.
 */
export function Carousel({
  slides,
  size = 'md',
  theme = 'primary',
  autoPlay = 0,
  showArrows = true,
  showDots = true,
  altTexts = [],
  onSlideChange,
  className = '',
  disabled = false,
}: CarouselProps) {
  // State management for current slide index
  const [index, setIndex] = useState(0);

  // Ref to store auto-play interval ID for cleanup
  const autoplayRef = useRef<number | null>(null);

  // Ref to track touch start position for swipe gesture detection
  const touchStartX = useRef<number | null>(null);

  // Cache slides count for performance and readability
  const slidesCount = slides.length;

  /**
   * Effect: Notify parent component when slide changes
   * Fires the onSlideChange callback whenever the active slide index updates
   */
  useEffect(() => {
    onSlideChange?.(index);
  }, [index, onSlideChange]);

  /**
   * Effect: Auto-play functionality
   * Sets up and manages the auto-play interval when enabled
   *
   * - Only runs when autoPlay > 0 and component is not disabled
   * - Automatically advances to next slide at specified interval
   * - Cleans up interval on component unmount or when dependencies change
   * - Uses modulo arithmetic to loop back to first slide after last slide
   */
  useEffect(() => {
    if (autoPlay && autoPlay > 0 && !disabled) {
      autoplayRef.current = window.setInterval(() => {
        setIndex(i => (i + 1) % slidesCount);
      }, autoPlay);

      // Cleanup function - clear interval when effect re-runs or component unmounts
      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
    return;
  }, [autoPlay, slidesCount, disabled]);

  /**
   * Navigation helper: Go to previous slide
   * Uses modulo arithmetic to wrap around to last slide when at first slide
   */
  const prev = () => setIndex(i => (i - 1 + slidesCount) % slidesCount);

  /**
   * Navigation helper: Go to next slide
   * Uses modulo arithmetic to wrap around to first slide when at last slide
   */
  const next = () => setIndex(i => (i + 1) % slidesCount);

  /**
   * Touch event handler: Start of swipe gesture
   *
   * - Records the initial touch X position for swipe distance calculation
   * - Pauses auto-play while user is interacting to prevent conflicts
   *
   * @param e - Touch event containing touch coordinates
   */
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;

    // Pause auto-play during user interaction
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  }

  /**
   * Touch event handler: End of swipe gesture
   *
   * - Calculates swipe distance and direction
   * - Triggers navigation if swipe distance exceeds threshold (40px)
   * - Positive delta (swipe right) = previous slide
   * - Negative delta (swipe left) = next slide
   * - Resets touch tracking state
   *
   * @param e - Touch event containing final touch coordinates
   */
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;

    // Calculate horizontal swipe distance
    const dx = e.changedTouches[0].clientX - touchStartX.current;

    // Only trigger navigation if swipe distance exceeds threshold
    if (Math.abs(dx) > 40) {
      if (dx > 0) {
        prev(); // Swipe right = previous slide
      } else {
        next(); // Swipe left = next slide
      }
    }

    // Reset touch tracking
    touchStartX.current = null;
  }

  // Dynamic height class based on size prop
  const carouselHeight = size === 'lg' ? 'h-80' : 'h-64';

  return (
    <div className={`carousel ${size} ${theme} ${className}`}>
      {/* Main carousel container with overflow hidden for slide transitions */}
      <div
        className={`carousel-track relative overflow-hidden rounded-lg ${carouselHeight}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* 
          Sliding container that holds all slides in a horizontal row
          - Width is set to (number of slides * 100%) to accommodate all slides
          - Transform translateX moves the container to show the active slide
          - Transition provides smooth animation between slides
        */}
        <div
          className="carousel-inner flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${slidesCount * 100}%`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              style={{ width: `${100 / slidesCount}%` }}
              className="carousel-slide flex-shrink-0 h-full"
            >
              {typeof slide === 'string' ? (
                // Image slide: render as img element with proper alt text and lazy loading
                <img
                  src={slide}
                  alt={altTexts[i] ?? ''}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'} // First image loads immediately, others lazy load
                />
              ) : (
                // Custom content slide: render React component in centered container
                <div className="w-full h-full flex items-center justify-center">{slide}</div>
              )}
            </div>
          ))}
        </div>

        {/* 
          Navigation arrows - only shown when:
          - showArrows prop is true
          - There is more than one slide
          - Component is not disabled
        */}
        {showArrows && slidesCount > 1 && (
          <>
            {/* Previous slide button - positioned on left side */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={prev}
                aria-label="Previous slide"
                disabled={disabled}
                className="bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Left chevron icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Next slide button - positioned on right side */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={next}
                aria-label="Next slide"
                disabled={disabled}
                className="bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Right chevron icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 
        Pagination dots - only shown when:
        - showDots prop is true
        - There is more than one slide
        
        Each dot represents a slide and can be clicked to navigate directly to that slide
        Active slide's dot is highlighted with brand color and slightly scaled up
      */}
      {showDots && slidesCount > 1 && (
        <div className="carousel-dots flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === index
                  ? 'bg-[#a97ff2] scale-110' // Active dot: brand color + scale
                  : 'bg-gray-300 hover:bg-gray-400' // Inactive dot: gray with hover state
              }`}
              onClick={() => setIndex(i)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
