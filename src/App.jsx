// ==============================================================================
// FILE: src/App.jsx
// PURPOSE: Root component orchestrating the view-only Beardista Brew Digital Menu.
// ==============================================================================

import React, { useState } from 'react';

// Import static data models from the centralized data module
import {
  customerFavoritesData,
  whatsBrewingData,
  whyChooseData,
  blendDetailsData,
  reviewsData,
  wifiData,
  faqData
} from './data/menu.jsx';

// Import presentational layout sections
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { CustomerFavorites } from './components/CustomerFavorites.jsx';
import { WhatsBrewing } from './components/WhatsBrewing.jsx';
import { OurStorySection } from './components/OurStorySection.jsx';
import OurStory from './components/OurStory.jsx';
import { WhyChooseUs } from './components/WhyChooseUs.jsx';
import { BeardistaBlend } from './components/BeardistaBlend.jsx';
import { CustomerVoice } from './components/CustomerVoice.jsx';
import { StayConnected } from './components/StayConnected.jsx';
import { Footer } from './components/Footer.jsx';
import MenuPage from './components/MenuPage.jsx';
import { FAQSection } from './components/FAQSection.jsx'; // <-- FIXED CAPITALIZATION

// Import modal inspection dialogs
import { ItemDetailsModal } from './components/ItemDetailsModal.jsx';
import { SurveyModal } from './components/SurveyModal.jsx';
import { EventDetailsModal } from './components/EventDetailsModal.jsx';
import { StoryModal } from './components/StoryModal.jsx';

export default function App() {
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

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] flex flex-col antialiased selection:bg-[#E58422] selection:text-white">
      
      {currentPage === 'story' ? (
        <OurStory
          onNavigate={(page) => setCurrentPage(page)}
          onOpenSurvey={() => setIsSurveyOpen(true)}
        />
      ) : currentPage === 'menu' ? (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onOpenSurvey={() => setIsSurveyOpen(true)}
          />
          <MenuPage
            onNavigate={(page) => setCurrentPage(page)}
            onSelectItem={(item) => setSelectedItem(item)}
          />
          <Footer />
        </>
      ) : (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
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
          
          {/* <-- FIXED COMPONENT RENDER --> */}
          <FAQSection faqs={faqData} />
          
          <Footer />
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
}