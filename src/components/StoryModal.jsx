// ==============================================================================
// FILE: src/components/StoryModal.jsx
// PURPOSE: Expanded narrative modal presenting the roastery origin, ethical bean sourcing,
//          and community focus of Beardista Brew in Caloocan City.
// ACADEMIC NOTE:
// Provides historical depth to the customer-facing interface, detailing
// the technical and social values that substantiate the brand pillars.
// ==============================================================================

import React from 'react';

/**
 * StoryModal component displays the comprehensive roastery and neighborhood history.
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Dismiss callback
 */
export const StoryModal = ({ isOpen, onClose }) => {
  // Guard condition: Do not render when closed
  if (!isOpen) return null;

  return (
    // Fixed backdrop overlay with blur
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-[#FFF3E7] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-black/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Imagery */}
        <div className="relative h-48 sm:h-60 bg-gray-900 shrink-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABEC-4YMe9KuI2_3p2rngjkOCN9kRy6aHAhhS1IJnFoZePxPGaWltctHSa4ccKTzcvKwy6cTlSeAQd_Kx-1TnJxPnWdvUkktJEj2NmoKG393ywYLQM15s0P9Sb95eKHnYUhwZ0gzeUrHIywO61wXui5_NL-uLbvQusgfoKsYay7wSln88PMfmSRh5p6KOdCTWJwp4NCfRlIQjNj3FgsvyWsT0MzvDWbtX-CPpoTI7jH3G7SiPg8zBG"
            alt="Beardista Brew Roastery Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-widest text-[#E58422] font-bold block mb-1">
              Our Journey &amp; Roastery
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Behind Beardista Brew
            </h3>
          </div>
        </div>

        {/* Scrollable Story Text */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 grow text-[#111111]">
          <div>
            <h4 className="text-xl font-bold text-[#19244E] mb-2">
              Crafted with Precision in Camarin, Caloocan
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-[#111111]/80">
              Beardista Brew began with a dream to bring third-wave specialty coffee culture to North Caloocan. We transformed a modest space in Barangay 174 into a sanctuary where coffee enthusiasts, remote workers, and neighborhood regulars share thoughtful conversations over expertly pulled espresso.
            </p>
          </div>

          {/* Sourcing and Roasting Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-black/10">
              <h5 className="font-bold text-[#19244E] text-sm mb-1">
                Small-Batch Profiling
              </h5>
              <p className="text-xs text-[#111111]/75 leading-relaxed">
                Every batch is profile-roasted in-house to achieve our signature "Dark &amp; Chaotic" flavor—dense body, low acidity, and rich undertones of blueberry and smoke.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-black/10">
              <h5 className="font-bold text-[#19244E] text-sm mb-1">
                Direct Farm Trade
              </h5>
              <p className="text-xs text-[#111111]/75 leading-relaxed">
                We partner with highland cooperatives in Benguet for Filipino Arabica and reputable micro-lots in Brazil, ensuring ethical trade and fresh crop supply.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/10 text-xs sm:text-sm text-[#111111]/80 leading-relaxed">
            <strong className="text-[#19244E] block mb-1">A Space Worth Staying Awhile:</strong>
            We designed our cafe with plenty of natural daylight, accessible charging outlets, dual-band fiber internet, and a pet-friendly veranda so you can relax or work without rush.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-black/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#19244E] hover:bg-opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
          >
            Back to Overview
          </button>
        </div>
      </div>
    </div>
  );
};
