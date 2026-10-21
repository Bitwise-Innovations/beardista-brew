import React from 'react';

/**
 * WhatsBrewing component renders two prominent showcase feature modules.
 * Always shown as 2 columns (compact on mobile, roomier on tablet/desktop).
 * @param {Object} props - Component properties
 * @param {Object} props.data - Data object containing event and mustTry specifications
 * @param {Function} props.onRegister - Callback when clicking "REGISTER & JOIN"
 * @param {Function} props.onViewTsamporado - Callback when clicking "VIEW DETAILS" on Tsamporado
 */
export const WhatsBrewing = ({ data, onRegister, onViewTsamporado }) => {
  return (
    <section className="py-10 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-16 bg-[#19244E] border-t border-black/10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto text-center">

        {/* Section Headline */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#FFF3E7] mb-6 sm:mb-12 lg:mb-16 uppercase tracking-wide sm:tracking-widest">
          WHAT'S BREWING
        </h2>

        {/* 2 columns at every screen size; minmax(0,1fr) stops text from stretching the columns */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-12">

          {/* Card 1: Featured Community Event (Latte Art Throwdown) */}
          <div className="relative min-w-0 bg-[#FFF3E7] p-4 sm:p-6 lg:p-12 rounded-xl sm:rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#D97706]/40 transition-all duration-300">
            <div className="space-y-1.5 sm:space-y-3 lg:space-y-4">
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#D97706] block">
                {data.event.tag}
              </span>

              <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-[#19244E] leading-tight break-words">
                {data.event.title}
              </h3>

              <p className="text-[11px] sm:text-sm lg:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                {data.event.description}
              </p>
            </div>

            <div className="mt-4 sm:mt-6 lg:mt-8">
              <button
                onClick={onRegister}
                className="inline-flex items-center whitespace-nowrap px-3 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 bg-[#D97706] hover:bg-[#b45309] text-white text-[9px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider rounded-sm transition-opacity shadow-md group cursor-pointer"
              >
                <span>{data.event.buttonLabel}</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform"
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

          {/* Card 2: Seasonal Menu Feature (Tsamporado) */}
          <div className="relative min-w-0 bg-[#FFF3E7] p-4 sm:p-6 lg:p-12 rounded-xl sm:rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#EA580C]/40 transition-all duration-300">
            <div className="space-y-1.5 sm:space-y-3 lg:space-y-4">
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#EA580C] block">
                {data.mustTry.tag}
              </span>

              <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-[#19244E] leading-tight break-words">
                {data.mustTry.title}
              </h3>

              <p className="text-[11px] sm:text-sm lg:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                {data.mustTry.description}
              </p>
            </div>

            <div className="mt-4 sm:mt-6 lg:mt-8">
              <button
                onClick={onViewTsamporado}
                className="inline-flex items-center whitespace-nowrap px-3 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white text-[9px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider rounded-sm transition-opacity shadow-md group cursor-pointer"
              >
                <span>{data.mustTry.buttonLabel}</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform"
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

        </div>
      </div>
    </section>
  );
};
