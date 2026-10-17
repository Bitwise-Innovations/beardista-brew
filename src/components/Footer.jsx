import React from 'react';

/**
 * Footer component renders the bottom site information.
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle routing (e.g., to the admin portal)
 */
export const Footer = ({ onNavigate }) => {
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

          {/* Intellectual Property & Copyright Notice with Hidden Padlock */}
          <div className="flex items-center gap-3 pt-4">
            <p className="text-[#FFF3E7]/50 text-xs sm:text-sm">
              © 2026 Beardista Brew. All rights reserved.
            </p>
            {/* HIDDEN ADMIN PADLOCK */}
            {onNavigate && (
              <button 
                onClick={() => onNavigate('admin-login')}
                className="text-[#FFF3E7]/20 hover:text-[#E58422] transition-colors cursor-pointer"
                title="Staff Login"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </button>
            )}
          </div>
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