import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Admin from './cms/Admin';
import { applyContent } from './cms/content';
import { replaceServices, defaultServices } from './data/services';
import { configureContact } from './cms/contact';

async function start() {
  try {
    const response = await fetch('/api/content');
    if (response.ok) {
      const content = await response.json(); applyContent(content);
      if (Array.isArray(content.services)) replaceServices(content.services as typeof defaultServices);
      if (content.settings) configureContact(content.settings);
    }
  } catch { /* Keep default content available when storage is unavailable. */ }
  const admin = window.location.pathname === '/admin' || window.location.hash.startsWith('#/admin');
  createRoot(document.getElementById('root')!).render(<StrictMode>{admin ? <Admin /> : <App />}</StrictMode>);
}
void start();
