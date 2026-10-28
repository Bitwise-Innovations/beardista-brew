import React, { useEffect } from 'react';
import storyImg from '@/assets/our_story.jpg';
import { Navbar } from '@/components/Navbar.jsx';
import { Footer } from '@/components/Footer.jsx';
import ownerImg from '@/assets/owner_pic.jpg';
import baristaBen from '@/assets/barista_ben.jpg';
import baristaDais from '@/assets/barista_dais.jpg';
import baristaJa from '@/assets/barista_ja.jpg';
import { useBaristaTeam, useStoreSettings } from '../../backend/hooks/useContent';

// Shown when a field hasn't been filled in yet in Content Management.
const FALLBACK = {
  origins:
    'Beardista Brew began in 2020 during the height of the pandemic. Even with all the strict limitations, our passion for crafting and sharing great drinks never stopped. We wanted to build more than just a standard cafe; our vision was to create a unique space that offered the best of both worlds—a coffee shop and bar open from the afternoon straight through to midnight.',
  community:
    'We would not be where we are today without the incredible support of our community. From the local regulars who stood by us since our humble beginnings, to the talented artists who hang out and bring life to our space, you all made this dream possible. Today, Beardista Brew remains a welcoming home for everyone to connect over exceptional coffee and cocktails.',
  motto: 'To serve quality specialty handcrafted drinks and to serve the community.',
  founderName: 'Mr. Jim Carlo Gorospe',
  founderTitle: 'Founder & Head Roaster',
  founderBio:
    'Jim started his career as a bartender in the corporate world, but the grueling, fast-paced environment slowly drained his creative passion. Looking for a fresh spark, he began experimenting—blending his mixology background with rich espresso, craft alcohol, and the local art scene. Today, as the founder of Beardista Brew, Jim’s philosophy is simple: every drink is a canvas.',
  favoriteDrink: 'Kape-ling ang asawa ko',
};

const FALLBACK_TEAM = [
  { id: 'ben', name: 'Ben', role: 'Lead Barista', description: 'Can pour a perfect dragon blindfolded.', photo: baristaBen },
  { id: 'dais', name: 'Dais', role: 'Barista', description: 'Master of the Tsamporado blend.', photo: baristaDais },
  { id: 'ja', name: 'Ja', role: 'Barista', description: 'Knows your regular order before you even speak.', photo: baristaJa },
];

// Placeholder photos for team members who don't have one uploaded yet.
const PLACEHOLDER_PHOTOS = [baristaBen, baristaDais, baristaJa];

const pick = (value, fallback) => (typeof value === 'string' && value.trim() ? value.trim() : fallback);

export default function OurStory({ onNavigate, onOpenSurvey }) {
  const settingsQuery = useStoreSettings();
  const teamQuery = useBaristaTeam();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const story = settingsQuery.data?.find((setting) => setting.key === 'story')?.value ?? {};

  const origins = pick(story.founderBio, FALLBACK.origins);
  const community = pick(story.communityStory, FALLBACK.community);
  const motto = pick(story.motto, FALLBACK.motto);
  const founderName = pick(story.founderName, FALLBACK.founderName);
  const founderTitle = pick(story.founderTitle, FALLBACK.founderTitle);
  const founderPhoto = pick(story.founderPhoto, ownerImg);

  const liveTeam = (teamQuery.data ?? []).map((member, index) => ({
    id: member.id,
    name: member.name,
    role: member.role || 'Barista',
    description: member.bio ?? '',
    photo: member.photo_url || PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length],
  }));
  // While loading or if the roster is empty, show the original team.
  const team = liveTeam.length > 0 ? liveTeam : FALLBACK_TEAM;

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] flex flex-col antialiased">
      <Navbar currentPage="story" onNavigate={onNavigate} onOpenSurvey={onOpenSurvey} />

      <main className="flex-1" id="our-story-main">
        {/* SECTION 1: THE ROOTS */}
        <section className="py-12 md:py-20 px-6 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden shadow-xl border border-black/10">
                <img src={storyImg} alt="Beardista Brew Cafe" className="w-full h-full object-cover" loading="eager" />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pl-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E58422]">THE ROOTS</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#19244E] tracking-tight leading-none lowercase">
                our story
              </h1>
              <div className="space-y-6 pt-2">
                {[origins, community].map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base text-[#111111] leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: MOTTO BANNER */}
        <section className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={storyImg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border border-[#E58422]/60 flex items-center justify-center text-[#E58422] mb-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
              </svg>
            </div>
            <blockquote className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
              "{motto}"
            </blockquote>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E58422] pt-2">OUR MISSION</span>
          </div>
        </section>

        {/* SECTION 3: THE VISIONARY */}
        <section className="py-20 md:py-24 px-6 md:px-16 bg-[#FFF3E7]">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center space-y-5">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-3 border-[#E58422] shadow-xl p-1 bg-white mb-2">
              <img src={founderPhoto} alt={founderName} className="w-full h-full object-cover rounded-xl" loading="lazy" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#19244E] tracking-tight">The Visionary</h2>
            <p className="text-sm sm:text-base font-semibold text-[#E58422]">
              {founderName}, {founderTitle}
            </p>
            <p className="text-sm sm:text-base text-[#111111]/85 leading-relaxed max-w-2xl">{FALLBACK.founderBio}</p>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-neutral-300 rounded-full text-xs font-medium text-[#111111] shadow-2xs">
              <span aria-hidden="true">☕</span>
              <span>Favorite Drink: {FALLBACK.favoriteDrink}</span>
            </span>
          </div>
        </section>

        {/* SECTION 4: MEET THE TEAM */}
        <section className="py-16 md:py-24 px-6 md:px-16 bg-[#FFF3E7]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-10 md:mb-14 space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#19244E] tracking-tight">Meet the Team</h2>
              <p className="text-sm sm:text-base text-neutral-600">The skilled hands behind your favorite brew.</p>
            </div>

            {/* 2 per row on phones, 3 on larger screens */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 items-end">
              {team.map((member, index) => (
                <article key={member.id} className="bg-white border border-black/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className={`w-full overflow-hidden bg-neutral-100 h-40 sm:h-72 ${index % 3 === 1 ? 'md:h-96' : 'md:h-80'}`}>
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-6 flex flex-col space-y-1 sm:space-y-2 bg-white">
                    <h3 className="text-base sm:text-xl font-bold text-[#19244E] tracking-tight">{member.name}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-[#E58422] uppercase tracking-wider">{member.role}</p>
                    {member.description && (
                      <p className="hidden sm:block text-xs text-neutral-600 leading-relaxed pt-1">{member.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}