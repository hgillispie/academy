'use client';

import React from 'react';
import { Button } from './Button';

/**
 * Props interface for the CertificationBanner component
 * Defines all customizable properties for the certification promotional banner
 */
interface CertificationBannerProps {
  /** The main title/heading text displayed at the top of the banner */
  title?: string;
  /** The descriptive text that explains the certification benefits */
  description?: string;
  /** The text content for the call-to-action button */
  buttonText?: string;
  /** Callback function triggered when the CTA button is clicked */
  onButtonClick?: () => void;
  /** Additional CSS classes to apply to the outer container */
  className?: string;
}

/**
 * CertificationBanner Component
 *
 * A reusable promotional banner component designed to showcase Builder.io certification
 * opportunities. Features a light blue background, centered content layout, and a
 * call-to-action button. Fully responsive design that adapts to mobile, tablet, and desktop.
 *
 * Design converted from Figma to use modern CSS techniques (flexbox) instead of
 * absolute positioning for better responsiveness and maintainability.
 *
 * @param props - CertificationBannerProps object containing customization options
 * @returns JSX element representing the certification promotional banner
 */
export const CertificationBanner: React.FC<CertificationBannerProps> = ({
  title = 'Builder.io Certification', // Default title for the banner
  description = 'Become a certified Builder.io expert and showcase your skills to potential employers.', // Default promotional text
  buttonText = 'Learn More', // Default CTA button text
  onButtonClick, // Optional click handler for the CTA button
  className = '', // Additional styling classes
}) => {
    return (
    {/* Outer container with full width and white background */}
    <div className={`w-full bg-white ${className}`}>
      {/*
        Inner content container with:
        - Light blue background (#E6F1FF) matching Figma design
        - Rounded corners for modern appearance
        - Responsive padding (8px mobile, 8px vertical + 24px horizontal on larger screens)
        - Flexbox column layout with centered content
        - 20px gap between elements
        - Centered text alignment
      */}
      <div className="bg-[#E6F1FF] rounded-lg p-8 md:py-8 md:px-24 flex flex-col justify-center items-center gap-5 text-center">
        {/* Main title/heading with responsive text sizing and medium font weight */}
        <h2 className="text-black text-xl md:text-2xl font-medium leading-8 font-sans">{title}</h2>

        {/*
          Description text with:
          - Gray color (#374151) for secondary text hierarchy
          - Responsive font sizing (14px mobile, 16px desktop)
          - Maximum width constraint (32rem) for optimal readability
          - Normal font weight for body text
        */}
        <p className="text-[#374151] text-sm md:text-base font-normal leading-6 font-sans max-w-2xl">
          {description}
        </p>

        {/*
          Call-to-action button using the project's Button component
          - Custom horizontal padding (28px) to match Figma design
          - Vertical padding (8px) for proper touch target size
          - Purple background and hover states handled by Button component
        */}
        <Button onClick={onButtonClick} className="px-7 py-2">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};