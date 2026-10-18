import React, { useState } from 'react';

// --- CUSTOMER DATA ---
import {
  customerFavoritesData,
  whatsBrewingData,
  whyChooseData,
  blendDetailsData,
  reviewsData,
  wifiData,
  faqData
} from './data/menu.jsx';

// --- CUSTOMER COMPONENTS ---
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './features/landing/Hero.jsx';
import { CustomerFavorites } from './features/landing/CustomerFavorites.jsx';
import { WhatsBrewing } from './features/landing/WhatsBrewing.jsx';
import { OurStorySection } from './features/landing/OurStorySection.jsx';
import OurStory from './features/landing/OurStory.jsx';
import { WhyChooseUs } from './features/landing/WhyChooseUs.jsx';
import { BeardistaBlend } from './features/landing/BeardistaBlend.jsx';
import { CustomerVoice } from './features/landing/CustomerVoice.jsx';
import { StayConnected } from './features/landing/StayConnected.jsx';
import { Footer } from './components/Footer.jsx';
import MenuPage from './features/menu/MenuPage.jsx';
import { FAQSection } from './features/landing/FAQSection.jsx';

// --- CUSTOMER MODALS ---
import { ItemDetailsModal } from './features/menu/ItemDetailsModal.jsx';
import { SurveyModal } from './features/landing/SurveyModal.jsx';
import { EventDetailsModal } from './features/landing/EventDetailsModal.jsx';
import { StoryModal } from './features/landing/StoryModal.jsx';

// --- ADMIN COMPONENTS ---
import { AdminLogin } from "./features/admin/auth/AdminLogin.jsx";
import { AdminPortal } from "./features/admin/AdminPortal.jsx";
import { MobileLogin } from "./features/admin/mobile/MobileLogin.jsx";
import { MobileAdminLayout } from "./features/admin/mobile/MobileAdminLayout.jsx";

/**
 * CustomerApp: Represents the public-facing customer digital menu.
 */
export const CustomerApp = ({ onOpenAdminLogin }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const handleExploreMenu = () => {
    setCurrentPage('menu');
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
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] flex flex-col antialiased selection:bg-[#E58422] selection:text-white">
      
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
            items={customerFavoritesData}
            onViewDetails={(item) => setSelectedItem(item)}
          />
          <WhatsBrewing
            data={whatsBrewingData}
            onRegister={() => setIsEventOpen(true)}
            onViewTsamporado={handleViewTsamporado}
          />
          <OurStorySection
            onReadMore={() => {
              setCurrentPage('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
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

      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
      />
      <EventDetailsModal
        isOpen={isEventOpen}
        onClose={() => setIsEventOpen(false)}
        eventData={whatsBrewingData.event}
      />
      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />
    </div>
  );
};

/**
 * MAIN ROUTER APP
 */
export default function App() {
  const [currentView, setCurrentView] = useState('customer');

  if (currentView === 'admin-mobile-login') {
    return (
      <MobileLogin
        onLoginSuccess={() => setCurrentView('admin-mobile-dashboard')}
        onBackToCustomer={() => setCurrentView('customer')}
        onSwitchToDesktop={() => setCurrentView('admin-login')}
      />
    );
  }

  if (currentView === 'admin-mobile-dashboard') {
    return (
      <MobileAdminLayout
        onLogout={() => setCurrentView('admin-mobile-login')}
        onSwitchToDesktop={() => setCurrentView('admin-dashboard')}
        onSwitchToCustomerMenu={() => setCurrentView('customer')}
      />
    );
  }

  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => setCurrentView('admin-dashboard')}
        onBackToCustomer={() => setCurrentView('customer')}
        onSwitchToMobileLogin={() => setCurrentView('admin-mobile-login')}
      />
    );
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminPortal
        onSwitchToCustomerMenu={() => setCurrentView('customer')}
        onLogout={() => setCurrentView('admin-login')}
        onSwitchToMobileView={() => setCurrentView('admin-mobile-dashboard')}
      />
    );
  }

  return (
    <CustomerApp
      onOpenAdminLogin={() => {
        if (window.innerWidth < 768) {
          setCurrentView('admin-mobile-login');
        } else {
          setCurrentView('admin-login');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}