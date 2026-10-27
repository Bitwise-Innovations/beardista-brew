import React from 'react';
import storyImg from '@/assets/our_story.jpg';
/**
 * OurStorySection component renders the home page preview of the cafe narrative.
 * 2 columns at every screen size (text left, image right on mobile; image left on desktop).
 * @param {Object} props
 * @param {Function} props.onReadMore - Triggers navigation to the dedicated OurStory page
 */
export const OurStorySection = ({ onReadMore }) => {
  return (
    // Section container with warm cream background
    <section className="py-10 sm:py-16 md:py-24 bg-[#FFF3E7] px-4 sm:px-8 lg:px-16 overflow-x-hidden" id="story-section">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4 sm:gap-8 lg:gap-16 items-center">

        {/* Image: right on mobile/tablet, left on desktop */}
        <div className="order-2 lg:order-1 min-w-0 relative h-60 sm:h-96 lg:h-130 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-black/10 group">
          <img
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            alt="Warm community atmosphere of Beardista Brew cafe"
            src={storyImg}
            loading="lazy"
          />
          {/* Subtle contrast gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Text: left on mobile/tablet, right on desktop */}
        <div className="order-1 lg:order-2 min-w-0 flex flex-col justify-center lg:pl-6 space-y-3 sm:space-y-6">
          {/* Section Heading */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#19244E] uppercase tracking-wide sm:tracking-widest leading-tight">
            OUR STORY
          </h2>

          {/* Core Brand Narrative Copy */}
          <p className="text-[11px] sm:text-lg text-[#111111] leading-relaxed font-normal">
            Beardista Brew isn't just about exceptional coffee; it's about the connections forged over a steaming cup.
            We started with a simple belief: a cafe should be the heart of a neighborhood, a place where the community
            gathers, ideas are shared, and everyone feels like a regular from their first visit. We source our beans ethically,
            roast them locally, and pour our passion into every detail, ensuring your experience is as rich and nuanced as
            our signature blends.
          </p>

          {/* Interactive Trigger: Navigates to the complete OurStory page */}
          <div>
            <button
              onClick={onReadMore}
              className="inline-flex items-center whitespace-nowrap text-[10px] sm:text-sm md:text-base font-bold uppercase tracking-wide sm:tracking-wider text-[#E58422] hover:opacity-80 group transition-all cursor-pointer"
            >
              <span>READ MORE ABOUT US</span>
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-2 transition-transform"
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
    </section>
  );
};
