// ==============================================================================
// FILE: src/components/WhatsBrewing.jsx
// PURPOSE: High-contrast Dark Navy block highlighting ongoing events
//          and featured specialty creations (Latte Art Throwdown and Tsamporado).
// ACADEMIC NOTE:
// Provides strong visual rhythm through tonal inversion (Navy #19244E canvas
// populated with high-contrast warm cream #FFF3E7 cards).
// ==============================================================================

import React from 'react';

/**
 * WhatsBrewing component renders two prominent showcase feature modules.
 * @param {Object} props - Component properties
 * @param {Object} props.data - Data object containing event and mustTry specifications
 * @param {Function} props.onRegister - Callback when clicking "REGISTER & JOIN"
 * @param {Function} props.onViewTsamporado - Callback when clicking "VIEW DETAILS" on Tsamporado
 */
export const WhatsBrewing = ({ data, onRegister, onViewTsamporado }) => {
  return (
    // Section wrapper with rich Navy canvas and vertical breathing room
    <section className="py-16 md:py-24 px-6 md:px-16 bg-[#19244E] border-t border-black/10">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section Headline */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#FFF3E7] mb-12 md:mb-16 uppercase tracking-widest">
          WHAT'S BREWING
        </h2>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Card 1: Featured Community Event (Latte Art Throwdown) */}
          <div className="relative bg-[#FFF3E7] p-8 md:p-12 rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#D97706]/40 transition-all duration-300">
            <div className="space-y-4">
              {/* Event Subtitle Badge */}
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] block">
                {data.event.tag}
              </span>

              {/* Event Title */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">
                {data.event.title}
              </h3>

              {/* Event Summary Description */}
              <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                {data.event.description}
              </p>
            </div>

            {/* Action Button: Opens the event details modal */}
            <div className="mt-8">
              <button
                onClick={onRegister}
                className="inline-flex items-center px-6 py-3.5 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-opacity shadow-md group cursor-pointer"
              >
                <span>{data.event.buttonLabel}</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
          <div className="relative bg-[#FFF3E7] p-8 md:p-12 rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#EA580C]/40 transition-all duration-300">
            <div className="space-y-4">
              {/* Must Try Subtitle Badge */}
              <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C] block">
                {data.mustTry.tag}
              </span>

              {/* Feature Title */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">
                {data.mustTry.title}
              </h3>

              {/* Feature Description */}
              <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                {data.mustTry.description}
              </p>
            </div>

            {/* Action Button: Opens the view-only item detail modal */}
            <div className="mt-8">
              <button
                onClick={onViewTsamporado}
                className="inline-flex items-center px-6 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-opacity shadow-md group cursor-pointer"
              >
                <span>{data.mustTry.buttonLabel}</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
