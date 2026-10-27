import React, { useEffect, useRef, useState } from 'react';

// Cards are shown in this order: 1st Coffee, 2nd Non-Coffee, 3rd Food
const ORDER = ['coffee', 'non-coffee', 'food'];

// "Non Coffee", "non_coffee" and "Non-Coffee" all become "non-coffee"
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[\s_]+/g, '-');

// Pill colors per category (same look as the phone design)
const PILL_STYLES = {
  coffee: 'bg-[#F3E1CE] text-[#6B4A2B]',
  'non-coffee': 'bg-[#FDE2E4] text-[#C0273D]',
  food: 'bg-[#E3F1D9] text-[#3B6B22]',
};

/**
 * CustomerFavorites renders favorite items in one swipeable row, ordered
 * Coffee, then Non-Coffee, then Food (based on each item's `category` field).
 * @param {Object} props - Component properties
 * @param {Array} props.items - Array of featured items from menuData
 * @param {Function} props.onViewDetails - Callback to open the view-only detail modal
 */
export const CustomerFavorites = ({ items = [], onViewDetails }) => {
  const trackRef = useRef(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Sort by category order (Coffee -> Non-Coffee -> Food). Anything else goes last.
  const rank = (item) => {
    const index = ORDER.indexOf(normalize(item.category));
    return index === -1 ? ORDER.length : index;
  };
  const visibleItems = [...items].sort((a, b) => rank(a) - rank(b));

  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  };

  // Re-check the arrows whenever the items change
  useEffect(() => {
    updateEdges();
  }, [items.length]);

  // Recalculate arrow state when the window size changes (phone <-> desktop)
  useEffect(() => {
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, []);

  // Arrow buttons scroll one card at a time
  const scrollByCard = (direction) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  const arrowClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-[#19244E]/20 text-[#19244E] transition-colors cursor-pointer hover:bg-[#19244E] hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#19244E]';

  return (
    <section className="border-t border-black/10 bg-[#FFF3E7] py-12 md:py-24" id="menu-section">
      <div className="mx-auto max-w-7xl">

        {/* Heading + arrows */}
        <div className="mb-6 flex items-center justify-between gap-4 px-5 sm:px-8 md:mb-10 md:px-16">
          <h2 className="border-l-4 border-[#E58422] pl-3 text-xl font-extrabold uppercase tracking-wide text-[#19244E] sm:text-3xl md:pl-4 md:text-5xl md:tracking-widest">
            CUSTOMER FAVORITES
          </h2>

          <div className="flex shrink-0 gap-2">
            <button onClick={() => scrollByCard(-1)} disabled={atStart} aria-label="Previous items" className={`${arrowClass} hidden sm:flex`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button onClick={() => scrollByCard(1)} disabled={atEnd} aria-label="Next items" className={arrowClass}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swipeable row: snaps one card at a time. 1 card on phones, 2 on tablets, 3 on desktop */}
        {visibleItems.length === 0 ? (
          <p className="mx-5 rounded-2xl border border-black/10 bg-white/60 p-10 text-center text-sm text-[#19244E] sm:mx-8 md:mx-16">
            No favorites yet.
          </p>
        ) : (
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 md:scroll-px-16 md:px-16 lg:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="group flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-300 hover:border-[#E58422]/60 hover:shadow-xl sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                {/* Image */}
                <div className="p-3 pb-0">
                  <div
                    className="relative h-56 cursor-pointer overflow-hidden rounded-2xl bg-gray-100 sm:h-64 lg:h-80"
                    onClick={() => onViewDetails(item)}
                  >
                    <img
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="flex grow flex-col p-5 md:p-6">
                  <span
                    className={`mb-3 inline-block w-max rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                      PILL_STYLES[normalize(item.category)] || 'bg-[#FFF3E7] text-[#111111]'
                    }`}
                  >
                    {item.category}
                  </span>

                  <h3
                    onClick={() => onViewDetails(item)}
                    className="mb-2 cursor-pointer text-lg font-bold uppercase text-[#19244E] transition-colors hover:text-[#E58422] md:text-2xl"
                  >
                    {item.name}
                  </h3>

                  <p className="mb-5 line-clamp-3 grow text-sm leading-relaxed text-[#111111]/80 md:text-base">
                    {item.description}
                  </p>

                  <div className="mt-auto border-t border-black/5 pt-3">
                    <button
                      onClick={() => onViewDetails(item)}
                      className="inline-flex cursor-pointer items-center text-xs font-bold uppercase tracking-wider text-[#E58422] transition-all hover:opacity-80 group-hover:translate-x-1.5"
                    >
                      <span>VIEW DETAILS</span>
                      <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
