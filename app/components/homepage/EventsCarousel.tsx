'use client';

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

/**
 * EventsCarousel Component
 *
 * A responsive carousel component that displays promotional content for Builder Academy.
 * Features auto-advancing slides, manual navigation controls, and responsive design.
 *
 * Key Features:
 * - Auto-advances every 5 seconds
 * - Manual navigation via arrow buttons and dot indicators
 * - Responsive design that adapts to mobile, tablet, and desktop
 * - Smooth CSS transitions for slide changes
 * - Accessibility support with ARIA labels
 */
export function EventsCarousel() {
  // State to track which slide is currently active (0-based index)
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * Slide data configuration
   * Each slide contains all the information needed to render the promotional content
   * including styling (background color), content (title, description), and navigation (href)
   */
  const slides = [
    {
      id: 'events', // Unique identifier for React key prop
      title: 'Upcoming Events',
      description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
      buttonText: 'View Events',
      backgroundColor: '#FFEDD5', // Light orange background from Figma design
      href: '/events', // Navigation destination
    },
    {
      id: 'certification',
      title: 'Builder.io Certification',
      description:
        'Become a certified Builder.io expert and showcase your skills to potential employers.',
      buttonText: 'Learn More',
      backgroundColor: '#E6F1FF', // Light blue background from Figma design
      href: '/certification',
    },
  ];

  /**
   * Auto-advance functionality
   * Sets up an interval that automatically moves to the next slide every 5 seconds
   * Uses modulo arithmetic to loop back to the first slide after the last one
   * Cleans up the interval on component unmount to prevent memory leaks
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(timer);
  }, [slides.length]);

  /**
   * Navigation function to move to the next slide
   * Uses modulo arithmetic to wrap around to slide 0 after the last slide
   */
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  /**
   * Navigation function to move to the previous slide
   * Adds slides.length before subtracting to handle negative modulo correctly
   * This ensures we go to the last slide when clicking previous on the first slide
   */
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  /**
   * Navigation function to jump directly to a specific slide
   * Used by the dot indicators for direct navigation
   * @param index - The zero-based index of the slide to navigate to
   */
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    // Main carousel container with responsive width constraints and bottom margin
    <div className="w-full max-w-[954px] mx-auto mb-12">
      {/* Carousel viewport - clips overflow and provides the visible window for slides */}
      <div className="relative overflow-hidden rounded-lg bg-white">
        {/* Slides Container - flexbox that holds all slides in a horizontal row */}
        {/* The transform property moves all slides left/right based on currentSlide index */}
        {/* Each slide is 100% width, so translateX(-100%) shows slide 1, translateX(-200%) shows slide 2, etc. */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Map through each slide to render the content */}
          {slides.map(slide => (
            // Individual slide wrapper - takes full width and prevents shrinking
            <div key={slide.id} className="w-full flex-shrink-0">
              {/* Slide content container with responsive padding and centering */}
              {/* Background color is applied via inline style from slide data */}
              {/* Responsive padding: px-6 (mobile), sm:px-12 (tablet), md:px-24 (desktop) */}
              <div
                className="flex flex-col justify-center items-center gap-5 px-6 sm:px-12 md:px-24 py-8 rounded-lg min-h-[200px]"
                style={{ backgroundColor: slide.backgroundColor }}
              >
                {/* Slide title with responsive text sizing */}
                {/* text-xl on mobile, sm:text-2xl on larger screens */}
                <h2 className="text-xl sm:text-2xl font-medium text-black text-center leading-tight">
                  {slide.title}
                </h2>

                {/* Slide description with responsive text and max width constraint */}
                {/* text-sm on mobile, sm:text-base on larger screens */}
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed max-w-2xl">
                  {slide.description}
                </p>

                {/* Call-to-action button with custom styling matching design system */}
                {/* Purple background (#A97FF2) with hover state and responsive padding */}
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

        {/* Navigation Arrows - positioned absolutely over the carousel content */}

        {/* Previous slide arrow button */}
        {/* Positioned on left side, vertically centered */}
        {/* Semi-transparent background with hover effects and accessibility label */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Previous slide"
        >
          ←
        </button>

        {/* Next slide arrow button */}
        {/* Positioned on right side, vertically centered */}
        {/* Matches styling of previous button for consistency */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Dot Indicators - positioned at bottom center of carousel */}
        {/* Provides visual indication of current slide and direct navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            // Individual dot button for each slide
            // Active dot uses purple color, inactive dots are semi-transparent white
            // Includes hover states and accessibility labels
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
