import React, { useState, useEffect } from 'react';

// Import your real layout components
import { Navbar } from '../../../components/Navbar.jsx';
import { Footer } from '../../../components/Footer.jsx';

// Import all your local images from the assets folder
import storyImg from '../assets/beardista sign.jpg';
import mottoBgImg from '../assets/beardista_ourstory.jpg';
import ownerImg from '../assets/owner_pic.jpg';
import baristaBen from '../assets/barista_ben.jpg';
import baristaDais from '../assets/barista_dais.jpg';
import baristaJa from '../assets/barista_ja.jpg';

const storyNarrative = [
  { 
    id: 1, 
    paragraph: "Beardista Brew began in 2020 during the height of the pandemic. Even with all the strict limitations, our passion for crafting and sharing great drinks never stopped. We wanted to build more than just a standard cafe; our vision was to create a unique space that offered the best of both worlds—a coffee shop and bar open from the afternoon straight through to midnight." 
  },
  { 
    id: 2, 
    paragraph: "We would not be where we are today without the incredible support of our community. From the local regulars who stood by us since our humble beginnings, to the talented artists who hang out and bring life to our space, you all made this dream possible. Today, Beardista Brew remains a welcoming home for everyone to connect over exceptional coffee and cocktails." 
  }
];

const mottoData = {
  backgroundImage: mottoBgImg,
  motto: "To serve quality specialty handcrafted drinks and to serve the community.",
  tagline: "OUR MISSION"
};

const visionaryData = {
  image: ownerImg,
  title: "The Visionary",
  name: "Mr. Jim Carlo Gorospe",
  role: "Founder & Head Roaster",
  bio: "Jim started his career as a bartender in the corporate world, but the grueling, fast-paced environment slowly drained his creative passion. Looking for a fresh spark, he began experimenting—blending his mixology background with rich espresso, craft alcohol, and the local art scene. Today, as the founder of Beardista Brew, Jim’s philosophy is simple: every drink is a canvas.",
  favoriteDrink: "Kape-ling ang asawa ko"
};

const teamMembers = [
  { id: 1, name: "Ben", role: "Lead Barista", funFact: "Can pour a perfect dragon blindfolded.", image: baristaBen },
  { id: 2, name: "Dais", role: "Barista", funFact: "Master of the Tsamporado blend.", image: baristaDais },
  { id: 3, name: "Ja", role: "Barista", funFact: "Knows your regular order before you even speak.", image: baristaJa }
];

// ==============================================================================
// MAIN COMPONENT: OurStory
// ==============================================================================
export default function OurStory({ onNavigate, onOpenSurvey }) {
  const [selectedBaristaId, setSelectedBaristaId] = useState(null);

  // Automatically scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] flex flex-col antialiased">
      
      {/* 1. Real Navbar */}
      <Navbar currentPage="story" onNavigate={onNavigate} onOpenSurvey={onOpenSurvey} />

      <main className="flex-1" id="our-story-main">
        
        {/* SECTION 1: THE ROOTS / OUR STORY */}
        <section className="py-12 md:py-20 px-6 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Image Asset */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-none overflow-hidden shadow-xl border border-black/10">
                <img
                  src={storyImg}
                  alt="Beardista Brew Cafe"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pl-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E58422]">
                THE ROOTS
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#19244E] tracking-tight leading-none lowercase">
                our story
              </h1>
              <div className="space-y-6 pt-2">
                {storyNarrative.map((item) => (
                  <p key={item.id} className="text-sm sm:text-base text-[#111111] leading-relaxed font-normal">
                    {item.paragraph}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: MOTTO & MISSION BANNER */}
        <section className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={mottoData.backgroundImage} alt="Beardista Brew atmosphere" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border border-[#E58422]/60 flex items-center justify-center text-[#E58422] mb-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <blockquote className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
              "{mottoData.motto}"
            </blockquote>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E58422] pt-2">
              {mottoData.tagline}
            </span>
          </div>
        </section>

        {/* SECTION 3: THE VISIONARY */}
        <section className="py-20 md:py-24 px-6 md:px-16 bg-[#FFF3E7]">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center space-y-5">
            <div className="relative mb-2">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-3 border-[#E58422] shadow-xl p-1 bg-white">
                <img src={visionaryData.image} alt={visionaryData.name} className="w-full h-full object-cover rounded-xl" loading="lazy" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#19244E] tracking-tight">
              {visionaryData.title}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#E58422]">
              {visionaryData.name}, {visionaryData.role}
            </p>
            <p className="text-sm sm:text-base text-[#111111]/85 leading-relaxed font-normal max-w-2xl">
              {visionaryData.bio}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-neutral-300 rounded-full text-xs font-medium text-[#111111] shadow-2xs">
                <span>☕</span>
                <span>Favorite Drink: {visionaryData.favoriteDrink}</span>
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 4: MEET THE TEAM */}
        <section className="py-16 md:py-24 px-6 md:px-16 bg-[#FFF3E7]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-14 space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#19244E] tracking-tight">
                Meet the Team
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                The skilled hands behind your favorite brew.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {teamMembers.map((member, index) => {
                const isSelected = selectedBaristaId === member.id;
                const isMiddle = index === 1;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedBaristaId(isSelected ? null : member.id)}
                    className={`bg-white rounded-none border border-black/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#E58422]' : ''
                    }`}
                  >
                    <div className={`w-full overflow-hidden bg-neutral-100 ${isMiddle ? 'h-80 sm:h-96' : 'h-72 sm:h-80'}`}>
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-6 flex flex-col space-y-2 bg-white">
                      <h3 className="text-xl font-bold text-[#19244E] tracking-tight">{member.name}</h3>
                      <p className="text-xs font-bold text-[#E58422] uppercase tracking-wider">{member.role}</p>
                      <p className="text-xs text-neutral-600 leading-relaxed pt-1">{member.funFact}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* 5. Real Footer */}
      <Footer />

    </div>
  );
}