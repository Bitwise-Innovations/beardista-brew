import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { CustomerApp } from '../CustomerApp.jsx';
import { AdminLogin } from '../../features/admin/auth/AdminLogin.jsx';
import { AdminPortal } from '../../features/admin/AdminPortal.jsx';
import { MobileLogin } from '../../features/admin/mobile/MobileLogin.jsx';
import { MobileAdminLayout } from '../../features/admin/mobile/MobileAdminLayout.jsx';

const RequireAdmin = ({ isAuthed, children }) =>
  isAuthed ? children : <Navigate to="/admin/login" replace />;

export function AppRoutes() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);

  const openAdminLogin = () => {
    navigate(window.innerWidth < 768 ? '/admin/mobile/login' : '/admin/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = (to) => {
    setIsAuthed(false);
    navigate(to);
  };

  return (
    <Routes>
      <Route path="/" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />
      <Route path="/menu" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />
      <Route path="/our-story" element={<CustomerApp onOpenAdminLogin={openAdminLogin} />} />

      <Route path="/admin/login" element={
        <AdminLogin
          onLoginSuccess={() => { setIsAuthed(true); navigate('/admin'); }}
          onBackToCustomer={() => navigate('/')}
          onSwitchToMobileLogin={() => navigate('/admin/mobile/login')}
        />
      } />
      <Route path="/admin" element={
        <RequireAdmin isAuthed={isAuthed}>
          <AdminPortal
            onSwitchToCustomerMenu={() => navigate('/')}
            onLogout={() => logout('/admin/login')}
            onSwitchToMobileView={() => navigate('/admin/mobile')}
          />
        </RequireAdmin>
      } />

      <Route path="/admin/mobile/login" element={
        <MobileLogin
          onLoginSuccess={() => { setIsAuthed(true); navigate('/admin/mobile'); }}
          onBackToCustomer={() => navigate('/')}
          onSwitchToDesktop={() => navigate('/admin/login')}
        />
      } />
      <Route path="/admin/mobile" element={
        <RequireAdmin isAuthed={isAuthed}>
          <MobileAdminLayout
            onLogout={() => logout('/admin/mobile/login')}
            onSwitchToDesktop={() => navigate('/admin')}
            onSwitchToCustomerMenu={() => navigate('/')}
          />
        </RequireAdmin>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}