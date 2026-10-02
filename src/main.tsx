import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initOfflineStorage } from './db/offlineDb';

// Pre-initialize IndexedDB tables and seed healthcare facilities
initOfflineStorage().catch((err) => {
  console.warn('Care Saathi offline storage init:', err);
});

// Register service worker for offline resilience
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Care Saathi Service Worker registered:', reg.scope);
    }).catch((err) => {
      console.warn('ServiceWorker registration error:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
