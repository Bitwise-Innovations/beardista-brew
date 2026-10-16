// ==============================================================================
// FILE: src/main.jsx
// PURPOSE: Application entry point mounting the root App component to the DOM.
// ACADEMIC NOTE:
// Utilizes modern React 18/19 `createRoot` API to mount into the HTML element with id="root".
// Global CSS with Tailwind v4 `@import "tailwindcss";` is imported here.
// ==============================================================================

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Mount the React virtual DOM tree into the root container element
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
