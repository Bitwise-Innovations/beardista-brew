import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { CustomerApp } from '../CustomerApp.jsx';
import { useAuth } from '../../backend/hooks/useAuth';

import '../../features/admin/admin.css';
import AdminLayout from '../../features/admin/layout/AdminLayout.jsx';
import BrewingLoader from '../../features/admin/components/BrewingLoader.jsx';
import AdminLogin from '../../features/admin/pages/AdminLogin.jsx';
import AdminDashboard from '../../features/admin/pages/AdminDashboard.jsx';
import MenuManagement from '../../features/admin/pages/MenuManagement.jsx';
import Analytics from '../../features/admin/pages/Analytics.jsx';
import ContentManagement from '../../features/admin/pages/ContentManagement.jsx';
import UserManagement from '../../features/admin/pages/UserManagement.jsx';
import AuditLogs from '../../features/admin/pages/AuditLogs.jsx';
import Events from '../../features/admin/pages/Events.jsx';
import Settings from '../../features/admin/pages/Settings.jsx';
import MyAccount from '../../features/admin/pages/MyAccount.jsx';

// label must match the sidebar names so the active item lights up.
const adminPages = [
  { path: 'dashboard', label: 'Dashboard', Page: AdminDashboard },
  { path: 'menu-management', label: 'Menu Management', Page: MenuManagement },
  { path: 'analytics', label: 'Analytics', Page: Analytics },
  { path: 'content-management', label: 'Content Management', Page: ContentManagement },
  { path: 'user-management', label: 'User Management', Page: UserManagement, ownerOnly: true },
  { path: 'audit-logs', label: 'Audit Logs', Page: AuditLogs },
  { path: 'events', label: 'Events', Page: Events },
  { path: 'settings', label: 'Settings', Page: Settings },
  { path: 'account', label: 'My Account', Page: MyAccount },
];

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F6F3]">
      <BrewingLoader />
    </div>
  );
}

// Real session + active staff profile. Owner-only pages send others to the dashboard.
function RequireAdmin({ ownerOnly = false, children }) {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) return <FullPageLoader />;
  if (!user || profile?.status !== 'active') return <Navigate to="/admin/login" replace />;
  if (ownerOnly && profile.role !== 'owner') return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function LoginRoute() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) return <FullPageLoader />;
  if (user && profile?.status === 'active') return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin />;
}

export function AppRoutes() {
  const navigate = useNavigate();

  const openAdminLogin = () => {
    navigate('/admin/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Routes>
      <Route path="/" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />
      <Route path="/menu" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />
      <Route path="/our-story" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />

      <Route path="/admin/login" element={<LoginRoute />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/mobile/*" element={<Navigate to="/admin/dashboard" replace />} />

      {adminPages.map(({ path, label, Page, ownerOnly }) => (
        <Route
          key={path}
          path={`/admin/${path}`}
          element={
            <RequireAdmin ownerOnly={ownerOnly}>
              <AdminLayout activePage={label}>
                <Page />
              </AdminLayout>
            </RequireAdmin>
          }
        />
      ))}

      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}