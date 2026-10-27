import React from 'react';

/**
 * WhyChooseUs component renders the four core pillars of the cafe.
 * 2x2 grid on mobile, 4 across on desktop; sizes scale up with the screen.
 * @param {Object} props - Component properties
 * @param {Array} props.pillars - Array of brand pillars from menuData
 */
export const WhyChooseUs = ({ pillars }) => {
  // Icon size scales with the screen
  const iconClass = 'w-8 h-8 sm:w-12 sm:h-12 text-[#E58422]';

  // SVG Icon Renderer for clean, crisp vector rendering matching the reference design
  const renderIcon = (type) => {
    switch (type) {
      case 'coffee':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </svg>
        );
      case 'sparkle':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'users':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-[#FFF3E7] px-4 sm:px-8 lg:px-16 text-[#111111] border-t border-black/10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Centered Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-8 sm:mb-12 md:mb-16 text-center uppercase tracking-wide sm:tracking-widest text-[#19244E]">
          WHY CHOOSE BEARDISTA?
        </h2>

        {/* 2x2 on mobile/tablet, 4 across on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 md:gap-12">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="min-w-0 flex flex-col items-center text-center">

              {/* Icon Container with subtle hover animation */}
              <div className="w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-6 flex items-center justify-center transition-transform hover:scale-110">
                {renderIcon(pillar.iconType)}
              </div>

              {/* Pillar Title */}
              <h3 className="text-base sm:text-xl md:text-2xl mb-2 sm:mb-4 font-bold text-[#111111]">
                {pillar.title}
              </h3>

              {/* Pillar Explanation */}
              <p className="text-xs sm:text-sm md:text-base text-[#111111]/80 leading-relaxed max-w-xs">
                {pillar.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
