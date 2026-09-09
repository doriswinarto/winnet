import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PortalProvider } from './api/PortalProvider';
import { AppProvider } from './state/AppProvider';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortalProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </PortalProvider>
  </StrictMode>,
);
