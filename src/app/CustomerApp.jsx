import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

// Fixed marketing content (no admin fields for these).
import { whyChooseData, blendDetailsData } from '../data/customerData.js';

// --- LIVE DATA (Supabase) ---
import { useMenuItems, useCategories, useRecordMenuView } from '../backend/hooks/useMenu';
import { buildFavorites, buildMenuItems } from '../backend/mappers/menuMapper';
import { useEvents } from '../backend/hooks/useEvents';
import { buildFeaturedEvent } from '../backend/mappers/eventMapper';
import { useCustomerVoice } from '../backend/hooks/useCustomerFeedback';
import { useAnnouncements, useStoreSettings } from '../backend/hooks/useContent';
import { buildFeaturedAnnouncement } from '../backend/mappers/contentMapper';

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

  // Menu data: favorites on the home page, and lookups for announcement links.
  const { data: menuItems } = useMenuItems();
  const { data: categories } = useCategories({ activeOnly: true });
  const favorites = buildFavorites(menuItems, categories);
  const menuDisplayItems = buildMenuItems(menuItems, categories);

  // Customer Voice: responses staff marked Live in Analytics.
  const { data: customerVoice = [] } = useCustomerVoice();

  // The Beardista Blend: from Content Management → Coffee Specs, else the sample cards.
  const { data: settings } = useStoreSettings();
  const blend = settings?.find((setting) => setting.key === 'blend')?.value;
  const blendCards = blend
    ? [
        { label: 'Roast Profile', value: blend.roast },
        { label: 'Flavor Notes', value: blend.notes },
        { label: 'Origin', value: blend.origin },
      ].filter((card) => card.value?.trim())
    : [];
  const blendDetails = blendCards.length > 0 ? blendCards : blendDetailsData;

  // What's Brewing: next open event and the top live announcement.
  const { data: events } = useEvents();
  const featuredEvent = buildFeaturedEvent(events);
  const { data: announcements } = useAnnouncements();
  const feature = buildFeaturedAnnouncement(announcements);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Count one view per menu item per visit.
  const recordView = useRecordMenuView();
  const viewedIds = useRef(new Set());
  const openItem = (item) => {
    setSelectedItem(item);
    if (typeof item?.id === 'number' && !viewedIds.current.has(item.id)) {
      viewedIds.current.add(item.id);
      recordView.mutate(item.id);
    }
  };

  const handleNavigate = (page) => {
    if (page === 'admin-login' || page === 'admin') {
      if (onOpenAdminLogin) onOpenAdminLogin();
      return;
    }
    navigate(PAGE_PATHS[page] ?? '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreMenu = () => handleNavigate('menu');

  // Follows the link set on the announcement in Content Management.
  const handleFeatureClick = () => {
    if (!feature) return;
    const target = feature.linkTarget;

    if (feature.linkType === 'menu_item') {
      const item = menuDisplayItems.find((entry) => String(entry.id) === String(target));
      if (item) openItem(item);
      else handleNavigate('menu');
      return;
    }

    if (feature.linkType === 'event') {
      const linked = (events ?? []).find((entry) => String(entry.id) === String(target));
      const card = linked ? buildFeaturedEvent([linked]) : null;
      setModalEvent(card ?? featuredEvent);
      return;
    }

    if (feature.linkType === 'url' && target) {
      if (target.startsWith('/')) {
        navigate(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.open(target, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#FFF3E7] text-[#111111] flex flex-col antialiased">
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
          <MenuPage onNavigate={handleNavigate} onSelectItem={openItem} />
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
          {favorites.length > 0 && (
            <CustomerFavorites items={favorites} onViewDetails={openItem} />
          )}
          <WhatsBrewing
            event={featuredEvent}
            feature={feature}
            onRegister={() => setModalEvent(featuredEvent)}
            onFeatureClick={handleFeatureClick}
          />
          <OurStorySection onReadMore={() => handleNavigate('story')} />
          <WhyChooseUs pillars={whyChooseData} />
          <BeardistaBlend details={blendDetails} />
          <CustomerVoice
            reviews={customerVoice}
            onOpenSurvey={() => setIsSurveyOpen(true)}
          />
          <StayConnected />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <SurveyModal isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
      <EventDetailsModal
        isOpen={Boolean(modalEvent)}
        onClose={() => setModalEvent(null)}
        eventData={modalEvent}
      />
      <StoryModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
    </div>
  );
};          