import React from 'react';

/**
 * Navbar component renders the top persistent navigation header.
 * @param {Object} props - Component properties
 * @param {Function} props.onOpenSurvey - Callback to trigger the Customer Survey modal
 * @param {string} props.currentPage - Currently active view ('home' or 'menu')
 * @param {Function} props.onNavigate - Callback to switch views
 * @param {Function} [props.onMenuClick] - Opens the menu categories drawer (menu page, mobile only)
 */
export const Navbar = ({ onOpenSurvey, currentPage = 'home', onNavigate, onMenuClick }) => {
  // Smooth scroll helper to navigate to page sections by their HTML element ID
  const scrollToSection = (sectionId) => {
    if (currentPage !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // On the menu page (mobile) the header gets a 3-line button and an About Us link,
  // so the brand and Take Survey button are slightly smaller to fit on narrow phones.
  const compact = Boolean(onMenuClick);

  return (
    // Navigation container: sticky positioned with warm cream background and subtle bottom border
    <nav className="bg-[#FFF3E7] flex justify-between items-center w-full px-4 md:px-16 py-4 sticky top-0 z-40 border-b border-black/5">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* 3-line button: opens the menu categories drawer. Mobile only, menu page only */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open menu categories"
            className="md:hidden p-2 rounded-lg border border-black/10 text-[#19244E] hover:bg-black/5 cursor-pointer shrink-0"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        {/* Brand Wordmark: Anybody bold display typeface in signature Navy color */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`font-black text-[#19244E] tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap md:text-3xl ${
            compact ? 'text-lg sm:text-2xl' : 'text-2xl'
          }`}
        >
          Beardista Brew
        </a>
      </div>

      {/* Navigational Anchor Links: Home, Menu, About Us, Contact */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Home Link */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer relative py-1 ${
            currentPage === 'home'
              ? 'text-[#E58422] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E58422]'
              : 'text-[#19244E] hover:text-[#E58422]'
          }`}
        >
          Home
        </button>

        {/* Dynamic Digital Menu Link */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer relative py-1 ${
            currentPage === 'menu'
              ? 'text-[#E58422] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E58422]'
              : 'text-[#19244E] hover:text-[#E58422]'
          }`}
        >
          Menu
        </button>

        {/* Navigational link to the full Our Story / About Us page */}
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              scrollToSection('story-section');
            }
          }}
          className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer relative py-1 ${
            currentPage === 'story'
              ? 'text-[#E58422] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E58422]'
              : 'text-[#19244E] hover:text-[#E58422]'
          }`}
        >
          About Us
        </button>

        {/* Scroll link to footer location and social channels */}
        <button
          onClick={() => scrollToSection('contact-section')}
          className="text-[#19244E] text-sm font-semibold tracking-wide hover:text-[#E58422] transition-colors cursor-pointer"
        >
          Contact
        </button>
      </div>

      {/* Right side: About Us (mobile, menu page) + Primary Action Button "Take Survey" */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onMenuClick && onNavigate && (
          <button
            onClick={() => onNavigate('story')}
            className="md:hidden text-xs sm:text-sm font-bold text-[#E58422] hover:underline cursor-pointer whitespace-nowrap"
          >
            About Us →
          </button>
        )}
        <button
          onClick={onOpenSurvey}
          className={`inline-flex items-center justify-center bg-[#E58422] hover:bg-[#d47414] text-white font-semibold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap md:px-6 md:py-2.5 md:text-sm ${
            compact ? 'px-4 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm' : 'px-6 py-2.5 text-sm'
          }`}
        >
          Take Survey
        </button>
      </div>
    </nav>
  );
};
