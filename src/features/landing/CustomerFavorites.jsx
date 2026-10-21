import React, { useRef, useState } from 'react';

/**
 * CustomerFavorites component renders the top 3 best-selling items.
 * Below the `lg` breakpoint the cards form a swipeable carousel (scroll-snap);
 * on desktop they sit in a 3-column grid.
 * @param {Object} props - Component properties
 * @param {Array} props.items - Array of featured items from menuData
 * @param {Function} props.onViewDetails - Callback to open the view-only detail modal
 */
export const CustomerFavorites = ({ items, onViewDetails }) => {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  // Work out which card is currently snapped so the dots can follow along
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || !el.firstElementChild) return;
    const cardWidth = el.firstElementChild.offsetWidth + 16; // card + gap-4
    setActive(Math.round(el.scrollLeft / cardWidth));
  };

  // Tap a dot to jump to that card
  const scrollToCard = (index) => {
    const el = scrollerRef.current;
    if (!el || !el.children[index]) return;
    el.scrollTo({ left: el.children[index].offsetLeft - el.offsetLeft - 16, behavior: 'smooth' });
  };

  return (
    <section
      className="py-12 sm:py-16 lg:py-24 bg-[#FFF3E7] px-4 sm:px-8 lg:px-16 border-t border-black/10 overflow-x-hidden"
      id="menu-section"
    >
      <div className="max-w-7xl mx-auto w-full">

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#19244E] mb-8 sm:mb-12 uppercase tracking-wide sm:tracking-widest border-l-4 border-[#E58422] pl-4 break-words">
          CUSTOMER FAVORITES
        </h2>

        {/* Swipe carousel on mobile/tablet, 3-column grid on desktop.
            -mx / px lets cards slide edge-to-edge while still lining up with the heading. */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth
            -mx-4 px-4 scroll-pl-4 sm:-mx-8 sm:px-8 sm:scroll-pl-8 pb-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:mx-0 lg:px-0 lg:scroll-pl-0 lg:pb-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible
          "
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative shrink-0 snap-start w-[68%] sm:w-[42%] lg:w-auto min-w-0 bg-white border border-black/10 overflow-hidden hover:border-[#E58422]/60 hover:shadow-xl transition-all duration-300 flex flex-col rounded-tr-3xl"
            >
              {/* Product Image */}
              <div
                className="relative h-36 sm:h-44 lg:h-72 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => onViewDetails(item)}
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Card Body Content */}
              <div className="p-3 sm:p-4 lg:p-6 flex flex-col grow">
                <span className="inline-block px-3 py-1 bg-[#FFF3E7] text-[#111111] text-xs font-semibold rounded-full w-max mb-3 sm:mb-4">
                  {item.category}
                </span>

                <h3
                  onClick={() => onViewDetails(item)}
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-[#19244E] mb-1.5 cursor-pointer hover:text-[#E58422] transition-colors break-words"
                >
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm lg:text-base text-[#111111]/80 mb-4 sm:mb-5 grow leading-relaxed line-clamp-3 lg:line-clamp-none">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-black/5 mt-auto">
                  <button
                    onClick={() => onViewDetails(item)}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#E58422] hover:opacity-80 group-hover:translate-x-1.5 transition-all cursor-pointer"
                  >
                    <span>VIEW DETAILS</span>
                    <svg
                      className="w-3.5 h-3.5 ml-1.5"
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
          ))}
        </div>

        {/* Slide indicator dots (hidden on desktop where all 3 cards are visible) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to ${item.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i ? 'w-6 bg-[#E58422]' : 'w-2 bg-[#19244E]/25'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
