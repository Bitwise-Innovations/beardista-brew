import React from 'react';
import heroImage from '../assets/beardista_home.jpg';

/**
 * Hero component displaying the main brand headline and visual anchor.
 * @param {Object} props - Component properties
 * @param {Function} props.onExploreMenu - Handler to scroll to the customer favorites menu
 */

export const Hero = ({ onExploreMenu }) => {
  return (
    // Outer section container with warm cream backdrop and vertical breathing space
    <header className="relative min-h-170 lg:min-h-190 flex items-center bg-[#FFF3E7] px-6 md:px-16 py-12 md:py-20 overflow-hidden">
      {/* 12-Column Layout Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">
        
        {/* Left Column (lg:col-span-6): Typography and Call-To-Action */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 z-20 items-start">
          
          {/* Main Display Title with high contrast colors */}
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#19244E] leading-[1.08] tracking-tight">
            BREW ME TO <br />
            THE <br />
            <span className="text-[#fe9836]">HORIZON.</span>
          </h1>

          {/* Subtitle / Brand Mission Statement */}
          <p className="text-base sm:text-lg md:text-xl text-[#1c1b1b] max-w-lg leading-relaxed font-normal">
            Good coffee, good food, and a place worth staying awhile.
          </p>

          {/* Primary Action Button navigating down to the menu */}
          <div>
            <button
              onClick={onExploreMenu}
              className="inline-flex items-center px-8 py-4 bg-[#fe9836] hover:bg-[#e58422] text-white font-semibold text-sm uppercase tracking-wider rounded-sm transition-all duration-200 group shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>EXPLORE THE MENU</span>
              {/* Right Arrow glyph with hover translation animation */}
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform"
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

        {/* Right Column (lg:col-span-6): Editorial Photography with Asymmetric Rounded Edges */}
        <div className="lg:col-span-6 relative mt-8 lg:mt-0 flex justify-center">
          
          {/* Outer Photo Frame with rounded top-right and bottom-left organic curvature */}
          <div className="relative w-full max-w-md lg:max-w-none aspect-4/5 overflow-hidden rounded-tr-[80px] md:rounded-tr-[100px] rounded-bl-[80px] md:rounded-bl-[100px] shadow-2xl border-4 border-white/60 group">
            {/* High-resolution beverage photograph representing Beardista Brew's signature iced cup */}
            <img
  src={heroImage}
  alt="Beardista Brew signature iced coffee beverage in sunlight"
  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
  loading="eager"
/>
            {/* Subtle aesthetic gradient vignette */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Decorative Warm Shapes matching the reference design layout */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#fe9836] rounded-2xl mix-blend-multiply opacity-50 blur-lg pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-36 h-36 bg-[#ffdcc3] rounded-3xl mix-blend-multiply opacity-60 pointer-events-none" />
        </div>

      </div>
    </header>
  );
};
