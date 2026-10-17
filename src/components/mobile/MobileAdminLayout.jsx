import React, { useState, useMemo } from 'react';

import {
  initialMenuItems,
  initialAuditLogs,
  initialContentData,
  initialAdminStats,
  customerFavoritesThisMonth,
  initialCategories,
  individualFeedbackList,
  initialEventsData,
  initialSettingsData
} from '../../config/data/adminMockData.js';

// Data sync for User Management
import { INITIAL_USERS } from '../pages/UserManagement.jsx';

// Desktop Survey Builder Modal
import { SurveyBuilderModal } from '../modals/SurveyBuilderModal.jsx';

// ==============================================================================
// PROFESSIONAL SVG ICON SYSTEM (Zero Emojis)
// ==============================================================================
const IconDashboard = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconMenu = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconAnalytics = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconContents = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconAudit = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconUsers = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconPlus = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);

const IconClose = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconSearch = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconChevronRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconChevronDown = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconEdit = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconTrash = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconCrown = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 16l2.5-9L12 12l4.5-5L19 16H5z M5 16h14v2H5v-2z" />
  </svg>
);

const IconShield = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconDownload = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconUpload = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const IconDocument = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconClipboard = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const IconDatabase = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const IconCoffee = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
  </svg>
);

const IconStarSolid = ({ className = 'w-3 h-3 text-amber-400' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const IconWarning = ({ className = 'w-5 h-5 text-rose-500' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconRefresh = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconCheck = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const IconDesktop = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconLogout = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconEye = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeOff = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

// Helper for price formatting
const formatPrice = (p) => {
  if (typeof p === 'number') return `₱${p.toFixed(2)}`;
  if (!p) return '₱0.00';
  const str = String(p);
  if (str.startsWith('₱')) return str;
  if (str.startsWith('P')) return `₱${str.slice(1)}`;
  return `₱${str}`;
};

// Helper for secure random password generator
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pass = 'Beardista#';
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// ==============================================================================
// MAIN COMPONENT: MobileAdminLayout
// ==============================================================================
export const MobileAdminLayout = ({
  activeTab: propActiveTab,
  onTabChange,
  onLogout,
  onSwitchToDesktop,
  onSwitchToCustomerMenu,
  children
}) => {
  // Navigation State: 'dashboard' | 'menu' | 'analytics' | 'contents' | 'users' | 'audit'
  const [currentTab, setCurrentTab] = useState(propActiveTab || 'dashboard');
  const activeTab = propActiveTab || currentTab;

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
    setIsBottomSheetOpen(false);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synced Live Application States from adminMockData
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [categories, setCategories] = useState(initialCategories);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [contentData, setContentData] = useState(initialContentData);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isGlobalAvailable, setIsGlobalAvailable] = useState(true);

  // Filter & Search States
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState('All Items');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // UI Interactive States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // User Management Drawers & Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Store Admin',
    status: 'Active',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [userFormError, setUserFormError] = useState('');

  // Toast Trigger
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // Log Audit Action Helper
  const logAudit = (action, actionType, itemAffected, itemId, previousValue, newValue) => {
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      action,
      actionType,
      itemAffected,
      itemId,
      previousValue,
      newValue,
      user: 'admin@beardistabrew.com'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Toggle individual item availability (synced with master global toggle)
  const handleToggleItem = (id) => {
    if (!isGlobalAvailable) {
      showToast('Global store availability is paused. Switch Global Store Online to update item inventory.');
      return;
    }
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = item.available !== undefined ? !item.available : !item.availability;
          logAudit(
            'Availability Toggle',
            'update',
            item.name,
            `menu-${id}`,
            updated ? 'Unavailable' : 'Available',
            updated ? 'Available' : 'Unavailable'
          );
          return { ...item, available: updated, availability: updated };
        }
        return item;
      })
    );
  };

  // Page Header Title mapping
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'menu':
        return 'Menu Management';
      case 'analytics':
        return 'Survey Analytics';
      case 'contents':
        return 'Content Manager';
      case 'users':
        return 'User Management';
      case 'audit':
        return 'Audit Logs';
      default:
        return 'Beardista Brew';
    }
  };

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const q = menuSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.flavorNotes && item.flavorNotes.toLowerCase().includes(q));

      const matchesCat =
        menuFilter === 'All Items' ||
        item.category?.toLowerCase() === menuFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [menuItems, menuSearch, menuFilter]);

  // Filtered users for User Management
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);

      const matchesRole =
        userRoleFilter === 'All' ||
        (userRoleFilter === 'Suspended' ? u.status === 'Suspended' : u.role === userRoleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // --------------------------------------------------------------------------
  // USER MANAGEMENT ACTIONS
  // --------------------------------------------------------------------------
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Store Admin',
      status: 'Active',
      password: generateRandomPassword()
    });
    setUserFormError('');
    setShowPassword(false);
    setPasswordCopied(false);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    const mappedRole = user.role === 'Owner' ? 'Owner Admin' : 'Store Admin';
    setUserFormData({
      firstName: user.firstName || user.name.split(' ')[0] || '',
      lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      role: mappedRole,
      status: user.status || 'Active',
      password: ''
    });
    setUserFormError('');
    setShowPassword(false);
    setPasswordCopied(false);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userFormData.firstName.trim() || !userFormData.lastName.trim()) {
      setUserFormError('Please enter both first and last name.');
      return;
    }
    if (!userFormData.email.trim() || !userFormData.email.includes('@')) {
      setUserFormError('Please enter a valid administrative email address.');
      return;
    }

    const normalizedRole = userFormData.role === 'Owner Admin' ? 'Owner' : 'Admin';
    const fullName = `${userFormData.firstName.trim()} ${userFormData.lastName.trim()}`;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                firstName: userFormData.firstName.trim(),
                lastName: userFormData.lastName.trim(),
                name: fullName,
                email: userFormData.email.trim().toLowerCase(),
                role: normalizedRole,
                status: userFormData.status
              }
            : u
        )
      );
      logAudit('Update User', 'update', fullName, editingUser.id, editingUser.role, normalizedRole);
      showToast(`User "${fullName}" updated successfully!`);
    } else {
      const newUser = {
        id: `usr-${Date.now()}`,
        firstName: userFormData.firstName.trim(),
        lastName: userFormData.lastName.trim(),
        name: fullName,
        email: userFormData.email.trim().toLowerCase(),
        role: normalizedRole,
        status: userFormData.status,
        lastLogin: 'Pending First Login',
        avatar: '/src/assets/beardista sign.jpg'
      };
      setUsers((prev) => [newUser, ...prev]);
      logAudit('Create Admin', 'create', fullName, newUser.id, 'None', `Role: ${normalizedRole}`);
      showToast(`New admin "${fullName}" added with role ${normalizedRole}.`);
    }

    setIsUserModalOpen(false);
  };

  const handleConfirmRevoke = () => {
    if (!userToDelete) return;
    const deletedName = userToDelete.name;
    const deletedId = userToDelete.id;
    setUsers((prev) => prev.filter((u) => u.id !== deletedId));
    logAudit('Revoke Access', 'delete', deletedName, deletedId, 'Active Access', 'Access Revoked');
    setUserToDelete(null);
    showToast(`Access revoked for ${deletedName}.`);
  };

  // --------------------------------------------------------------------------
  // BOTTOM SHEET ACTIONS
  // --------------------------------------------------------------------------
  const handleSheetAction = (actionKey) => {
    setIsBottomSheetOpen(false);

    switch (actionKey) {
      // Menu Tab Actions
      case 'add-product':
        setIsAddProductModalOpen(true);
        break;
      case 'add-category':
        setIsAddCategoryModalOpen(true);
        break;
      case 'import-csv':
        showToast('Menu CSV template generated. Upload CSV file to batch sync items.');
        break;

      // Analytics Tab Actions
      case 'create-survey':
        setIsSurveyModalOpen(true);
        break;
      case 'generate-pdf':
        showToast('Generating Executive CSAT & NPS PDF summary report...');
        setTimeout(() => showToast('Executive PDF generated and downloaded.'), 1000);
        break;
      case 'export-csv': {
        const csvContent =
          'data:text/csv;charset=utf-8,Date,Customer,Rating,Pillar,Comments\n' +
          individualFeedbackList
            .map((f) => `"${f.date}","${f.name}",${f.rating},"${f.preference}","${f.comment}"`)
            .join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'beardista_customer_survey_raw.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Customer survey responses exported to CSV.');
        break;
      }

      // Audit Tab Actions
      case 'backup-logs': {
        const jsonContent =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(
            JSON.stringify(
              {
                store: 'Beardista Brew Flagship',
                exportedAt: new Date().toISOString(),
                totalLogs: auditLogs.length,
                logs: auditLogs
              },
              null,
              2
            )
          );
        const link = document.createElement('a');
        link.setAttribute('href', jsonContent);
        link.setAttribute('download', 'beardista_audit_trail_backup.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Audit trail and security register backed up successfully.');
        break;
      }

      // User Management Tab Actions
      case 'add-admin':
        handleOpenAddUser();
        break;
      case 'export-users': {
        const csvContent =
          'data:text/csv;charset=utf-8,ID,Name,Email,Role,Status,LastLogin\n' +
          users.map((u) => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.lastLogin}"`).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'beardista_admin_directory.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Admin staff directory exported to CSV.');
        break;
      }

      // Dashboard & Contents Tab Actions
      case 'refresh-stock':
        showToast('Inventory levels verified: All 14 signature espresso roasts in stock.');
        break;
      case 'open-shift':
        showToast('Shift float verified: ₱5,000.00 cash float logged.');
        break;
      case 'add-barista':
        showToast('Barista photo roster uploader ready in Content Manager.');
        break;

      default:
        showToast(`Action executed: ${actionKey}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#19244E] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#E58422] selection:text-white flex flex-col relative antialiased">
      {/* Toast Notification Banner (Clean SVG indicator) */}
      {toast && (
        <div className="fixed top-14 left-4 right-4 z-[9999] bg-[#19244E] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-slideDown max-w-sm mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E58422] animate-pulse flex-shrink-0" />
          <span className="text-xs font-bold leading-tight">{toast}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. TOP HEADER                                                        */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        {/* Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="p-1.5 -ml-1 text-gray-700 hover:text-[#19244E] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer active:scale-95"
          aria-label="Open Navigation Menu"
        >
          <IconMenu className="w-6 h-6" />
        </button>

        {/* Centered Page Title */}
        <h1 className="text-base font-extrabold text-[#19244E] tracking-tight truncate max-w-[200px] text-center">
          {getPageTitle()}
        </h1>

        {/* Right Action / Profile Icon */}
        <div className="flex items-center gap-2">
          {onSwitchToDesktop && (
            <button
              type="button"
              onClick={onSwitchToDesktop}
              className="text-[10px] font-black text-[#E58422] bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 flex items-center gap-1 cursor-pointer transition-all"
              title="Switch to Desktop Admin"
            >
              <IconDesktop className="w-3.5 h-3.5 text-[#E58422]" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-[#19244E] text-white flex items-center justify-center font-black text-xs shadow-2xs border border-[#E58422]">
            BB
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT AREA (Handles scroll behind fixed bottom tab bar)       */}
      {/* ==================================================================== */}
      <main className="flex-1 pb-28 overflow-y-auto">
        {children ? (
          children
        ) : (
          <div className="max-w-md mx-auto p-4 space-y-5">
            {/* ---------------------------------------------------------------- */}
            {/* VIEW 1: DASHBOARD TAB                                            */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'dashboard' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-black text-[#19244E] tracking-tight">
                    Today's Snapshot
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    A quick look at current operational metrics.
                  </p>
                </div>

                {/* 2x2 Operational Metrics Grid (Synced with initialAdminStats) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1: Daily Visits */}
                  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">Daily Visits</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {initialAdminStats[0]?.change || '+12.4%'}
                      </span>
                    </div>
                    <div className="my-2">
                      <span className="text-3xl font-black text-[#19244E] tracking-tight">
                        {initialAdminStats[0]?.value || '1,428'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {initialAdminStats[0]?.subtext || 'vs. yesterday (1,270)'}
                    </span>
                  </div>

                  {/* Card 2: Responses */}
                  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">Responses</span>
                      <span className="text-[10px] font-extrabold text-[#E58422] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        Today
                      </span>
                    </div>
                    <div className="my-2">
                      <span className="text-3xl font-black text-[#19244E] tracking-tight">
                        {initialAdminStats[1]?.value || '384'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {initialAdminStats[1]?.subtext || '88% positive satisfaction'}
                    </span>
                  </div>

                  {/* Card 3: Most Requested */}
                  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      MOST REQUESTED
                    </span>
                    <div className="my-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-orange-50 text-[#E58422] flex items-center justify-center">
                        <IconCoffee className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-extrabold text-xs text-[#19244E] truncate">
                        {initialAdminStats[2]?.value || 'Alon at Apoy'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {initialAdminStats[2]?.change || '412 orders'}
                    </span>
                  </div>

                  {/* Card 4: Feedback (Dark Navy Card with 5 SVG Stars) */}
                  <div className="bg-[#19244E] text-white rounded-3xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-300">
                        FEEDBACK
                      </span>
                      <div className="flex items-center gap-0.5">
                        <IconStarSolid />
                        <IconStarSolid />
                        <IconStarSolid />
                        <IconStarSolid />
                        <IconStarSolid />
                      </div>
                    </div>
                    <p className="text-[11px] font-medium italic text-gray-200 my-1.5 leading-snug">
                      "{individualFeedbackList[0]?.comment || 'The Tsamporado really hits the spot especially in this rainy weather!'}"
                    </p>
                    <span className="text-[9px] text-[#E58422] text-right font-bold">
                      — {individualFeedbackList[0]?.name || 'Sarah J.'}
                    </span>
                  </div>
                </div>

                {/* Customer Favorites Section (Synced with customerFavoritesThisMonth) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-[#19244E]">
                      Customer Favorites
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('menu')}
                      className="text-xs font-bold text-[#E58422] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All Menu</span>
                      <IconChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {customerFavoritesThisMonth.map((fav) => (
                    <div
                      key={fav.id}
                      className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={fav.image}
                          alt={fav.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-black text-[#19244E] truncate">
                            {fav.name}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate">
                            {fav.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-black text-[#19244E]">{fav.orders}</div>
                        <div className="text-[9px] font-bold text-gray-400 tracking-wider">ORDERS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* VIEW 2: MENU MANAGEMENT TAB                                      */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'menu' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 pointer-events-none">
                    <IconSearch className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#E58422] outline-none shadow-2xs"
                  />
                  {menuSearch && (
                    <button
                      type="button"
                      onClick={() => setMenuSearch('')}
                      className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <IconClose className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills (Synced with categories) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['All Items', ...categories.filter((c) => c.name !== 'All Items').map((c) => c.name)].map((cat) => {
                    const isSelected = menuFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMenuFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-[#19244E] text-white shadow-2xs'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Master All Available Toggle */}
                <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isGlobalAvailable ? 'bg-blue-600 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-xs font-bold text-gray-700">
                      All Available <span className="text-gray-400 font-normal">[Master]</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isGlobalAvailable;
                      setIsGlobalAvailable(next);
                      showToast(next ? 'Global store ordering active.' : 'Global store ordering paused.');
                      logAudit(
                        'Global Availability Toggle',
                        'update',
                        'Store Catalog',
                        'SYS-CATALOG',
                        isGlobalAvailable ? 'Online' : 'Paused',
                        next ? 'Online' : 'Paused'
                      );
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer active:scale-95 ${
                      isGlobalAvailable ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        isGlobalAvailable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#19244E]">
                      MENU INVENTORY
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Showing {filteredMenuItems.length} live items
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="px-3 py-1 bg-[#E58422] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Items List (Synced with menuItems) */}
                <div className="space-y-2.5">
                  {filteredMenuItems.map((item) => {
                    const isItemAvailable = item.available !== undefined ? item.available : item.availability;
                    const effectiveAvailable = isGlobalAvailable && isItemAvailable;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0 transition-opacity ${
                              effectiveAvailable ? 'opacity-100' : 'opacity-40 grayscale'
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-black text-[#19244E] uppercase truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-gray-400 truncate">
                              {item.description || item.flavorNotes || 'Signature Beardista creation'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs font-extrabold text-[#19244E]">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleItem(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer active:scale-95 ${
                              effectiveAvailable ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                effectiveAvailable ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* VIEW 3: SURVEY ANALYTICS TAB                                     */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'analytics' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-[#19244E] tracking-tight">
                    Performance
                  </h2>
                  <button
                    type="button"
                    onClick={() => showToast('Filtered to This Week')}
                    className="px-3 py-1 bg-orange-50 text-[#E58422] border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>This Week</span>
                    <IconChevronDown className="w-3 h-3 text-[#E58422]" />
                  </button>
                </div>

                {/* Export Report Buttons */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    EXPORT REPORT
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSheetAction('export-csv')}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <IconDownload className="w-3.5 h-3.5 text-gray-500" />
                      <span>CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSheetAction('generate-pdf')}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <IconDocument className="w-3.5 h-3.5 text-gray-500" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">CSAT Score</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        +8.4%
                      </span>
                    </div>
                    <div className="my-2">
                      <span className="text-2xl font-black text-[#19244E]">4.8</span>
                      <span className="text-xs text-gray-400 font-bold ml-1">/ 5.0</span>
                    </div>
                    <span className="text-[10px] text-gray-400">vs. 4.4 last period</span>
                  </div>

                  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Total Responses</span>
                      <span className="text-[10px] font-extrabold text-[#E58422] bg-orange-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="my-2">
                      <span className="text-2xl font-black text-[#19244E]">
                        {individualFeedbackList.length * 90}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">Completion rate: 82%</span>
                  </div>
                </div>

                {/* Rating Distribution Card */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#19244E]">Rating Distribution</h3>
                    <span className="text-[10px] text-gray-400 font-bold">Total: 360</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { star: '5 Stars', pct: '72%', width: 'w-[72%]', color: 'bg-amber-500' },
                      { star: '4 Stars', pct: '18%', width: 'w-[18%]', color: 'bg-amber-500' },
                      { star: '3 Stars', pct: '6%', width: 'w-[6%]', color: 'bg-gray-300' },
                      { star: '2 Stars', pct: '3%', width: 'w-[3%]', color: 'bg-gray-300' },
                      { star: '1 Star', pct: '1%', width: 'w-[1%]', color: 'bg-rose-400' }
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-3">
                        <span className="w-14 text-[11px] font-bold text-gray-600">{row.star}</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.color} ${row.width}`} />
                        </div>
                        <span className="w-8 text-[11px] font-extrabold text-gray-700 text-right">
                          {row.pct}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-gray-400 text-center pt-1 border-t border-gray-100">
                    Peak response during weekend branches
                  </div>
                </div>

                {/* Key Customer Highlights */}
                <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Key Survey Highlights
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#19244E] p-2.5 bg-gray-50 rounded-xl">
                      <span className="flex items-center gap-2">
                        <IconCoffee className="w-4 h-4 text-[#E58422]" />
                        <span>Coffee Temperature & Taste</span>
                      </span>
                      <span className="text-emerald-600">96% Positive</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#19244E] p-2.5 bg-gray-50 rounded-xl">
                      <span className="flex items-center gap-2">
                        <IconUsers className="w-4 h-4 text-[#19244E]" />
                        <span>Barista Friendliness & Service</span>
                      </span>
                      <span className="text-emerald-600">94% Positive</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* VIEW 4: CONTENT MANAGER TAB (Synced with initialContentData)     */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'contents' && (
              <div className="space-y-4 animate-fadeIn pb-4">
                {/* Header & Publish Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#19244E] tracking-tight">
                      Content Manager (CMS)
                    </h2>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Update customer-facing story copy, blend specs, and team bios.
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => showToast('Content updates published successfully!')}
                    className="px-3.5 py-2 bg-[#E58422] hover:bg-[#d47414] text-white text-[10px] font-extrabold uppercase tracking-wide rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0"
                  >
                    Publish Changes
                  </button>
                </div>

                {/* Sub-Tabs (Visual match to Web Admin) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button type="button" className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#19244E] text-white shadow-2xs whitespace-nowrap">
                    Our Story & Founder
                  </button>
                  <button type="button" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-gray-600 border border-gray-200 whitespace-nowrap">
                    Coffee Specs
                  </button>
                  <button type="button" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-gray-600 border border-gray-200 whitespace-nowrap">
                    Barista Team Roster
                  </button>
                </div>

                {/* Brand Narrative & Founder / Visionary Form */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[#19244E]">Brand Narrative & Founder</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Displayed in the public About Us / Our Story sections.</p>
                  </div>

                  {/* Image Upload Area */}
                  <div className="p-3 border border-dashed border-gray-300 rounded-2xl flex items-start gap-3 bg-gray-50/50">
                    <img
                      src="/src/assets/beardista sign.jpg"
                      alt="Owner Portrait"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="text-[10px] font-black uppercase text-[#19244E]">Owner / Visionary Portrait</div>
                        <div className="text-[9px] text-gray-500 leading-tight mt-0.5">
                          Upload a high-resolution PNG or JPG portrait. Max 5MB.
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="px-3 py-1.5 bg-[#19244E] text-white text-[9px] font-bold rounded-lg active:scale-95 transition-transform">
                          Upload Image
                        </button>
                        <button type="button" className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-[9px] font-bold rounded-lg active:scale-95 transition-transform">
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Editable Text Fields */}
                  <div className="space-y-3.5 pt-1">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-[#19244E] mb-1.5">
                        Official Brand Motto
                      </label>
                      <input
                        type="text"
                        defaultValue={contentData.motto}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-[#19244E] mb-1.5">
                          Owner / Founder Name
                        </label>
                        <input
                          type="text"
                          defaultValue={contentData.founderName}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-[#19244E] mb-1.5">
                          Founder Title
                        </label>
                        <input
                          type="text"
                          defaultValue={contentData.founderTitle}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-[#19244E] mb-1.5">
                        Pandemic Origins & Vision (Paragraph 1)
                      </label>
                      <textarea
                        rows={4}
                        defaultValue={contentData.founderBio}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422] resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-[#19244E] mb-1.5">
                        Community Gratitude (Paragraph 2)
                      </label>
                      <textarea
                        rows={3}
                        defaultValue={contentData.communityStory}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422] resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* ---------------------------------------------------------------- */}
            {/* VIEW 5: USER MANAGEMENT TAB (Requirement 4)                      */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'users' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Header with Title and Add Button */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[#19244E] tracking-tight">
                        User Management
                      </h2>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded border border-indigo-200">
                        RBAC
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Personnel credentials and role permissions
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddUser}
                    className="px-3.5 py-2 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Add Admin</span>
                  </button>
                </div>

                {/* Metrics Pill Badge: Active & Suspended Counts */}
                <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-2xs flex items-center justify-between text-xs font-bold text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{users.filter((u) => u.status === 'Active').length} Active Accounts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{users.filter((u) => u.status === 'Suspended').length} Suspended</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 pointer-events-none">
                    <IconSearch className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email, or role..."
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#E58422] outline-none shadow-2xs"
                  />
                  {userSearch && (
                    <button
                      type="button"
                      onClick={() => setUserSearch('')}
                      className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <IconClose className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills: All Personnel, Owner, Admin, Suspended */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Owner', 'Admin', 'Suspended'].map((filter) => {
                    const isSelected = userRoleFilter === filter;
                    const count =
                      filter === 'All'
                        ? users.length
                        : filter === 'Suspended'
                        ? users.filter((u) => u.status === 'Suspended').length
                        : users.filter((u) => u.role === filter).length;

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setUserRoleFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#19244E] text-white shadow-2xs'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span>{filter === 'All' ? 'All Personnel' : filter}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Users List Cards */}
                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                        <IconUsers className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-gray-700">No users match your criteria</div>
                      <p className="text-[11px] text-gray-400">Try adjusting your search query or role filter.</p>
                    </div>
                  ) : (
                    filteredUsers.map((u) => {
                      const isOwner = u.role === 'Owner';
                      const isActive = u.status === 'Active';

                      return (
                        <div
                          key={u.id}
                          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-2xs bg-gray-100 flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = '/src/assets/beardista sign.jpg';
                                }}
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-black text-[#19244E] truncate">
                                  {u.name}
                                </div>
                                <div className="text-[11px] text-gray-500 font-mono truncate">
                                  {u.email}
                                </div>
                                <div className="text-[9px] text-gray-400 mt-0.5">
                                  ID: {u.id}
                                </div>
                              </div>
                            </div>

                            {/* Role Badge (Crown / Shield SVG) */}
                            {isOwner ? (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black rounded-lg inline-flex items-center gap-1 flex-shrink-0">
                                <IconCrown className="w-3 h-3 text-purple-600" />
                                <span>Owner</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black rounded-lg inline-flex items-center gap-1 flex-shrink-0">
                                <IconShield className="w-3 h-3 text-amber-700" />
                                <span>Admin</span>
                              </span>
                            )}
                          </div>

                          {/* Status & Last Login Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black inline-flex items-center gap-1.5 ${
                                  isActive
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isActive ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                                <span>{u.status}</span>
                              </span>
                              <span className="text-gray-400 text-[10px] truncate max-w-[140px]">
                                {u.lastLogin}
                              </span>
                            </div>

                            {/* Actions: Edit & Revoke Access */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                <IconEdit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setUserToDelete(u)}
                                className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer active:scale-95"
                                title="Revoke access"
                              >
                                <IconTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* VIEW 6: AUDIT & LOGS TAB (Synced with initialAuditLogs)          */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'audit' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#19244E] tracking-tight">
                      Audit Logs
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Security records, pricing updates, and shifts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSheetAction('backup-logs')}
                    className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-1 shadow-2xs"
                  >
                    <IconDatabase className="w-3.5 h-3.5 text-[#E58422]" />
                    <span>Backup</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#19244E]">{log.action}</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                          {log.actionType}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 flex items-center justify-between">
                        <span className="truncate max-w-[200px]">
                          Affected: <strong>{log.itemAffected}</strong>
                        </span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {log.date}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center justify-between font-mono bg-gray-50 px-2 py-1 rounded-lg">
                        <span className="truncate">{log.newValue}</span>
                        <span className="text-[9px] text-gray-400">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* 2. FIXED BOTTOM TAB BAR (5 primary tabs, pure SVG icons)             */}
      {/* ==================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 py-1.5 px-2 flex items-center justify-around shadow-lg select-none">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => handleSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[#E58422]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Dashboard</span>
        </button>

        {/* Tab 2: Menu */}
        <button
          type="button"
          onClick={() => handleSelectTab('menu')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'text-[#E58422]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconMenu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Menu</span>
        </button>

        {/* Tab 3: Analytics */}
        <button
          type="button"
          onClick={() => handleSelectTab('analytics')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'text-[#E58422]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconAnalytics className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Analytics</span>
        </button>

        {/* Tab 4: Contents */}
        <button
          type="button"
          onClick={() => handleSelectTab('contents')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'contents'
              ? 'text-[#E58422]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconContents className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Contents</span>
        </button>

        {/* Tab 5: Audit & Logs */}
        <button
          type="button"
          onClick={() => handleSelectTab('audit')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'text-[#E58422]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconAudit className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Audit & Logs</span>
        </button>
      </nav>

      {/* ==================================================================== */}
      {/* 3. DYNAMIC CONTEXT-AWARE FAB & BOTTOM SHEET                          */}
      {/* ==================================================================== */}
      {isBottomSheetOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-45 transition-opacity cursor-pointer animate-fadeIn"
          onClick={() => setIsBottomSheetOpen(false)}
        />
      )}

      {/* Floating Action Button (Fixed bottom-20 right-4) */}
      <button
        type="button"
        onClick={() => setIsBottomSheetOpen(!isBottomSheetOpen)}
        className={`fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-[#E58422] text-white flex items-center justify-center shadow-xl shadow-orange-500/30 transition-all duration-200 cursor-pointer active:scale-90 ${
          isBottomSheetOpen ? 'rotate-90 bg-[#d45612]' : 'hover:scale-105'
        }`}
        aria-label="Toggle Quick Actions"
      >
        {isBottomSheetOpen ? (
          <IconClose className="w-7 h-7" />
        ) : (
          <IconPlus className="w-7 h-7" />
        )}
      </button>

      {/* Dynamic Cards inside Bottom Sheet */}
      {isBottomSheetOpen && (
        <div className="fixed bottom-36 left-4 right-4 z-48 space-y-2.5 max-w-sm mx-auto animate-slideUp">
          {/* TAB: MENU ACTIONS */}
          {activeTab === 'menu' && (
            <>
              <button
                type="button"
                onClick={() => handleSheetAction('add-product')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-orange-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center flex-shrink-0">
                    <IconPlus className="w-6 h-6 text-[#E58422]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Add New Product</span>
                      <span className="px-2 py-0.5 bg-[#FFF3E7] text-[#E58422] text-[10px] font-black rounded-full border border-orange-200">
                        Catalog
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Create coffee, beverage, or pastry
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleSheetAction('add-category')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-orange-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center flex-shrink-0">
                    <IconPlus className="w-6 h-6 text-[#E58422]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Add New Category</span>
                      <span className="px-2 py-0.5 bg-[#FFF3E7] text-[#E58422] text-[10px] font-black rounded-full border border-orange-200">
                        Catalog
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Create coffee, beverage, or pastry
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleSheetAction('import-csv')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-amber-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <IconUpload className="w-5 h-5 text-amber-800" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Import Menu CSV</span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-black rounded-full border border-amber-200">
                        Data
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Batch sync recipes & items
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </>
          )}

          {/* TAB: ANALYTICS ACTIONS */}
          {activeTab === 'analytics' && (
            <>
              <button
                type="button"
                onClick={() => handleSheetAction('create-survey')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-orange-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center flex-shrink-0">
                    <IconClipboard className="w-5 h-5 text-[#E58422]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Create Customer Survey</span>
                      <span className="px-2 py-0.5 bg-[#FFF3E7] text-[#E58422] text-[10px] font-black rounded-full border border-orange-200">
                        Camp
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Deploy new QR-code feedback form
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleSheetAction('generate-pdf')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-emerald-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <IconDocument className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Generate Executive PDF</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">
                        Report
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Weekly CSAT & NPS summary digest
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleSheetAction('export-csv')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-amber-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <IconDownload className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Export Survey CSV</span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-200">
                        Raw Data
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Download complete responses sheet
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </>
          )}

          {/* TAB: USER MANAGEMENT ACTIONS */}
          {activeTab === 'users' && (
            <>
              <button
                type="button"
                onClick={() => handleSheetAction('add-admin')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-orange-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center flex-shrink-0">
                    <IconUsers className="w-6 h-6 text-[#E58422]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Add New Admin</span>
                      <span className="px-2 py-0.5 bg-[#FFF3E7] text-[#E58422] text-[10px] font-black rounded-full border border-orange-200">
                        Staff
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Provision credentials & role privileges
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleSheetAction('export-users')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-blue-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <IconDownload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Export Staff Directory</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-200">
                        Roster
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Download complete admin accounts CSV
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </>
          )}

          {/* TAB: AUDIT & LOGS ACTIONS */}
          {activeTab === 'audit' && (
            <button
              type="button"
              onClick={() => handleSheetAction('backup-logs')}
              className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-amber-50/20"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <IconDatabase className="w-6 h-6 text-amber-800" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#19244E]">Backup & Export Logs</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-black rounded-full border border-amber-200">
                      Audit
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    Download audit trail & register history
                  </p>
                </div>
              </div>
              <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          )}

          {/* TAB: DASHBOARD ACTIONS */}
          {activeTab === 'dashboard' && (
            <>
              <button
                type="button"
                onClick={() => handleSheetAction('refresh-stock')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-orange-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center flex-shrink-0">
                    <IconRefresh className="w-6 h-6 text-[#E58422]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Quick Stock Refresh</span>
                      <span className="px-2 py-0.5 bg-[#FFF3E7] text-[#E58422] text-[10px] font-black rounded-full border border-orange-200">
                        Inventory
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Verify bean batch levels & daily supplies
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleSheetAction('open-shift')}
                className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-emerald-50/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <IconShield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#19244E]">Verify Cash Float</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">
                        Shift
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      Log register float count & shift start
                    </p>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </>
          )}

          {/* TAB: CONTENTS ACTIONS */}
          {activeTab === 'contents' && (
            <button
              type="button"
              onClick={() => handleSheetAction('add-barista')}
              className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between gap-3 text-left transition-transform active:scale-98 cursor-pointer hover:bg-orange-50/20"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center flex-shrink-0">
                  <IconUsers className="w-6 h-6 text-[#E58422]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#19244E]">Add Barista to Roster</span>
                    <span className="px-2 py-0.5 bg-[#FFF3E7] text-[#E58422] text-[10px] font-black rounded-full border border-orange-200">
                      Staff
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    Upload PNG/JPG portrait & bio
                  </p>
                </div>
              </div>
              <IconChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. SLIDE-OUT NAVIGATION DRAWER (From Hamburger ≡)                    */}
      {/* ==================================================================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer animate-fadeIn"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#19244E] text-white shadow-2xl flex flex-col justify-between z-50 animate-slideRight">
            <div>
              {/* Drawer Brand Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E58422] text-white flex items-center justify-center font-black text-sm shadow-md">
                    BB
                  </div>
                  <div>
                    <h2 className="font-black text-sm tracking-tight text-white leading-tight">
                      Beardista Brew
                    </h2>
                    <p className="text-[10px] uppercase font-bold text-[#E58422] tracking-wider">
                      Mobile Terminal
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <IconClose className="w-5 h-5" />
                </button>
              </div>

              {/* Staff Profile Card */}
              <div className="p-4 mx-4 mt-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E58422] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">
                    Jim Carlo Gorospe
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    admin@beardistabrew.com
                  </div>
                  <span className="inline-block px-1.5 py-0.2 bg-orange-500/20 text-[#E58422] text-[9px] font-black rounded mt-1">
                    OWNER ADMIN
                  </span>
                </div>
              </div>

              {/* Navigation Items (Includes dedicated User Management) */}
              <nav className="p-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard Overview', icon: <IconDashboard className="w-4 h-4" /> },
                  { id: 'menu', label: 'Menu Management', icon: <IconMenu className="w-4 h-4" /> },
                  { id: 'analytics', label: 'Survey Analytics', icon: <IconAnalytics className="w-4 h-4" /> },
                  { id: 'contents', label: 'Content Manager', icon: <IconContents className="w-4 h-4" /> },
                  { id: 'users', label: 'User Management', icon: <IconUsers className="w-4 h-4" />, badge: 'RBAC' },
                  { id: 'audit', label: 'Audit Logs', icon: <IconAudit className="w-4 h-4" /> }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer active:scale-98 ${
                        isActive
                          ? 'bg-[#E58422] text-white shadow-md shadow-orange-500/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-white' : 'text-gray-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-orange-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              {onSwitchToDesktop && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onSwitchToDesktop();
                  }}
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <IconDesktop className="w-4 h-4 text-white" />
                  <span>Switch to Desktop View</span>
                </button>
              )}

              {onSwitchToCustomerMenu && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onSwitchToCustomerMenu();
                  }}
                  className="w-full py-2.5 px-3 bg-[#E58422]/20 hover:bg-[#E58422]/30 text-[#E58422] border border-[#E58422]/40 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <IconCoffee className="w-4 h-4 text-[#E58422]" />
                  <span>View Customer Menu</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <IconLogout className="w-4 h-4 text-rose-400" />
                  <span>Lock Terminal / Logout</span>
                </button>
              )}

              <div className="text-[10px] text-gray-500 text-center pt-1 font-mono">
                Terminal ID: TER-MNL-BAY-01
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. FULLY FUNCTIONAL 'ADD NEW PRODUCT' MODAL (Requirement 3)          */}
      {/* ==================================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddProductModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full z-10 shadow-2xl space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center">
                  <IconPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#19244E]">Add New Product</h3>
                  <p className="text-[10px] text-gray-400">Live digital menu catalog item</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.productName.value.trim();
                const price = Number(form.productPrice.value);
                const category = form.productCategory.value;
                const desc = form.productDesc.value.trim() || 'Signature handcrafted specialty creation.';
                const flavor = form.productFlavor.value.trim() || 'Rich notes of chocolate and roasted hazelnut.';
                const allergens = form.productAllergens.value.trim() || 'None';
                const image = form.productImage.value.trim() || '/src/assets/hiromi.png';

                const newProduct = {
                  id: `menu-${Date.now()}`,
                  name,
                  category,
                  price: `₱${price.toFixed(2)}`,
                  description: desc,
                  flavorNotes: flavor,
                  allergens,
                  available: true,
                  image
                };

                setMenuItems((prev) => [newProduct, ...prev]);
                logAudit('Create Product', 'create', name, newProduct.id, 'None', `Price: ₱${price.toFixed(2)}, Category: ${category}`);
                setIsAddProductModalOpen(false);
                showToast(`Product "${name}" added to menu catalog!`);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Product Name *
                </label>
                <input
                  name="productName"
                  required
                  placeholder="e.g. Caramel Beard Cortado"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                    Price (PHP ₱) *
                  </label>
                  <input
                    name="productPrice"
                    type="number"
                    step="5"
                    required
                    defaultValue="160"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                    Category *
                  </label>
                  <select
                    name="productCategory"
                    defaultValue="Signatures"
                    className="w-full px-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    {categories.filter((c) => c.name !== 'All Items').map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Description
                </label>
                <textarea
                  name="productDesc"
                  rows={2}
                  placeholder="Rich double espresso poured over textured milk..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Flavor Profile / Tasting Notes
                </label>
                <input
                  name="productFlavor"
                  placeholder="Dark cocoa, roasted almond, velvety finish"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                    Allergens
                  </label>
                  <input
                    name="productAllergens"
                    defaultValue="Dairy"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                    Preset Image
                  </label>
                  <select
                    name="productImage"
                    className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="/src/assets/hiromi.png">Iced Americano</option>
                    <option value="/src/assets/beardista blanc.jpg">Latte / Flat White</option>
                    <option value="/src/assets/alon at apoy.png">Cold Brew Tonic</option>
                    <option value="/src/assets/goatee.png">Mocha Signature</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. FULLY FUNCTIONAL 'ADD NEW CATEGORY' MODAL (Requirement 3)         */}
      {/* ==================================================================== */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddCategoryModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full z-10 shadow-2xl space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <IconPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#19244E]">Add New Category</h3>
                  <p className="text-[10px] text-gray-400">Department classification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.categoryName.value.trim();
                const dept = form.categoryDept.value;
                const slug = name.toLowerCase().replace(/\s+/g, '-');

                const newCategory = {
                  id: `cat-${Date.now()}`,
                  name,
                  count: 0,
                  slug,
                  department: dept
                };

                setCategories((prev) => [...prev, newCategory]);
                logAudit('Create Category', 'create', name, newCategory.id, 'None', `Department: ${dept}`);
                setIsAddCategoryModalOpen(false);
                showToast(`Category "${name}" added to menu catalog!`);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Category Name *
                </label>
                <input
                  name="categoryName"
                  required
                  placeholder="e.g. Single-Origin Pour Overs"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Department / Group *
                </label>
                <select
                  name="categoryDept"
                  defaultValue="Beverages & Espresso"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="Beverages & Espresso">Beverages & Espresso</option>
                  <option value="Signature Creations">Signature Creations</option>
                  <option value="Savory Kitchen & Pasta">Savory Kitchen & Pasta</option>
                  <option value="Bakery & Bar Bites">Bakery & Bar Bites</option>
                  <option value="Matcha & Tea Bar">Matcha & Tea Bar</option>
                  <option value="Merchandise & Retail">Merchandise & Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Sort Priority (Order)
                </label>
                <input
                  name="sortPriority"
                  type="number"
                  defaultValue="1"
                  min="1"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Tag Color Scheme
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {['#E58422', '#19244E', '#10B981', '#F43F5E', '#8B5CF6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      style={{ backgroundColor: color }}
                      className="w-7 h-7 rounded-full shadow-2xs border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. ADD / EDIT ADMIN USER MODAL (Requirement 4)                       */}
      {/* ==================================================================== */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsUserModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full z-10 shadow-2xl space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E58422] text-white flex items-center justify-center font-bold text-xs">
                  {editingUser ? <IconEdit className="w-4 h-4" /> : <IconPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#19244E]">
                    {editingUser ? 'Edit Admin Personnel' : 'Add New Admin'}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    {editingUser ? editingUser.name : 'Provision portal credentials'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {userFormError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
                <IconWarning className="w-4 h-4 flex-shrink-0" />
                <span>{userFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                    placeholder="e.g. Maria"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                    placeholder="e.g. Santos"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="admin@beardistabrew.com"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Role Assignment *
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] outline-none focus:ring-2 focus:ring-[#E58422] cursor-pointer"
                >
                  <option value="Owner Admin">Owner Admin (Full System Privileges)</option>
                  <option value="Store Admin">Store Admin (Menu, Availability, & Survey Ops)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#19244E] mb-1">
                  Account Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserFormData({ ...userFormData, status: 'Active' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      userFormData.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Active</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserFormData({ ...userFormData, status: 'Suspended' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      userFormData.status === 'Suspended'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Suspended</span>
                  </button>
                </div>
              </div>

              {/* Password Generator */}
              <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#19244E]">
                    Temporary Password
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newPass = generateRandomPassword();
                      setUserFormData((prev) => ({ ...prev, password: newPass }));
                      setShowPassword(true);
                      setPasswordCopied(false);
                    }}
                    className="text-[10px] font-extrabold text-[#E58422] hover:text-[#c46914] flex items-center gap-1 cursor-pointer"
                  >
                    <IconRefresh className="w-3 h-3 text-[#E58422]" />
                    <span>Generate</span>
                  </button>
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder={editingUser ? 'Leave blank to preserve' : 'Click Generate'}
                    className="w-full pl-3 pr-16 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 outline-none"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                    </button>
                    {userFormData.password && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(userFormData.password);
                          setPasswordCopied(true);
                          setTimeout(() => setPasswordCopied(false), 2000);
                        }}
                        className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-bold rounded cursor-pointer"
                      >
                        {passwordCopied ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 8. CENTERED REVOKE ACCESS CONFIRMATION MODAL (Requirement 4)         */}
      {/* ==================================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setUserToDelete(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 z-10 animate-scaleUp space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <IconWarning className="w-6 h-6 text-rose-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-[#19244E]">
                Revoke Admin Access
              </h3>
              <p className="text-xs font-bold text-gray-800">
                Are you sure you want to revoke this user's access?
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
              <img
                src={userToDelete.avatar}
                alt={userToDelete.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.target.src = '/src/assets/beardista sign.jpg';
                }}
              />
              <div className="min-w-0 flex-1 text-left">
                <div className="text-xs font-extrabold text-[#19244E] truncate">
                  {userToDelete.name}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {userToDelete.email}
                </div>
                <div className="text-[10px] font-bold text-[#E58422]">
                  Role: {userToDelete.role}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              This action will immediately terminate this administrative account and invalidate all session tokens.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 9. SURVEY BUILDER MODAL                                              */}
      {/* ==================================================================== */}
      <SurveyBuilderModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        onSave={(surveyData) => {
          setIsSurveyModalOpen(false);
          logAudit('Publish Survey', 'create', surveyData.title, 'SURV-NEW', 'Draft', 'Published to customer app');
          showToast(`Customer survey "${surveyData.title}" created & QR code deployed!`);
        }}
      />
    </div>
  );
};

export default MobileAdminLayout;