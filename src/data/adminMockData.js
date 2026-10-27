// Sample data for the (legacy) admin portal: AdminPortal.jsx and MobileAdminLayout.jsx.
// TEMPORARY: the original file was missing, so these are safe starting values.
// They keep /admin from crashing. Each one gets replaced by real Supabase data
// (hooks) one page at a time. Menu data is the first one to move.

import { CATEGORY_PILLS, initialMenuData } from '../features/old_admin//pages/MenuManagement.jsx';

// --- Menu (reuses the sample items that already live in MenuManagement.jsx) ---
export const initialMenuItems = initialMenuData;
export const initialCategories = CATEGORY_PILLS.map((name, index) => ({
  id: `cat-${index}`,
  name,
}));

// --- Dashboard ---
// icon must be one of: 'visit', 'survey', 'star', 'catalog'
export const initialAdminStats = [
  { id: 'stat-visits', icon: 'visit', label: 'Daily Visits', value: '0', change: '—', subtext: 'no data yet' },
  { id: 'stat-surveys', icon: 'survey', label: 'Survey Responses', value: '0', change: '—', subtext: 'no data yet' },
  { id: 'stat-rating', icon: 'star', label: 'Most Requested', value: '—', change: '—', subtext: 'no data yet' },
  { id: 'stat-catalog', icon: 'catalog', label: 'Active Catalog', value: '0', change: '—', subtext: 'items' },
];

// Each item: { id, name, category, price, orders, trend, image }
export const customerFavoritesThisMonth = [];

// --- Feedback ---
// Each item: { id, name, date, visitFrequency, rating, comment, preference, syncToVoice }
export const individualFeedbackList = [];

// --- Audit logs ---
// Each item: { id, date, time, user, action, actionType, itemAffected, itemId, previousValue, newValue }
export const initialAuditLogs = [];

// --- Content manager ---
export const initialContentData = {
  motto: '',
  founderName: '',
  founderTitle: '',
  founderBio: '',
  communityStory: '',
  blendRoastLevel: '',
  blendOrigins: '',
  blendNotes: '',
};

// --- Events manager ---
// status must be one of: 'Registration Active', 'Slots Full', 'Live Today', 'Concluded'
export const initialEventsData = {
  activeEvent: {
    title: '',
    subtitle: '',
    date: '',
    time: '',
    location: '',
    status: 'Registration Active',
    competitorFee: '',
    spectatorFee: '',
    competitorSlotsTotal: 0,
    competitorSlotsTaken: 0,
  },
};

// --- Settings ---
export const initialSettingsData = {
  storeName: '',
  tagline: '',
  address: '',
  openingTime: '',
  closingTime: '',
  wifiSSID: '',
  wifiPass: '',
};