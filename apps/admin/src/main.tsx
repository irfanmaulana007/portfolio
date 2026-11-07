import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './auth';
import { App } from './App';
import './styles.css';

// No-op unless VITE_SENTRY_DSN is set (inlined at build time): local dev and
// unconfigured builds send nothing.
const dsn = import.meta.env.VITE_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    // Low-traffic personal site: sample a fraction of traces, always send errors.
    tracesSampleRate: 0.2,
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="center-screen muted">Something went wrong.</div>}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>
);
