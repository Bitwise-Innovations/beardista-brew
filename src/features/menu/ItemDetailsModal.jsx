import React from 'react';

/**
 * ItemDetailsModal component displays the deep specification for a menu item.
 * Standardized to uniform dimensions matching the Stubble visual reference.
 * 
 * @param {Object} props - Component properties
 * @param {Object|null} props.item - Currently selected item, or null if modal is closed
 * @param {Function} props.onClose - Callback to dismiss the modal dialog
 */
export const ItemDetailsModal = ({ item, onClose }) => {
  // Guard clause: Render nothing if no item is selected to minimize DOM overhead
  if (!item) return null;

  // Determine if item is food or drink to adapt the description section header
  const isFood = item.category === 'Pasta' || item.category === 'Food' || item.category === 'Rice' || item.category === 'Salad';
  const aboutHeading = isFood ? 'ABOUT THIS ITEM' : 'ABOUT THIS DRINK';

  // Normalize flavor profile array from item data or fallback gracefully
  let flavorTags = [];
  if (Array.isArray(item.flavorProfile) && item.flavorProfile.length > 0) {
    flavorTags = item.flavorProfile;
  } else if (typeof item.flavorProfile === 'string') {
    flavorTags = item.flavorProfile.split(',').map((s) => s.trim().toUpperCase());
  } else if (item.details && item.details.tastingNotes) {
    flavorTags = item.details.tastingNotes.split(',').map((s) => s.trim().toUpperCase());
  } else {
    // Default signature profile matching reference image
    flavorTags = ['ROBUST', 'SMOOTH'];
  }

  // Normalize contains / allergen information
  const containsInfo = item.contains || 
    (item.details && item.details.allergens) || 
    (isFood ? 'GLUTEN, DAIRY' : 'COFFEE');

  return (
    // Fixed backdrop overlay with subtle blur
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Dialog Card: Uniform fixed dimensions matching the Stubble reference */}
      <div
        className="bg-white w-full max-w-215 md:h-140 rounded-3xl overflow-hidden shadow-2xl border border-black/5 flex flex-col md:flex-row max-h-[92dvh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()} // Prevent accidental dismissal on card clicks
      >
        
        {/* ================================================================== */}
        {/* LEFT PANEL: High-Resolution Product Photograph (Fixed 50% width)   */}
        {/* ================================================================== */}
        <div className="w-full md:w-1/2 h-64 sm:h-72 md:h-full relative bg-neutral-900 shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Subtle gradient vignette on mobile viewports */}
          <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none md:hidden" />
        </div>

        {/* ================================================================== */}
        {/* RIGHT PANEL: Drink Name, Price, Description, Flavor, and Contains  */}
        {/* ================================================================== */}
        <div className="w-full md:w-1/2 h-full p-6 sm:p-8 md:p-10 flex flex-col justify-start overflow-y-auto bg-white">
          
          {/* Top Row: Orange Close Button positioned at the top right */}
          <div className="flex justify-end mb-3 shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-md shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Close details"
            >
              <span className="text-sm leading-none">✕</span>
            </button>
          </div>

          {/* Product Title: Ultra-bold navy uppercase */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#19244E] tracking-tight uppercase leading-none mb-2 font-display">
            {item.name}
          </h2>

          {/* Price Tag in Bold Navy */}
          <div className="text-2xl sm:text-3xl font-extrabold text-[#19244E] mb-5">
            {item.price}
          </div>

          {/* Dashed Horizontal Divider Line matching reference image */}
          <div className="w-full border-b border-dashed border-neutral-300 mb-6 shrink-0" />

          {/* Section 1: ABOUT THIS DRINK / ITEM */}
          <div className="mb-6">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2.5">
              {aboutHeading}
            </h4>
            <p className="text-sm sm:text-base text-[#111111]/85 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Section 2: FLAVOR PROFILE (Star-badged peach chips) */}
          <div className="mb-6">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2.5">
              FLAVOR PROFILE
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {flavorTags.map((flavor, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#fde2cb] text-[#e87823] text-xs font-extrabold uppercase tracking-wider rounded-full shadow-2xs"
                >
                  <span className="text-[11px] leading-none">★</span>
                  <span>{flavor}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: CONTAINS (Component / Allergen declaration) */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#19244E] mb-2">
              CONTAINS
            </h4>
            <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#19244E]">
              {containsInfo}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ItemDetailsModal;
