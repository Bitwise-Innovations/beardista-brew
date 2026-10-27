import React from 'react';
import { formatEventWhen } from '../../backend/mappers/eventMapper';

const ArrowIcon = () => (
  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

/**
 * WhatsBrewing: the featured event (live from Supabase) and the Must Try card.
 */
export const WhatsBrewing = ({ data, onRegister, onViewTsamporado }) => {
  const event = data.event;
  const when = formatEventWhen(event?.startTime);

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 bg-[#19244E] border-t border-black/10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#FFF3E7] mb-12 md:mb-16 uppercase tracking-widest">
          WHAT'S BREWING
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Card 1: Featured event */}
          <div className="relative bg-[#FFF3E7] rounded-2xl flex flex-col text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#D97706]/40 transition-all duration-300">
            {event?.image && (
              <img src={event.image} alt="" className="h-40 md:h-48 w-full object-cover" loading="lazy" />
            )}
            <div className="p-8 md:p-12 flex flex-col justify-between items-start grow">
              {event ? (
                <>
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] block">{event.tag}</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">{event.title}</h3>
                    {(when || event.location) && (
                      <p className="text-xs font-bold uppercase tracking-wider text-[#19244E]/70">
                        {[when, event.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed line-clamp-4">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={onRegister}
                      className="inline-flex min-h-11 items-center px-6 py-3.5 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md group cursor-pointer"
                    >
                      <span>{event.buttonLabel}</span>
                      <ArrowIcon />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] block">Community Events</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">Nothing scheduled yet</h3>
                  <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                    Our next throwdown or cupping is still brewing. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Must Try (connected in Step 32) */}
          <div className="relative bg-[#FFF3E7] p-8 md:p-12 rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#EA580C]/40 transition-all duration-300">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C] block">{data.mustTry.tag}</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">{data.mustTry.title}</h3>
              <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed">{data.mustTry.description}</p>
            </div>
            <div className="mt-8">
              <button
                onClick={onViewTsamporado}
                className="inline-flex min-h-11 items-center px-6 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md group cursor-pointer"
              >
                <span>{data.mustTry.buttonLabel}</span>
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};