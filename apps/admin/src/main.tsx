import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './auth';
import { App } from './App';
import './styles.css';

// When VITE_SENTRY_DSN (inlined at build time) is unset the SDK sends nothing,
// but @sentry/react is still statically imported and bundled either way —
// "no-op" means no events, not zero bundle cost. Sentry is enabled in
// production here, so the bundle cost is expected.
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
