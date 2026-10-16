import React from 'react';

/**
 * Footer component renders the bottom site information.
 */
export const Footer = () => {
  return (
    // Outer footer wrapper with Navy canvas (#19244E) and cream typography (#FFF3E7)
    <footer className="bg-[#19244E] text-[#FFF3E7] pt-16 px-6 md:px-16 pb-12 border-t border-white/10" id="contact-section">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Brand, Physical Location, Operating Hours, and Copyright */}
        <div className="space-y-4">
          {/* Brand Name Title */}
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Beardista <br className="hidden sm:inline" />Brew
          </div>

          {/* Physical Cafe Location */}
          <p className="text-[#FFF3E7]/80 text-sm sm:text-base max-w-sm leading-relaxed">
            2837 Yellowbell St., Area C, Brgy. 174 Camarin, Caloocan City
          </p>

          {/* Daily Operating Hours */}
          <p className="text-[#FFF3E7]/80 text-sm sm:text-base">
            Hours: 4:00 PM - 12:00 AM
          </p>

          {/* Intellectual Property & Copyright Notice */}
          <p className="text-[#FFF3E7]/50 text-xs sm:text-sm pt-4">
            © 2026 Beardista Brew. All rights reserved.
          </p>
        </div>

        {/* Right Column: Direct Social & Contact Links */}
        <div className="md:text-right space-y-4">
          {/* Section Headline */}
          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Contact
          </h4>

          {/* Navigation link list */}
          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <a
                href="https://www.facebook.com/Beardistabrew"
                target="_blank"
                rel="noreferrer"
                className="text-[#FFF3E7]/80 hover:text-[#E58422] transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/beardistabrew?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
                className="text-[#FFF3E7]/80 hover:text-[#E58422] transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
