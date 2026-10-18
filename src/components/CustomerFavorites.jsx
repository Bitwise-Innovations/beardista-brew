import React from 'react';

/**
 * CustomerFavorites component renders the top 3 best-selling items.
 * @param {Object} props - Component properties
 * @param {Array} props.items - Array of featured items from menuData
 * @param {Function} props.onViewDetails - Callback to open the view-only detail modal
 */
export const CustomerFavorites = ({ items, onViewDetails }) => {
  return (
    <section className="py-16 md:py-24 bg-[#FFF3E7] px-6 md:px-16 border-t border-black/10" id="menu-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] mb-12 uppercase tracking-widest border-l-4 border-[#E58422] pl-4">
          CUSTOMER FAVORITES
        </h2>

        {/* 3-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            // Individual Product Card with subtle border and rounded top-right corner
            <div
              key={item.id}
              className="group relative bg-white border border-black/10 overflow-hidden hover:border-[#E58422]/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-tr-3xl"
            >
              {/* Product Image Container with hover zoom effect */}
              <div
                className="relative h-80 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => onViewDetails(item)}
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>

              {/* Card Body Content */}
              <div className="p-6 flex flex-col grow">
                {/* Category Pill Badge (Coffee, Non-Coffee, Food) */}
                <span className="inline-block px-3 py-1 bg-[#FFF3E7] text-[#111111] text-xs font-semibold rounded-full w-max mb-4">
                  {item.category}
                </span>

                {/* Product Name Title */}
                <h3
                  onClick={() => onViewDetails(item)}
                  className="text-2xl font-bold text-[#19244E] mb-2 cursor-pointer hover:text-[#E58422] transition-colors"
                >
                  {item.name}
                </h3>

                {/* Descriptive Teaser */}
                <p className="text-sm md:text-base text-[#111111]/80 mb-6 grow leading-relaxed">
                  {item.description}
                </p>

                {/* View-Only Details Link */}
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

      </div>
    </section>
  );
};
