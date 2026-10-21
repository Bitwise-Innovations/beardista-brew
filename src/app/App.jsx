import React from 'react';
import AppProvider from './provider.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}