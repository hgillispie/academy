/**
 * Carousel Component
 * 
 * A fully responsive and accessible carousel component that displays featured content cards.
 * Based on Figma design specifications with auto-advancing slides, manual navigation,
 * and WCAG 2.3 accessibility compliance.
 * 
 * Features:
 * - Auto-advancing slides every 5 seconds
 * - Manual navigation via arrows and dot indicators
 * - Pause on hover for better user experience
 * - Full keyboard and screen reader accessibility
 * - Responsive design for all screen sizes
 * - Smooth CSS transitions between slides
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

/**
 * Interface defining the structure of each carousel card
 * Each card represents a featured content section with its own styling and behavior
 */
interface CarouselCard {
  /** Unique identifier for the card */
  id: string;
  /** Main heading text displayed on the card */
  title: string;
  /** Descriptive text explaining the card's purpose */
  description: string;
  /** Text displayed on the call-to-action button */
  buttonText: string;
  /** Background color for the card (hex color code) */
  backgroundColor: string;
  /** Function to execute when the button is clicked */
  onClick: () => void;
}

/**
 * Static data for carousel cards
 * Currently contains two cards: Events and Certification
 * Colors match the Figma design specifications:
 * - Events: Orange background (#FFEDD5)
 * - Certification: Blue background (#E6F1FF)
 */
const carouselData: CarouselCard[] = [
  {
    id: 'events',
    title: 'Upcoming Events',
    description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
    buttonText: 'View Events',
    backgroundColor: '#FFEDD5', // Light orange background
    onClick: () => {
      // Navigate to events page when implemented
      // TODO: Replace with proper Next.js router navigation
      window.location.href = '/events';
    },
  },
  {
    id: 'certification',
    title: 'Builder.io Certification',
    description:
      'Become a certified Builder.io expert and showcase your skills to potential employers.',
    buttonText: 'Learn More',
    backgroundColor: '#E6F1FF', // Light blue background
    onClick: () => {
      // Navigate to certification page when implemented
      // TODO: Replace with proper Next.js router navigation
      window.location.href = '/certification';
    },
  },
];

/**
 * Main Carousel Component
 * 
 * Renders a responsive carousel with auto-advancing slides and manual navigation controls.
 * Implements accessibility best practices including ARIA attributes, keyboard navigation,
 * and screen reader support.
 */
export function Carousel() {
  // State to track which slide is currently visible (0-based index)
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State to control whether the carousel should auto-advance
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  /**
   * Effect hook for auto-advancing carousel slides
   * 
   * Automatically moves to the next slide every 5 seconds when auto-play is enabled.
   * Cleans up the interval when the component unmounts or auto-play is disabled.
   */
  useEffect(() => {
    // Don't set up interval if auto-play is disabled
    if (!isAutoPlaying) return;

    // Set up interval to advance slides every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselData.length);
    }, 5000);

    // Cleanup function to clear interval when effect re-runs or component unmounts
    return () => clearInterval(interval);
  }, [isAutoPlaying]); // Re-run effect when auto-play state changes

  /**
   * Navigate to a specific slide by index
   * 
   * @param index - The index of the slide to navigate to (0-based)
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Disable auto-play when user manually navigates
    
    // Resume auto-play after 10 seconds of inactivity to improve UX
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  /**
   * Navigate to the previous slide
   * Uses modulo arithmetic to wrap around to the last slide when at the beginning
   */
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + carouselData.length) % carouselData.length);
    setIsAutoPlaying(false); // Disable auto-play when user manually navigates
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  /**
   * Navigate to the next slide
   * Uses modulo arithmetic to wrap around to the first slide when at the end
   */
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % carouselData.length);
    setIsAutoPlaying(false); // Disable auto-play when user manually navigates
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Carousel Container */}
      <div
        className="relative overflow-hidden rounded-lg"
        role="region" // ARIA role for landmark navigation
        aria-label="Featured content carousel" // Accessible label for screen readers
        onMouseEnter={() => setIsAutoPlaying(false)} // Pause auto-play on hover
        onMouseLeave={() => setIsAutoPlaying(true)} // Resume auto-play when mouse leaves
      >
        {/* 
          Cards Container
          Uses CSS transform to slide between cards. The transform moves the entire
          container left by (currentIndex * 100%) to show the correct slide.
        */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselData.map((card, index) => (
            <div
              key={card.id}
              className="w-full flex-shrink-0" // Each card takes full width and doesn't shrink
              aria-hidden={index !== currentIndex} // Hide non-active slides from screen readers
            >
              {/* Individual Card Content */}
              <div
                className="flex flex-col justify-center items-center gap-5 p-8 md:p-12 rounded-lg min-h-[200px]"
                style={{ backgroundColor: card.backgroundColor }}
              >
                {/* Card Title */}
                <h2 className="text-xl md:text-2xl font-medium text-black text-center leading-8">
                  {card.title}
                </h2>
                
                {/* Card Description */}
                <p className="text-sm md:text-base text-gray-700 text-center leading-6 max-w-2xl">
                  {card.description}
                </p>
                
                {/* Call-to-Action Button */}
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

      {/* Previous Slide Navigation Arrow */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
        aria-label="Previous slide" // Accessible label for screen readers
      >
        {/* Left-pointing chevron SVG icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Next Slide Navigation Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
        aria-label="Next slide" // Accessible label for screen readers
      >
        {/* Right-pointing chevron SVG icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 
        Dot Indicators for Manual Navigation
        Shows one dot per slide with visual indication of the current slide
      */}
      <div className="flex justify-center gap-2 mt-6">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-[#A97FF2] scale-110' // Active slide: purple background, slightly larger
                : 'bg-gray-300 hover:bg-gray-400' // Inactive slides: gray background with hover state
            }`}
            aria-label={`Go to slide ${index + 1}`} // Accessible label with 1-based numbering
            aria-current={index === currentIndex ? 'true' : 'false'} // Indicates current slide for screen readers
          />
        ))}
      </div>

      {/* 
        Screen Reader Only Content
        Provides live announcements when slides change for better accessibility.
        The aria-live="polite" attribute ensures screen readers announce changes
        without interrupting other content.
      */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing slide {currentIndex + 1} of {carouselData.length}:{' '}
        {carouselData[currentIndex].title}
      </div>
    </div>
  );
}
