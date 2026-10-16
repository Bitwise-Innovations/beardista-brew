import React from 'react';

/**
 * Navbar component renders the top persistent navigation header.
 * @param {Object} props - Component properties
 * @param {Function} props.onOpenSurvey - Callback to trigger the Customer Survey modal
 * @param {string} props.currentPage - Currently active view ('home' or 'menu')
 * @param {Function} props.onNavigate - Callback to switch views
 */
export const Navbar = ({ onOpenSurvey, currentPage = 'home', onNavigate }) => {
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

  return (
    // Navigation container: sticky positioned with warm cream background and subtle bottom border
    <nav className="bg-[#FFF3E7] flex justify-between items-center w-full px-6 md:px-16 py-4 sticky top-0 z-40 border-b border-black/5">
      {/* Brand Wordmark: Anybody bold display typeface in signature Navy color */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onNavigate) onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="font-black text-2xl md:text-3xl text-[#19244E] tracking-tight hover:opacity-90 transition-opacity"
      >
        Beardista Brew
      </a>

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

      {/* Primary Action Button: "Take Survey" styled with brand orange (#E58422) */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSurvey}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-sm font-semibold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          Take Survey
        </button>
      </div>
    </nav>
  );
};
