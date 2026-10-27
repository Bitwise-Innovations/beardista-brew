import React from 'react';
import { MapPin, Clock } from 'lucide-react';

/**
 * Footer component renders the bottom site information.
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle routing (e.g., to the admin portal)
 */
export const Footer = ({ onNavigate }) => {
  // Page links shown in the Explore column
  const exploreLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Menu', page: 'menu' },
    { label: 'Our Story', page: 'story' },
  ];

  return (
    // Outer footer wrapper with Navy canvas (#19244E) and cream typography (#FFF3E7)
    <footer className="bg-[#19244E] text-[#FFF3E7] pt-14 pb-8 px-6 md:px-16 border-t border-white/10" id="contact-section">
      <div className="max-w-6xl mx-auto">

        {/* Top Part: Brand, Visit Us, Explore */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* Column 1: Brand Name and Tagline */}
          <div>
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Beardista Brew
            </div>
            <div className="w-12 h-1 rounded-full bg-[#E58422] mt-3 mx-auto md:mx-0" />
            <p className="mt-4 text-sm text-[#FFF3E7]/70">
              Crafted coffee, community first.
            </p>
          </div>

          {/* Column 2: Physical Location and Operating Hours */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E58422] uppercase mb-4">
              Visit Us
            </h4>
            <div className="space-y-3 text-sm text-[#FFF3E7]/80">
              <p className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-4 h-4 text-[#E58422] shrink-0 mt-0.5" />
                <span>2837 Yellowbell St., Area C, Brgy. 174 Camarin, Caloocan City</span>
              </p>
              <p className="flex items-start justify-center md:justify-start gap-3">
                <Clock className="w-4 h-4 text-[#E58422] shrink-0 mt-0.5" />
                <span>4:00 PM - 12:00 AM, daily</span>
              </p>
            </div>
          </div>

          {/* Column 3: Page Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E58422] uppercase mb-4">
              Explore
            </h4>
            <ul className="flex flex-col items-center md:items-start sm:space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.page}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.page)}
                    className="min-h-[44px] sm:min-h-0 inline-flex items-center text-sm text-[#FFF3E7]/80 hover:text-[#E58422] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright Notice with Hidden Padlock */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#FFF3E7]/50">
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
    </footer>
  );
};
