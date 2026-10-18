import React, { useState } from 'react';

// Mock Data
import {
  initialAdminStats,
  customerFavoritesThisMonth,
  initialCategories,
  initialMenuItems,
  initialAuditLogs,
  individualFeedbackList,
  initialContentData,
  initialEventsData,
  initialSettingsData
} from '@/data/adminMockData.jsx';

// Pages / Views
import { LoginView } from './pages/LoginView.jsx';
import { DashboardView } from './pages/DashboardView.jsx';
import { MenuManagementView } from './pages/MenuManagementView.jsx';
import { AnalyticsReportsView } from './pages/AnalyticsReportsView.jsx';
import { ContentManagerView } from './pages/ContentManagerView.jsx';
import { EventsManagerView } from './pages/EventsManagerView.jsx';
import { AuditLogsView } from './pages/AuditLogsView.jsx';
import { UserManagement } from './pages/UserManagement.jsx';
import { SettingsView } from './pages/SettingsView.jsx';

// Slide-Over Drawers 
import { AddCategoryDrawer } from './drawers/AddCategoryDrawer.jsx';
import { EditMenuItemDrawer } from './drawers/EditMenuItemDrawer.jsx';

// Modals
import { ChangePasswordModal } from './auth/ChangePasswordModal.jsx';
import { LogoutModal } from './auth/LogoutModal.jsx';
import { SurveyBuilderModal } from './modals/SurveyBuilderModal.jsx';

export const AdminPortal = ({ onSwitchToCustomerMenu, onLogout, onSwitchToMobileView }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState(initialAdminStats);
  const [favorites, setFavorites] = useState(customerFavoritesThisMonth);
  const [categories, setCategories] = useState(initialCategories);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [feedbackList, setFeedbackList] = useState(individualFeedbackList);
  const [contentData, setContentData] = useState(initialContentData);
  const [eventsData, setEventsData] = useState(initialEventsData);
  const [settings, setSettings] = useState(initialSettingsData);
  const [globalAvailability, setGlobalAvailability] = useState(true);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSurveyBuilderOpen, setIsSurveyBuilderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const logAudit = (action, actionType, itemAffected, itemId, previousValue, newValue) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC';
    const newLog = {
      id: `log-${Date.now()}`,
      date: dateStr,
      time: timeStr,
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

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.username || 'Admin'}!`);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsAuthenticated(false);
    showToast('You have been logged out of the Admin Portal.');
    if (onLogout) {
      onLogout();
    }
  };

  const handleToggleGlobalAvailability = () => {
    const nextState = !globalAvailability;
    setGlobalAvailability(nextState);
    showToast(nextState ? 'Global Availability: Store Menu Online' : 'Global Availability: Store Menu Paused');
    logAudit('System Mode', 'sync', 'Global Availability', 'SYS-AVAIL', globalAvailability ? 'Online' : 'Paused', nextState ? 'Online' : 'Paused');
  };

  const handleToggleItemAvailability = (itemId) => {
    if (!globalAvailability) {
      showToast('Global Store Availability is paused. Switch Global Store Online to update item inventory.');
      return;
    }
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const currentStatus = item.available !== undefined ? item.available : item.availability;
          const updated = !currentStatus;
          logAudit('Availability Toggle', 'update', item.name, item.id, currentStatus ? 'Available' : 'Unavailable', updated ? 'Available' : 'Unavailable');
          showToast(`${item.name} is now ${updated ? 'available' : 'unavailable'}`);
          return { ...item, availability: updated, available: updated };
        }
        return item;
      })
    );
  };

  const handleSaveCategory = (newCat) => {
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created successfully!`);
    logAudit('Create Category', 'create', newCat.name, newCat.id, 'None', 'New category added');
  };

  const handleSaveItem = (savedItem) => {
    const existingIndex = menuItems.findIndex((i) => i.id === savedItem.id);
    if (existingIndex >= 0) {
      const prev = menuItems[existingIndex];
      setMenuItems((prevList) => prevList.map((item) => (item.id === savedItem.id ? savedItem : item)));
      showToast(`Updated "${savedItem.name}" successfully.`);
      logAudit('Update Item', 'update', savedItem.name, savedItem.id, `₱${prev.price}`, `₱${savedItem.price}`);
    } else {
      setMenuItems((prevList) => [savedItem, ...prevList]);
      showToast(`Added "${savedItem.name}" to menu inventory.`);
      logAudit('Create Item', 'create', savedItem.name, savedItem.id, 'None', `Base Price: ₱${savedItem.price}`);
    }
  };

  const handleArchiveItem = (item) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
    showToast(`"${item.name}" moved to archive.`);
    logAudit('Archive Item', 'delete', item.name, item.id, 'Catalog Active', 'Archived / Removed from active menu');
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setIsEditItemOpen(true);
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsEditItemOpen(true);
  };

  const handleToggleSyncVoice = (feedbackId) => {
    setFeedbackList((prev) =>
      prev.map((f) => {
        if (f.id === feedbackId) {
          const next = !f.syncToVoice;
          showToast(next ? `Synced ${f.name}'s review to Customer Voice.` : `Removed review from Customer Voice.`);
          return { ...f, syncToVoice: next };
        }
        return f;
      })
    );
  };

  const handleArchiveFeedback = (feedbackId) => {
    setFeedbackList((prev) => prev.filter((f) => f.id !== feedbackId));
    showToast('Customer feedback record archived.');
    logAudit('Archive Feedback', 'delete', 'Customer Feedback Record', feedbackId, 'Active', 'Archived');
  };

  const handleSaveContent = (newContent) => {
    setContentData(newContent);
    showToast('Public brand story and team roster published!');
    logAudit('Update Content', 'update', 'Brand Story & Team Roster', 'CMS-CONTENT', 'Previous Version', 'New Live Content Published');
  };

  const handleSaveEvent = (updatedEvent) => {
    setEventsData((prev) => ({ ...prev, activeEvent: updatedEvent }));
    showToast(`Event "${updatedEvent.title}" configuration published!`);
    logAudit('Update Event', 'update', updatedEvent.title, 'EV-ACTIVE', 'Previous Setup', `Status: ${updatedEvent.status}`);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    showToast('Café details and Wi-Fi configuration saved!');
    logAudit('Update Settings', 'update', 'Store & Wi-Fi Settings', 'CONF-STORE', 'Previous Config', 'New Settings Applied');
  };

  const handleSaveSurvey = (survey) => {
    showToast(`Survey "${survey.title}" published!`);
    logAudit('Publish Survey', 'create', survey.title, 'SURV-NEW', 'Draft', 'Published to customer app');
  };

  if (!isAuthenticated) {
    return (
      <LoginView onLogin={handleLogin} onSwitchToCustomerMenu={onSwitchToCustomerMenu} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-row relative font-['Plus_Jakarta_Sans',sans-serif] text-gray-900">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#19244E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-slideDown">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E58422] animate-pulse" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* RENDER INLINED SIDEBAR HERE */}
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
        onSwitchToCustomerMenu={onSwitchToCustomerMenu}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Beardista Brew · Caloocan Flagship
            </span>
            <h2 className="text-base font-extrabold text-[#19244E] capitalize">
              {activePage}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchToMobileView && (
              <button
                type="button"
                onClick={onSwitchToMobileView}
                className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#E58422] border border-orange-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <span>📱</span>
                <span>Mobile App Shell</span>
              </button>
            )}


            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#19244E] text-white text-xs font-black flex items-center justify-center">
                BB
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-[#19244E]">Administrator</div>
                <div className="text-[10px] text-gray-400">admin@beardistabrew.com</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {activePage === 'dashboard' && (
            <DashboardView
              stats={stats}
              favorites={favorites}
              globalAvailability={globalAvailability}
              onToggleGlobalAvailability={handleToggleGlobalAvailability}
              onNavigateToMenu={() => setActivePage('menu')}
            />
          )}

          {activePage === 'menu' && (
            <MenuManagementView
              items={menuItems}
              categories={categories}
              globalAvailability={globalAvailability}
              onToggleGlobalAvailability={handleToggleGlobalAvailability}
              onOpenAddCategory={() => setIsAddCategoryOpen(true)}
              onOpenAddItem={handleOpenAddItem}
              onEditItem={handleOpenEditItem}
              onToggleItemAvailability={handleToggleItemAvailability}
              onArchiveItem={handleArchiveItem}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsReportsView
              feedbackList={feedbackList}
              onOpenSurveyBuilder={() => setIsSurveyBuilderOpen(true)}
              onToggleSyncVoice={handleToggleSyncVoice}
              onArchiveFeedback={handleArchiveFeedback}
            />
          )}

          {activePage === 'content' && (
            <ContentManagerView contentData={contentData} onSaveContent={handleSaveContent} />
          )}

          {activePage === 'events' && (
            <EventsManagerView eventsData={eventsData} onSaveEvent={handleSaveEvent} />
          )}

          {activePage === 'audit' && (
            <AuditLogsView logs={auditLogs} />
          )}

          {activePage === 'users' && (
            <UserManagement onLogAudit={logAudit} />
          )}

          {activePage === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onOpenChangePassword={() => setIsChangePasswordOpen(true)}
              onNavigateToUsers={() => setActivePage('users')}
            />
          )}
        </div>
      </main>

      <AddCategoryDrawer isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} onSave={handleSaveCategory} />
      <EditMenuItemDrawer isOpen={isEditItemOpen} item={editingItem} onClose={() => setIsEditItemOpen(false)} onSave={handleSaveItem} onArchive={handleArchiveItem} />
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} onSuccess={(msg) => showToast(msg)} />
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />
      <SurveyBuilderModal isOpen={isSurveyBuilderOpen} onClose={() => setIsSurveyBuilderOpen(false)} onSave={handleSaveSurvey} />
    </div>
  );
};

// ==============================================================================
// INLINED ADMIN SIDEBAR COMPONENT (No imports needed)
// ==============================================================================
const AdminSidebar = ({ activePage, onNavigate, onOpenLogout, onSwitchToCustomerMenu }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'menu',
      label: 'Menu Management',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'content',
      label: 'Content Manager',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 'events',
      label: 'Events Manager',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'users',
      label: 'User Management',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 bg-[#19244E] text-white flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 z-30 select-none border-r border-white/5">
      <div>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E58422] flex items-center justify-center font-black text-white text-base shadow-md">
              BB
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                Beardista Brew
              </h1>
              <p className="text-[10px] uppercase font-bold text-[#E58422] tracking-wider">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left active:scale-98 ${
                  isActive
                    ? 'bg-[#E58422] text-white shadow-md shadow-[#E58422]/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 space-y-2">
        {onSwitchToCustomerMenu && (
          <button
            onClick={onSwitchToCustomerMenu}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/10"
          >
            <span>View Customer App</span>
          </button>
        )}

        <button
          onClick={onOpenLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold transition-all cursor-pointer active:scale-95 border border-red-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </button>

        <div className="text-[10px] text-gray-400 text-center pt-2">
          v2.4.0 · Flagship Prototype
        </div>
      </div>
    </aside>
  );
};