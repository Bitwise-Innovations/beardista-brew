import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { CustomerApp } from '../CustomerApp.jsx';
import { AdminLogin } from '../../features/admin/auth/AdminLogin.jsx';
import { AdminPortal } from '../../features/admin/AdminPortal.jsx';
import { MobileAdminLayout } from '../../features/admin/mobile/MobileAdminLayout.jsx';
import { useAuth } from '../../backend/hooks/useAuth';

// Real session + active staff profile (logIn() already rejects disabled accounts).
const RequireAdmin = ({ isAuthed, isLoading, children }) => {
  if (isLoading) return <p className="p-6 text-center text-sm text-gray-500">Loading...</p>;
  return isAuthed ? children : <Navigate to="/admin/login" replace />;
};

export function AppRoutes() {
  const navigate = useNavigate();
  const { user, profile, isLoading, logOut } = useAuth();
  const isAuthed = Boolean(user && profile?.status === 'active');

  const openAdminLogin = () => {
    navigate('/admin/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = async (to) => {
    try {
      await logOut();
    } finally {
      navigate(to);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />
      <Route path="/menu" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />
      <Route path="/our-story" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />

      <Route path="/admin/login" element={
        isAuthed ? <Navigate to="/admin" replace /> : (
          <AdminLogin
            onLoginSuccess={() => navigate('/admin')}
            onBackToCustomer={() => navigate('/')}
            onSwitchToMobileLogin={() => navigate('/admin/login')}
          />
        )
      } />

      <Route path="/admin" element={
        <RequireAdmin isAuthed={isAuthed} isLoading={isLoading}>
          <AdminPortal
            onSwitchToCustomerMenu={() => navigate('/')}
            onLogout={() => logout('/admin/login')}
            onSwitchToMobileView={() => navigate('/admin/mobile')}
          />
        </RequireAdmin>
      } />

      {/* TEMP: MobileLogin is a fake login (any password of 4+ characters, any 4-digit PIN).
          Sending phones to the real login until MobileLogin is wired to useAuth. */}
      <Route path="/admin/mobile/login" element={<Navigate to="/admin/login" replace />} />

      <Route path="/admin/mobile" element={
        <RequireAdmin isAuthed={isAuthed} isLoading={isLoading}>
          <MobileAdminLayout
            onLogout={() => logout('/admin/login')}
            onSwitchToDesktop={() => navigate('/admin')}
            onSwitchToCustomerMenu={() => navigate('/')}
          />
        </RequireAdmin>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}