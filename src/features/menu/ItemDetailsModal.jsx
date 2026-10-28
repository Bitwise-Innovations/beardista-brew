import React, { useEffect } from 'react';

/**
 * ItemDetailsModal: full details for one menu item.
 * Sections with no data are hidden instead of showing placeholder text.
 */
export const ItemDetailsModal = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  let flavorTags = [];
  if (Array.isArray(item.flavorProfile)) {
    flavorTags = item.flavorProfile;
  } else if (typeof item.flavorProfile === 'string' && item.flavorProfile.trim()) {
    flavorTags = item.flavorProfile.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
  } else if (item.details?.tastingNotes) {
    flavorTags = item.details.tastingNotes.split(',').map((s) => s.trim().toUpperCase());
  }

  const containsInfo = item.contains || item.details?.allergens || '';
  const temperatures = item.temperatures ?? [];
  const addOns = item.addOns ?? [];
  const unavailable = item.isAvailable === false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="bg-white w-full max-w-215 md:h-140 rounded-3xl overflow-hidden shadow-2xl border border-black/5 flex flex-col md:flex-row max-h-[92dvh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT: photo */}
        <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-full relative bg-neutral-900 shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover ${unavailable ? 'grayscale' : ''}`}
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none md:hidden" />
        </div>

        {/* RIGHT: details */}
        <div className="w-full md:w-1/2 h-full p-6 sm:p-8 md:p-10 flex flex-col justify-start overflow-y-auto bg-white">
          <div className="flex justify-end mb-3 shrink-0">
            <button
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold rounded-md shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Close details"
            >
              <span className="text-sm leading-none">✕</span>
            </button>
          </div>

          {item.category && (
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E58422] mb-1">{item.category}</p>
          )}

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#19244E] tracking-tight uppercase leading-none mb-2 font-display">
            {item.name}
          </h2>

          <div className="flex flex-wrap items-baseline gap-3 mb-5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#19244E]">{item.price}</span>
            {item.calories != null && (
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{item.calories} kcal</span>
            )}
            {unavailable && (
              <span className="rounded-sm bg-neutral-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                {item.status || 'Unavailable'}
              </span>
            )}
          </div>

          <div className="w-full border-b border-dashed border-neutral-300 mb-6 shrink-0" />

          {item.description && (
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2.5">ABOUT THIS ITEM</h4>
              <p className="text-sm sm:text-base text-[#111111]/85 leading-relaxed font-normal">{item.description}</p>
            </div>
          )}

          {temperatures.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2.5">SERVED</h4>
              <div className="flex flex-wrap gap-2">
                {temperatures.map((temperature) => (
                  <span
                    key={temperature}
                    className="rounded-full border border-[#19244E]/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#19244E]"
                  >
                    {temperature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {flavorTags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2.5">FLAVOR PROFILE</h4>
              <div className="flex flex-wrap gap-2.5">
                {flavorTags.map((flavor) => (
                  <span
                    key={flavor}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#fde2cb] text-[#e87823] text-xs font-extrabold uppercase tracking-wider rounded-full shadow-2xs"
                  >
                    <span className="text-[11px] leading-none">★</span>
                    <span>{flavor}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {addOns.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2.5">ADD-ONS</h4>
              <ul className="space-y-1.5">
                {addOns.map((addOn) => (
                  <li key={addOn.name} className="flex justify-between gap-3 text-sm text-[#111111]/85">
                    <span>{addOn.name}</span>
                    {addOn.price != null && (
                      <span className="font-bold text-[#19244E]">+₱{Number(addOn.price)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {containsInfo && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2">CONTAINS</h4>
              <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#19244E]">{containsInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;