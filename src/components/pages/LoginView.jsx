import React from 'react';
import { AdminLogin } from '../AdminLogin.jsx';

export const LoginView = ({ onLogin, onSwitchToCustomerMenu }) => {
  return (
    <AdminLogin
      onLoginSuccess={onLogin}
      onBackToCustomer={onSwitchToCustomerMenu}
    />
  );
};

export default LoginView;
