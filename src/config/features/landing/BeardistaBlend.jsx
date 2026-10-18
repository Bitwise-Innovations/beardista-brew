import React from 'react';

/**
 * BeardistaBlend component displays technical specifications of the house coffee roast.
 * @param {Object} props - Component properties
 * @param {Array} props.details - Array of roast specifications from menuData
 */
export const BeardistaBlend = ({ details }) => {
  return (
    // Relative container with deep Navy (#19244E) canvas and macro coffee bean backdrop
    <section className="relative min-h-145 flex flex-col justify-center items-center bg-[#19244E] overflow-hidden w-full">
      
      {/* Background macro texture of roasted beans with dark overlay */}
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply pointer-events-none"
        alt="Macro shot of freshly roasted coffee beans"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_aS7M6jb07ROqE1A231SqgHyTRGuhfDUTW5emdGiewuQZfrsqkQEHEn28el5TVXcwZILOSiWfREpweiDtV5xCnH-ZDRaQgfQxl8Qqb1QlZ9EtAFQ93DR1J1kBfZxSPx8-GwCqMYzCW9P_nyO50ofBm89aBlsyDvbAQ9Fi5iFGBiSaeTwUDv9ScEsalcoCWjngcgF7_v35H4yBsUngZDEeWu4mLBg-eQuIM5toMtFuskm5o6-6Jjcj"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-primary/60 pointer-events-none" />

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full px-6 md:px-16 py-16 md:py-24 text-center flex flex-col items-center">
        
        {/* Signature Orange Accent Divider */}
        <div className="w-16 h-1 bg-[#E58422] mb-8" />

        {/* Section Headline */}
        <h2 className="text-3xl md:text-5xl text-white mb-12 tracking-wide uppercase font-extrabold">
          THE BEARDISTA BLEND
        </h2>

        {/* 3 Metric Specification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
          {details.map((item, index) => (
            <div
              key={index}
              className="bg-[#19244E]/40 border border-white/20 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center transition-all hover:border-[#E58422]/50"
            >
              {/* Metric Label in Orange Uppercase */}
              <span className="text-[#E58422] text-xs font-semibold uppercase tracking-widest mb-2 block">
                {item.label}
              </span>

              {/* Metric Value in High-Contrast White */}
              <span className="text-white text-xl md:text-2xl font-bold">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Coffee Cup Outline Icon matching reference image */}
        <div className="mt-12 text-[#E58422]">
          <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </svg>
        </div>

      </div>
    </section>
  );
};
