// Sample data for the customer home page.
// TEMPORARY: the original data was missing, so these are placeholders.
// Replace the text with your real content, or swap each block for a
// Supabase hook (useMenuItems, useAnnouncements, useStoreSettings...) one page at a time.

import pastaImg from '@/assets/pasta.jpg';
import nachosImg from '@/assets/nachos.png';
import chickenImg from '@/assets/chicken_fingers.jpg';

// CustomerFavorites: array of { id, name, category, description, image }
export const customerFavoritesData = [
  {
    id: 'fav-1',
    name: 'Sample Pasta',
    category: 'Pasta',
    description: 'Sample description. Replace with your real best-seller.',
    image: pastaImg,
  },
  {
    id: 'fav-2',
    name: 'Sample Nachos',
    category: 'Food',
    description: 'Sample description. Replace with your real best-seller.',
    image: nachosImg,
  },
  {
    id: 'fav-3',
    name: 'Sample Chicken Fingers',
    category: 'Food',
    description: 'Sample description. Replace with your real best-seller.',
    image: chickenImg,
  },
];

// WhatsBrewing: { event: {...}, mustTry: {...} }
export const whatsBrewingData = {
  event: {
    tag: 'COMMUNITY EVENT',
    title: 'Latte Art Throwdown',
    description: 'Sample description. Replace with your real event summary.',
    buttonLabel: 'REGISTER & JOIN',
  },
  mustTry: {
    tag: 'MUST TRY',
    title: 'Tsamporado',
    description: 'Sample description. Replace with your real seasonal feature.',
    buttonLabel: 'VIEW DETAILS',
    details: {
      tastingNotes: 'Rich, chocolatey, comforting',
      allergens: 'Please ask our staff',
    },
  },
};

// WhyChooseUs: array of { id, title, description, iconType }
// iconType must be one of: 'coffee', 'sparkle', 'shield', 'users'
export const whyChooseData = [
  { id: 'why-1', iconType: 'coffee', title: 'Fresh Brews', description: 'Sample text. Replace with your real pillar.' },
  { id: 'why-2', iconType: 'sparkle', title: 'Bold Creations', description: 'Sample text. Replace with your real pillar.' },
  { id: 'why-3', iconType: 'shield', title: 'Quality Promise', description: 'Sample text. Replace with your real pillar.' },
  { id: 'why-4', iconType: 'users', title: 'Community First', description: 'Sample text. Replace with your real pillar.' },
];

// BeardistaBlend: array of { label, value } (3 cards)
export const blendDetailsData = [
  { label: 'ROAST', value: 'Sample Roast' },
  { label: 'ORIGIN', value: 'Sample Origin' },
  { label: 'NOTES', value: 'Sample Notes' },
];

// CustomerVoice: array of { id, quote, author }
export const reviewsData = [
  { id: 'rev-1', quote: 'Sample review. Replace with a real customer quote.', author: 'Sample Customer' },
  { id: 'rev-2', quote: 'Sample review. Replace with a real customer quote.', author: 'Sample Customer' },
  { id: 'rev-3', quote: 'Sample review. Replace with a real customer quote.', author: 'Sample Customer' },
];

// StayConnected: { ssid, password }
// Note: this ends up in the browser. Only put the public cafe WiFi here.
export const wifiData = {
  ssid: 'Sample-WiFi-Name',
  password: 'sample-password',
};

// FAQSection: array of { id, question, answer }
// Only the first answer comes from the Figma design; replace the TODO answers
// with your real cafe policies.
export const faqData = [
  {
    id: 'faq-1',
    question: 'Is this a good place to work or study?',
    answer:
      'Yes! We provide high-speed complimentary Wi-Fi, numerous power outlets, and comfortable seating specifically designed for work and study sessions.',
  },
  { id: 'faq-2', question: 'Are pets allowed?', answer: 'TODO: replace with your pet policy.' },
  { id: 'faq-3', question: 'Can we bring outside food or drinks?', answer: 'TODO: replace with your outside food and drinks policy.' },
  { id: 'faq-4', question: 'What payment methods do you accept?', answer: 'TODO: replace with your accepted payment methods.' },
];
