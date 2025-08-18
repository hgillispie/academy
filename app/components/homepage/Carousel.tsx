'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Interface defining the structure of each carousel card
 * Used to ensure type safety and consistency across all carousel items
 */
interface CarouselCard {
  /** Unique identifier for the carousel card */
  id: string;
  /** Main heading text displayed prominently on the card */
  title: string;
  /** Supporting text that provides additional context about the card's purpose */
  description: string;
  /** Text displayed on the call-to-action button */
  buttonText: string;
  /** Function executed when the user clicks the card's button */
  buttonAction: () => void;
  /** Hex color code for the card's background color */
  backgroundColor: string;
}

/**
 * Static configuration array containing all carousel cards
 * Each card represents a different feature or opportunity within Builder Academy
 * Colors are chosen to match the Figma design specifications
 */
const carouselCards: CarouselCard[] = [
  {
    id: 'events',
    title: 'Upcoming Events',
    // Line 20: Description encouraging users to join educational events to improve their Builder.io skills
    description: 'Join our upcoming webinars and workshops to enhance your Builder.io knowledge.',
    buttonText: 'View Events',
    buttonAction: () => {
      // Navigate to events page where users can see upcoming webinars and workshops
      // Using window.location.href for full page navigation
      window.location.href = '/events';
    },
    backgroundColor: '#FFEDD5', // Warm orange/peach background as specified in Figma design
  },
  {
    id: 'certification',
    title: 'Builder.io Certification',
    description:
      'Become a certified Builder.io expert and showcase your skills to potential employers.',
    buttonText: 'Learn More',
    buttonAction: () => {
      // Navigate to certification page where users can learn about getting certified
      // Full page navigation to maintain consistency with events card behavior
      window.location.href = '/certification';
    },
    backgroundColor: '#E6F1FF', // Cool blue background as specified in Figma design
  },
];

/**
 * Carousel component that displays rotating cards for Events and Certification
 * Features auto-play functionality, manual navigation, and responsive design
 * Based on Figma design specifications with pixel-perfect implementation
 */
export function Carousel() {
  // State to track which card is currently visible (0-based index)
  const [currentIndex, setCurrentIndex] = useState(0);
  // State to control whether the carousel should automatically advance slides
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  /**
   * Auto-play functionality using useEffect and setInterval
   * Automatically advances to the next slide every 5 seconds when enabled
   * Stops when user manually interacts with navigation controls
   */
  useEffect(() => {
    // Exit early if auto-play is disabled by user interaction
    if (!isAutoPlay) return;

    // Set up interval to advance slides automatically
    const interval = setInterval(() => {
      // Use functional update to ensure we have the latest state
      // Modulo operation ensures we loop back to first slide after the last one
      setCurrentIndex(prevIndex => (prevIndex + 1) % carouselCards.length);
    }, 5000); // 5-second interval provides good user experience without being too fast

    // Cleanup function to prevent memory leaks when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [isAutoPlay]); // Re-run effect when auto-play state changes

  /**
   * Navigate to a specific slide by index
   * Disables auto-play to respect user intent and prevent jarring transitions
   * @param index - The 0-based index of the slide to navigate to
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false); // Stop auto-play when user manually navigates to show respect for user control
  };

  /**
   * Navigate to the previous slide in the carousel
   * Handles wrapping from first slide to last slide for seamless experience
   */
  const goToPrevious = () => {
    // If we're at the first slide (index 0), wrap around to the last slide
    // Otherwise, go to the previous slide
    const newIndex = currentIndex === 0 ? carouselCards.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  /**
   * Navigate to the next slide in the carousel
   * Handles wrapping from last slide to first slide for seamless experience
   */
  const goToNext = () => {
    // Use modulo operation to wrap from last slide back to first slide
    const newIndex = (currentIndex + 1) % carouselCards.length;
    goToSlide(newIndex);
  };

  // Get the currently active card based on the current index
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
