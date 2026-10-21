import React from 'react';
import heroImage from '@/assets/beardista_home.jpg';

/**
 * Hero component displaying the main brand headline and visual anchor.
 * Stays 2 columns (text left, photo right) on every screen size and scales up smoothly.
 * @param {Object} props - Component properties
 * @param {Function} props.onExploreMenu - Handler to scroll to the customer favorites menu
 */

export const Hero = ({ onExploreMenu }) => {
  return (
    // Outer section: compact on mobile, original generous height from sm up
    <header className="relative min-h-0 sm:min-h-170 lg:min-h-190 flex items-center bg-[#FFF3E7] px-4 sm:px-8 lg:px-16 py-8 sm:py-12 md:py-20 overflow-hidden">
      {/* 2-column layout at every screen size */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-2 gap-4 sm:gap-8 lg:gap-12 relative z-10 items-center">

        {/* Left Column: Typography and Call-To-Action */}
        <div className="min-w-0 flex flex-col justify-center space-y-3 sm:space-y-6 md:space-y-8 z-20 items-start">

          {/* Main Display Title */}
          <h1 className="font-extrabold text-xl sm:text-4xl md:text-5xl lg:text-7xl text-[#19244E] leading-[1.08] tracking-tight">
            BREW ME TO <br />
            THE <br />
            <span className="text-[#fe9836]">HORIZON.</span>
          </h1>

          {/* Subtitle / Brand Mission Statement */}
          <p className="text-[11px] sm:text-lg md:text-xl text-[#1c1b1b] max-w-lg leading-relaxed font-normal">
            Good coffee, good food, and a place worth staying awhile.
          </p>

          {/* Primary Action Button navigating down to the menu */}
          <div>
            <button
              onClick={onExploreMenu}
              className="inline-flex items-center whitespace-nowrap px-3 py-2 sm:px-8 sm:py-4 bg-[#fe9836] hover:bg-[#e58422] text-white font-semibold text-[10px] sm:text-sm uppercase tracking-wide sm:tracking-wider rounded-sm transition-all duration-200 group shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>EXPLORE THE MENU</span>
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Editorial Photography with Asymmetric Rounded Edges */}
        <div className="min-w-0 relative flex justify-center">

          {/* Photo frame: corner curves and border scale with the screen */}
          <div className="relative w-full aspect-4/5 overflow-hidden rounded-tr-[32px] rounded-bl-[32px] sm:rounded-tr-[60px] sm:rounded-bl-[60px] lg:rounded-tr-[100px] lg:rounded-bl-[100px] shadow-2xl border-2 sm:border-4 border-white/60 group">
            <img
              src={heroImage}
              alt="Beardista Brew signature iced coffee beverage in sunlight"
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="eager"
            />
            {/* Subtle aesthetic gradient vignette */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Decorative Warm Shapes: smaller on mobile so they don't overflow */}
          <div className="absolute -bottom-3 -left-3 sm:-bottom-8 sm:-left-8 w-16 h-16 sm:w-32 sm:h-32 bg-[#fe9836] rounded-xl sm:rounded-2xl mix-blend-multiply opacity-50 blur-lg pointer-events-none" />
          <div className="absolute -top-2 -right-2 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-36 sm:h-36 bg-[#ffdcc3] rounded-2xl sm:rounded-3xl mix-blend-multiply opacity-60 pointer-events-none" />
        </div>

      </div>
    </header>
  );
};
