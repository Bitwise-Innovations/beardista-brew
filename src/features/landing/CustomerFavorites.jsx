import React from 'react';

/**
 * CustomerFavorites: up to 3 real menu items on the home page.
 * @param {Array} props.items - Display-shaped menu items (name, category, price, image, description)
 * @param {Function} props.onViewDetails - Opens the item details pop-up
 */
export const CustomerFavorites = ({ items = [], onViewDetails }) => {
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 bg-[#FFF3E7] border-t border-black/10" id="favorites-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E58422] block mb-2">
            Loved by our regulars
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] uppercase tracking-widest">
            CUSTOMER FAVORITES
          </h2>
        </div>

        {/* 2 per row on phones, 3 on larger screens */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewDetails?.(item)}
              aria-label={`View details for ${item.name}`}
              className="group bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="relative h-32 sm:h-56 bg-neutral-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {item.category && (
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 rounded-sm bg-white/90 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#19244E] shadow-sm">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-3 sm:p-5 flex flex-col grow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                  <h3 className="text-sm sm:text-lg font-bold text-[#19244E] group-hover:text-[#E58422] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  {item.price && (
                    <span className="self-start bg-[#E58422] text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">
                      {item.price}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="hidden sm:block text-xs text-neutral-600 leading-relaxed line-clamp-2 grow">
                    {item.description}
                  </p>
                )}

                <span className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#E58422] uppercase tracking-wider">
                  <span>View Details</span>
                  <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFavorites;