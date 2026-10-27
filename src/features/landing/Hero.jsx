import React from 'react';
import heroImage from '@/assets/beardista_home.jpg';

/**
 * Hero component displaying the main brand headline and visual anchor.
 * Mobile: text on the left, photo on the right (side by side, like the phone design).
 * Tablet / laptop / desktop: the same two columns, scaled up with a bigger headline,
 * a larger photo and more breathing room.
 * @param {Object} props - Component properties
 * @param {Function} props.onExploreMenu - Handler to open the menu
 */
export const Hero = ({ onExploreMenu }) => {
  return (
    <header className="relative flex items-center bg-[#FFF3E7] px-5 py-8 sm:px-8 md:px-16 md:py-16 md:min-h-170 lg:min-h-190 overflow-hidden">
      {/* Always 2 columns: text | photo */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 items-center gap-4 sm:gap-8 lg:gap-16">

        {/* Left column: headline, subtitle, button */}
        <div className="z-20 flex flex-col items-start justify-center space-y-4 sm:space-y-6 md:space-y-8">
          <h1 className="text-2xl font-extrabold leading-[1.15] tracking-[0.1em] text-[#19244E] min-[400px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.08] lg:tracking-tight">
            BREW ME TO <br className="hidden lg:block" />
            THE <br className="hidden lg:block" />
            <span className="text-[#fe9836]">HORIZON.</span>
          </h1>

          <p className="max-w-lg text-[11px] leading-relaxed text-[#1c1b1b] min-[400px]:text-xs sm:text-lg md:text-xl">
            Good coffee, good food, and a place worth staying awhile.
          </p>

          <button
            onClick={onExploreMenu}
            className="group inline-flex cursor-pointer items-center rounded-sm bg-[#fe9836] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:bg-[#e58422] hover:shadow-lg active:scale-95 sm:px-8 sm:py-4 sm:text-sm"
          >
            <span className="sm:hidden">EXPLORE MENU</span>
            <span className="hidden sm:inline">EXPLORE THE MENU</span>
            <svg
              className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5 sm:h-4 sm:w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Right column: photo. Simple rounded on phones, organic curves on larger screens */}
        <div className="relative flex justify-center">
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-white/60 shadow-xl md:aspect-[4/5] md:rounded-none md:rounded-tr-[100px] md:rounded-bl-[100px] md:border-4 md:shadow-2xl">
            <img
              src={heroImage}
              alt="Beardista Brew signature iced coffee beverage in sunlight"
              className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Decorative warm shapes: tablet and up only */}
          <div className="pointer-events-none absolute -bottom-8 -left-8 hidden h-32 w-32 rounded-2xl bg-[#fe9836] opacity-50 mix-blend-multiply blur-lg md:block" />
          <div className="pointer-events-none absolute -right-6 -top-6 hidden h-36 w-36 rounded-3xl bg-[#ffdcc3] opacity-60 mix-blend-multiply md:block" />
        </div>
      </div>
    </header>
  );
};
