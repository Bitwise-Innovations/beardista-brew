import React from 'react';
import storyImg from '@/assets/our_story.jpg';
/**
 * OurStorySection component renders the home page preview of the cafe narrative.
 * @param {Object} props
 * @param {Function} props.onReadMore - Triggers navigation to the dedicated OurStory page
 */
export const OurStorySection = ({ onReadMore }) => {
  return (
    // Section container with warm cream background
    <section className="py-16 md:py-24 bg-[#FFF3E7] px-6 md:px-16" id="story-section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Cafe Atmosphere Image */}
        <div className="order-2 lg:order-1 relative h-95 sm:h-115 lg:h-130 rounded-2xl overflow-hidden shadow-2xl border border-black/10 group">
          <img
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            alt="Warm community atmosphere of Beardista Brew cafe"
            src={storyImg}
            loading="lazy"
          />
          {/* Subtle contrast gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Column: Editorial Text Block */}
        <div className="order-1 lg:order-2 flex flex-col justify-center lg:pl-6 space-y-6">
          {/* Section Heading with orange label and accent bar */}
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-[#E58422] uppercase mb-3">
              SINCE DAY ONE
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] uppercase tracking-widest leading-tight">
              OUR STORY
            </h2>
            <div className="w-16 h-1 rounded-full bg-[#E58422] mt-4" />
          </div>

          {/* Lead Quote: first sentence of the brand narrative */}
          <p className="text-lg md:text-2xl font-semibold text-[#19244E] leading-snug border-l-4 border-[#E58422] pl-4">
            Beardista Brew isn't just about exceptional coffee; it's about the connections forged over a steaming cup.
          </p>

          {/* Core Brand Narrative Copy (Exact text from reference image) */}
          <p className="text-base md:text-lg text-[#111111]/80 leading-relaxed font-normal">
            We started with a simple belief: a cafe should be the heart of a neighborhood, a place where the community
            gathers, ideas are shared, and everyone feels like a regular from their first visit. We source our beans ethically,
            roast them locally, and pour our passion into every detail, ensuring your experience is as rich and nuanced as
            our signature blends.
          </p>

          {/* Interactive Trigger: Navigates to the complete OurStory page */}
          <div>
            <button
              onClick={onReadMore}
              className="inline-flex items-center text-sm md:text-base font-bold uppercase tracking-wider text-[#E58422] hover:opacity-80 group transition-all cursor-pointer"
            >
              <span>READ MORE ABOUT US</span>
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
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
