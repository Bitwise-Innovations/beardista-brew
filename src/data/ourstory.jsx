import React, { useState } from 'react';

// Import decoupled data models from the mock database file
import {
  storyNarrative,
  mottoData,
  visionaryData,
  teamMembers
} from './data/aboutUsData.js';

// ==============================================================================
// PLACEHOLDER NAVBAR COMPONENT
// Represents the top navigation header placeholder required by rubric.
// ==============================================================================
function Navbar({ onNavigate, onOpenSurvey }) {
  return (
    <nav className="bg-[#FFF3E7] w-full px-6 md:px-16 py-4 sticky top-0 z-40 border-b border-black/5 flex justify-between items-center shadow-xs">
      {/* Brand Wordmark Logo - clicking navigates to home */}
      <button
        onClick={() => {
          if (onNavigate) onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="font-black text-2xl md:text-3xl text-[#19244E] tracking-tight hover:opacity-90 transition-opacity cursor-pointer text-left"
      >
        Beardista Brew
      </button>

      {/* Navigational Anchor Links: Home, Menu, About Us, Contact Us */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Home Navigation Link */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-sm font-semibold text-[#19244E] hover:text-[#E58422] transition-colors cursor-pointer py-1"
        >
          Home
        </button>

        {/* Menu Navigation Link */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-sm font-semibold text-[#19244E] hover:text-[#E58422] transition-colors cursor-pointer py-1"
        >
          Menu
        </button>

        {/* Active Page Indicator: About Us */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate('story');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-sm font-bold text-[#E58422] cursor-pointer relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E58422]"
        >
          About Us
        </button>

        {/* Contact Link */}
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('contact-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }
          }}
          className="text-sm font-semibold text-[#19244E] hover:text-[#E58422] transition-colors cursor-pointer py-1"
        >
          Contact Us
        </button>
      </div>

      {/* Primary Action Button: Take Survey modal trigger */}
      <button
        onClick={() => {
          if (onOpenSurvey) {
            onOpenSurvey();
          } else if (onNavigate) {
            onNavigate('home');
          }
        }}
        className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-sm font-semibold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
      >
        Take Survey
      </button>
    </nav>
  );
}

// ==============================================================================
// PLACEHOLDER FOOTER COMPONENT
// Represents the bottom footer placeholder matching the reference design layout.
// ==============================================================================
function Footer() {
  return (
    <footer className="bg-[#19244E] text-[#FFF3E7] pt-16 px-6 md:px-16 pb-12 border-t border-white/10 mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Cafe Wordmark & Operational Hours */}
        <div className="space-y-4">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Beardista <br />Brew
          </div>
          <p className="text-[#FFF3E7]/80 text-sm max-w-sm leading-relaxed">
            2837 Yellowbell St., Area C, Brgy. 174 Camarin, Caloocan City
          </p>
          <p className="text-[#FFF3E7]/80 text-sm font-medium">
            Hours: 4:00 PM – 12:00 AM
          </p>
          <p className="text-[#FFF3E7]/50 text-xs pt-4">
            © 2026 Beardista Brew. All rights reserved.
          </p>
        </div>

        {/* Right Column: Social Connection Channels */}
        <div className="md:text-right space-y-4">
          <h4 className="text-2xl font-bold text-white tracking-wide">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-[#FFF3E7]/80">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#E58422] transition-colors">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#E58422] transition-colors">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

// ==============================================================================
// MAIN COMPONENT: OurStory
// Assembles all 4 visual reference sections:
// 1. The Roots / Our Story (Signage image + pandemic origin paragraphs)
// 2. Motto & Mission Banner (Wide bar photo + bold quote)
// 3. The Visionary (Founder & Head Roaster Jim Carlo Gorospe profile)
// 4. Meet the Team (3 Barista staff cards mapped dynamically)
// ==============================================================================
export default function OurStory({ onNavigate, onOpenSurvey }) {
  // State for interactive barista card hover or active state
  const [selectedBaristaId, setSelectedBaristaId] = useState(null);

  return (
    // Base Page Container
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] flex flex-col antialiased">
      
      {/* 1. Placeholder <Navbar/> at top as required */}
      <Navbar onNavigate={onNavigate} onOpenSurvey={onOpenSurvey} />

      {/* Main Content Flow */}
      <main className="flex-1" id="our-story-main">
        
        {/* ================================================================== */}
        {/* SECTION 1: THE ROOTS / OUR STORY                                   */}
        {/* ================================================================== */}
        <section className="py-12 md:py-20 px-6 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column (5 Cols): Illuminated Signage Lightbox Asset */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-none overflow-hidden shadow-xl border border-black/10">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABEC-4YMe9KuI2_3p2rngjkOCN9kRy6aHAhhS1IJnFoZePxPGaWltctHSa4ccKTzcvKwy6cTlSeAQd_Kx-1TnJxPnWdvUkktJEj2NmoKG393ywYLQM15s0P9Sb95eKHnYUhwZ0gzeUrHIywO61wXui5_NL-uLbvQusgfoKsYay7wSln88PMfmSRh5p6KOdCTWJwp4NCfRlIQjNj3FgsvyWsT0MzvDWbtX-CPpoTI7jH3G7SiPg8zBG"
                  alt="Beardista Brew Gentleman's Coffee illuminated lightbox sign"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right Column (7 Cols): The Roots Label, Title, and Narrative Paragraphs */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pl-6">
              
              {/* Top Tag Label */}
              <span className="text-xs font-bold uppercase tracking-widest text-[#E58422]">
                THE ROOTS
              </span>

              {/* Main Section Headline: 'our story' in lowercase bold display navy */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#19244E] tracking-tight leading-none lowercase">
                our story
              </h1>

              {/* Narrative Paragraphs dynamically mapped from dummy database array */}
              <div className="space-y-6 pt-2">
                {storyNarrative.map((item) => (
                  <p
                    key={item.id}
                    className="text-sm sm:text-base text-[#111111] leading-relaxed font-normal"
                  >
                    {item.paragraph}
                  </p>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 2: MOTTO & MISSION BANNER                                  */}
        {/* ================================================================== */}
        <section className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden">
          {/* Background Image Asset representing cafe bar counter and coffee sacks */}
          <div className="absolute inset-0 z-0">
            <img
              src={mottoData.backgroundImage}
              alt="Beardista Brew cafe and bar counter atmosphere"
              className="w-full h-full object-cover"
            />
            {/* Dark warm overlay to ensure high typographic legibility */}
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
          </div>

          {/* Centered Content Container */}
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-4">
            {/* Decorative Coffee Cup Glyph Icon */}
            <div className="w-10 h-10 rounded-full border border-[#E58422]/60 flex items-center justify-center text-[#E58422] mb-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>

            {/* Bold Brand Motto Quote */}
            <blockquote className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
              "{mottoData.motto}"
            </blockquote>

            {/* Subtitle Tag */}
            <span className="text-xs font-bold uppercase tracking-widest text-[#E58422] pt-2">
              {mottoData.tagline}
            </span>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 3: THE VISIONARY (MR. JIM CARLO GOROSPE)                   */}
        {/* ================================================================== */}
        <section className="py-20 md:py-24 px-6 md:px-16 bg-[#FFF3E7]">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center space-y-5">
            
            {/* Founder Portrait with Orange Border Framing */}
            <div className="relative mb-2">
              {/* Decorative offset border */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-3 border-[#E58422] shadow-xl p-1 bg-white">
                <img
                  src={visionaryData.image}
                  alt={visionaryData.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#19244E] tracking-tight">
              {visionaryData.title}
            </h2>

            {/* Founder Name & Title */}
            <p className="text-sm sm:text-base font-semibold text-[#E58422]">
              {visionaryData.name}, {visionaryData.role}
            </p>

            {/* Founder Biography Narrative */}
            <p className="text-sm sm:text-base text-[#111111]/85 leading-relaxed font-normal max-w-2xl">
              {visionaryData.bio}
            </p>

            {/* Favorite Drink Badge Pill */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-neutral-300 rounded-full text-xs font-medium text-[#111111] shadow-2xs">
                <span>☕</span>
                <span>Favorite Drink: {visionaryData.favoriteDrink}</span>
              </span>
            </div>

          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 4: MEET THE TEAM                                           */}
        {/* ================================================================== */}
        <section className="py-16 md:py-24 px-6 md:px-16 bg-[#FFF3E7]">
          <div className="max-w-[1280px] mx-auto">
            
            {/* Section Heading & Subtitle */}
            <div className="text-center mb-14 space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#19244E] tracking-tight">
                Meet the Team
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                The skilled hands behind your favorite brew.
              </p>
            </div>

            {/* 3-Column Barista Cards Grid rendered dynamically via .map() */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {teamMembers.map((member, index) => {
                const isSelected = selectedBaristaId === member.id;
                // Middle card (Lead Barista) has a slightly elevated/taller frame as in the reference image
                const isMiddle = index === 1;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedBaristaId(isSelected ? null : member.id)}
                    className={`bg-white rounded-none border border-black/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#E58422]' : ''
                    }`}
                  >
                    {/* Barista Portrait Frame */}
                    <div className={`w-full overflow-hidden bg-neutral-100 ${
                      isMiddle ? 'h-80 sm:h-96' : 'h-72 sm:h-80'
                    }`}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Barista Details Container */}
                    <div className="p-6 flex flex-col space-y-2 bg-white">
                      <h3 className="text-xl font-bold text-[#19244E] tracking-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-[#E58422] uppercase tracking-wider">
                        {member.role}
                      </p>
                      <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                        {member.funFact}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </main>

      {/* 5. Placeholder <Footer/> at bottom as required */}
      <Footer />

    </div>
  );
}

// Named export for flexible import conventions
export { OurStory };
