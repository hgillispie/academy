'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../common/Button';

export interface CarouselProps {
  slides: (string | React.ReactNode)[];
  size?: 'md' | 'lg';
  theme?: 'primary' | 'dark' | 'light';
  autoPlay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  altTexts?: string[];
  onSlideChange?: (index: number) => void;
  className?: string;
  disabled?: boolean;
}

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
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const slidesCount = slides.length;

  useEffect(() => {
    onSlideChange?.(index);
  }, [index, onSlideChange]);

  useEffect(() => {
    if (autoPlay && autoPlay > 0 && !disabled) {
      autoplayRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slidesCount);
      }, autoPlay);
      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
    return;
  }, [autoPlay, slidesCount, disabled]);

  const prev = () => setIndex((i) => (i - 1 + slidesCount) % slidesCount);
  const next = () => setIndex((i) => (i + 1) % slidesCount);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  }

  const carouselHeight = size === 'lg' ? 'h-80' : 'h-64';

  return (
    <div className={`carousel ${size} ${theme} ${className}`}>
      <div
        className={`carousel-track relative overflow-hidden rounded-lg ${carouselHeight}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="carousel-inner flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${slidesCount * 100}%` }}
        >
          {slides.map((slide, i) => (
            <div key={i} style={{ width: `${100 / slidesCount}%` }} className="carousel-slide flex-shrink-0 h-full">
              {typeof slide === 'string' ? (
                <img 
                  src={slide} 
                  alt={altTexts[i] ?? ''} 
                  className="w-full h-full object-cover" 
                  loading={i === 0 ? 'eager' : 'lazy'} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {slide}
                </div>
              )}
            </div>
          ))}
        </div>

        {showArrows && slidesCount > 1 && (
          <>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={prev}
                aria-label="Previous slide"
                disabled={disabled}
                className="bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={next}
                aria-label="Next slide"
                disabled={disabled}
                className="bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {showDots && slidesCount > 1 && (
        <div className="carousel-dots flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === index 
                  ? 'bg-[#a97ff2] scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
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
