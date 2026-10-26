import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- CUSTOMER DATA ---


// --- CUSTOMER COMPONENTS ---
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Hero } from '../features/landing/Hero.jsx';
import { CustomerFavorites } from '../features/landing/CustomerFavorites.jsx';
import { WhatsBrewing } from '../features/landing/WhatsBrewing.jsx';
import { OurStorySection } from '../features/landing/OurStorySection.jsx';
import OurStory from '../features/landing/OurStory.jsx';
import { WhyChooseUs } from '../features/landing/WhyChooseUs.jsx';
import { BeardistaBlend } from '../features/landing/BeardistaBlend.jsx';
import { CustomerVoice } from '../features/landing/CustomerVoice.jsx';
import { StayConnected } from '../features/landing/StayConnected.jsx';
import MenuPage from '../features/menu/MenuPage.jsx';
import {
  customerFavoritesData,
  whatsBrewingData,
  whyChooseData,
  blendDetailsData,
  reviewsData,
  wifiData,
} from '../data/customerData.js';

// --- LIVE DATA (Supabase) ---
import { useMenuItems, useCategories } from '../backend/hooks/useMenu';
import { buildFavorites } from '../backend/mappers/menuMapper';
import { useEvents } from '../backend/hooks/useEvents';
import { buildFeaturedEvent } from '../backend/mappers/eventMapper';

// --- CUSTOMER MODALS ---
import { ItemDetailsModal } from '../features/menu/ItemDetailsModal.jsx';
import { SurveyModal } from '../features/landing/SurveyModal.jsx';
import { EventDetailsModal } from '../features/landing/EventDetailsModal.jsx';
import { StoryModal } from '../features/landing/StoryModal.jsx';


const PAGE_PATHS = { home: '/', menu: '/menu', story: '/our-story' };

/**
 * CustomerApp: the public-facing customer digital menu.
 */
export const CustomerApp = ({ onOpenAdminLogin }) => {
   const navigate = useNavigate();
  const location = useLocation();
  

  const currentPage =
    location.pathname.startsWith('/menu') ? 'menu' :
    location.pathname.startsWith('/our-story') ? 'story' : 'home';

  // Customer Favorites: real data from Supabase. While loading, on error,
  // or if no item is marked favorite, the sample data is shown instead.
  const { data: menuItems } = useMenuItems({ availableOnly: true });
  const { data: categories } = useCategories({ activeOnly: true });
  const liveFavorites = buildFavorites(menuItems, categories);
  const favorites = liveFavorites.length > 0 ? liveFavorites : customerFavoritesData;

  // What's Brewing event card: real event from Supabase. While loading, on error,
  // or when there is no running event, the sample event is shown instead.
  const { data: events } = useEvents();
  const brewingData = {
    ...whatsBrewingData,
    event: buildFeaturedEvent(events) ?? whatsBrewingData.event,
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const handleExploreMenu = () => {
    navigate('/menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTsamporado = () => {
    setSelectedItem({
      id: 'tsamporado',
      name: whatsBrewingData.mustTry.title,
      category: 'Seasonal Feature',
      description: whatsBrewingData.mustTry.description,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcnRgPZvSAeWjuil3h6B2n2OeNmjdePD_56mCf8tbN27R8djWpb41wqtMsGBB33MYEq7MYoc_XEHazaMV5djUC4aj1tO7WGri2VDOrQCpwy9kfyTW4pIYbtD8y59TdVLEfgT2Ki2fRvmGUqh5cRCsPjEqBERczKKEpig7TaOjLdLq44MoClCswni8iPvsyuD3vwdh1i2k-mEzX34CSvsakhJcRy4hB49x3HF7RP_GpqHHKZ443mMC5eogBmmiYaFNL2_G9B2LFwlduvQ',
      details: whatsBrewingData.mustTry.details
    });
  };

  const handleNavigate = (page) => {
    if (page === 'admin-login' || page === 'admin') {
      if (onOpenAdminLogin) onOpenAdminLogin();
      return;
    }
    navigate(PAGE_PATHS[page] ?? '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#FFF3E7] text-[#111111] flex flex-col antialiased ...">

      {currentPage === 'story' ? (
        <OurStory
          onNavigate={handleNavigate}
          onOpenSurvey={() => setIsSurveyOpen(true)}
        />
      ) : currentPage === 'menu' ? (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSurvey={() => setIsSurveyOpen(true)}
          />
          <MenuPage
            onNavigate={handleNavigate}
            onSelectItem={(item) => setSelectedItem(item)}
          />
          <Footer onNavigate={handleNavigate} />
        </>
      ) : (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSurvey={() => setIsSurveyOpen(true)}
          />
          <Hero onExploreMenu={handleExploreMenu} />
          <CustomerFavorites
            items={favorites}
            onViewDetails={(item) => setSelectedItem(item)}
          />
          <WhatsBrewing
            data={brewingData}
            onRegister={() => setIsEventOpen(true)}
            onViewTsamporado={handleViewTsamporado}
          />
          <OurStorySection onReadMore={() => handleNavigate('story')} />
          <WhyChooseUs pillars={whyChooseData} />
          <BeardistaBlend details={blendDetailsData} />
          <CustomerVoice
            reviews={reviewsData}
            onOpenSurvey={() => setIsSurveyOpen(true)}
          />
          <StayConnected wifi={wifiData} />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <SurveyModal isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
      <EventDetailsModal
        isOpen={isEventOpen}
        onClose={() => setIsEventOpen(false)}
        eventData={brewingData.event}
      />
      <StoryModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
    </div>
  );
};