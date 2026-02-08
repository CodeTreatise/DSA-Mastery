// ============================================
// Main Entry Point
// ============================================

import './styles/main.scss';
import { initApp } from './app';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Register service worker for PWA (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/dsa-mastery/sw.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  });
}
