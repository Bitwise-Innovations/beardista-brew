import React from 'react';
import heroImage from '../assets/beardista_home.jpg';

/**
 * Hero component displaying the main brand headline and visual anchor.
 * @param {Object} props Component properties
 * @param {Function} props.onExploreMenu Handler to scroll to the customer favorites menu
 */
export const Hero = ({ onExploreMenu }) => {
  return (
    // Outer section container aligned with wide navbar margins
    <header className="relative min-h-[calc(100vh-80px)] flex items-center bg-[#FFF3E7] px-4 sm:px-8 lg:px-12 py-10 lg:py-14 overflow-hidden caret-transparent select-none">
      
      {/* Wide 1600px Grid Container */}
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10 items-center">
        
        {/* Left Column (7 cols): Badge, Massive Headline, Cafe Info, and CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start z-20">
          
          {/* Eyebrow Icon + Text Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full bg-[#ffdcc3]/60 border border-[#E58422]/30 text-[#19244E]">
            <svg
              className="w-4 h-4 text-[#E58422] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
            <span className="font-label-md text-xs sm:text-sm tracking-wide text-[#19244E]">
              Your alfresco cafe in the midst of the city.
            </span>
          </div>

          {/* Massive Display Title */}
          <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-[6.25rem] xl:text-[7.25rem] text-[#19244E] leading-[0.98] tracking-tight mb-8 uppercase">
            BREW ME <br />
            TO THE <br />
            <span className="text-[#E58422]">HORIZON.</span>
          </h1>

          {/* Location & Operating Hours Bar (Now above the button) */}
          <div className="mb-9 py-5 border-y border-[#19244E]/15 w-full max-w-xl flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 text-[#19244E]">
            
            {/* Location Item */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-[#ffdcc3]/70 text-[#E58422] shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p className="font-label-sm uppercase tracking-wider text-[#19244E]/60 mb-0.5">
                  Location
                </p>
                <p className="font-body-md font-semibold text-[#19244E]">
                  2837 Yellow Bell, Caloocan City
                </p>
              </div>
            </div>

            {/* Subtle Vertical Divider on Desktop */}
            <div className="hidden sm:block w-px h-10 bg-[#19244E]/15" />

            {/* Opening Hours Item */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-[#ffdcc3]/70 text-[#E58422] shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-label-sm uppercase tracking-wider text-[#19244E]/60 mb-0.5">
                  Open Daily
                </p>
                <p className="font-body-md font-semibold text-[#19244E]">
                  4:00 PM – 12:00 AM
                </p>
              </div>
            </div>

          </div>

          {/* Primary Action Button (Now placed at the bottom) */}
          <button
            onClick={onExploreMenu}
            className="inline-flex items-center px-9 py-4.5 bg-[#fe9836] hover:bg-[#E58422] text-white font-semibold text-sm sm:text-base uppercase tracking-wider rounded-sm transition-all duration-200 group shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>EXPLORE THE MENU</span>
            <svg
              className="w-4 h-4 ml-2.5 group-hover:translate-x-1.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

        </div>

        {/* Right Column (5 cols): High Impact Editorial Photography */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end w-full">
          
          {/* Expanded Wrapper for Hero Image */}
          <div className="relative w-full max-w-[500px] lg:max-w-[580px] xl:max-w-[640px]">
            
            {/* Decorative Warm Shapes placed BEHIND the photo frame */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#fe9836]/40 rounded-3xl blur-2xl z-0 pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#ffdcc3] rounded-tr-[50px] rounded-bl-[50px] z-0 pointer-events-none" />

            {/* Outer Photo Frame */}
            <div className="relative z-10 w-full aspect-[4/5] max-h-[660px] overflow-hidden rounded-tr-[90px] md:rounded-tr-[110px] rounded-bl-[90px] md:rounded-bl-[110px] shadow-2xl border-[5px] border-white/85 group">
              <img
                src={heroImage}
                alt="Beardista Brew signature iced coffee beverage in sunlight"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};