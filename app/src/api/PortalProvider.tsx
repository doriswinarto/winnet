import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PortalSettings, Section } from '@shared/portal';
import { MOCK, MOCK_SETTINGS, type PortalSnapshot } from '../data/mock';
import {
  BffError,
  fetchData,
  fetchSettings,
  logout,
  restoreSession,
} from './bff';
import { PortalContext, type DataSource, type PortalValue } from './PortalContext';

/** Everything the app needs for a cold start, in one call. */
const BOOT_SECTIONS: Section[] = [
  'customer',
  'currentInvoice',
  'payments',
  'usageByMonth',
  'liveSession',
  'offerablePackages',
  'pendingUpgrade',
  'tickets',
  'networkNotices',
  'paymentMethods',
  'paymentOutlets',
];

/**
 * The design's meter jitters every 1.4s. That is fine for a mock but would be
 * an absurd amount of traffic against the panel, so live readings are polled
 * at a human pace and the gauge's own 0.9s transition carries the movement.
 */
const LIVE_POLL_MS = 15_000;

/** Mock-only: the design's meter jitter, so the gauge still reads as live. */
const MOCK_TICK_MS = 1400;
const MOCK_SPEED_BASE = 45.4;
const MOCK_SPEED_SPREAD = 4.4;

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<PortalSnapshot>(MOCK);
  const [settings, setSettings] = useState<PortalSettings>(MOCK_SETTINGS);
  const [source, setSource] = useState<DataSource>('mock');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [nonce, setNonce] = useState(0);

  /* --------------------------------------------------- session on boot */

  useEffect(() => {
    const ac = new AbortController();
    restoreSession(ac.signal)
      .then((s) => setAuthenticated(s.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
    return () => ac.abort();
  }, []);

  /* ------------------------------------------------------------ branding */

  useEffect(() => {
    const ac = new AbortController();
    fetchSettings(ac.signal)
      .then(setSettings)
      .catch(() => {
        /* branding is cosmetic — the design's own wording stands in */
      });
    return () => ac.abort();
  }, []);

  /* ---------------------------------------------------------- boot fetch */

  useEffect(() => {
    // Signed out: state is already the mock snapshot — set on mount and reset
    // by signOut — so there is nothing to fetch and nothing to reset here.
    if (!authenticated) return;

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetchData({ bagian: BOOT_SECTIONS, limit: 24, months: 12 }, ac.signal)
      .then((d) => {
        setSnapshot((prev) => ({
          customer: d.customer?.customer ?? prev.customer,
          plan: d.customer?.plan ?? prev.plan,
          currentInvoice: d.currentInvoice ?? null,
          payments: d.payments ?? [],
          usage: d.usageByMonth?.length ? d.usageByMonth : prev.usage,
          live: d.liveSession ?? null,
          packages: d.offerablePackages ?? [],
          pendingUpgrade: d.pendingUpgrade ?? null,
          tickets: d.tickets ?? [],
          notices: d.networkNotices ?? [],
          methods: d.paymentMethods ?? [],
          outlets: d.paymentOutlets ?? [],
        }));
        setSource('api');
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        if (err instanceof BffError && err.isUnauthenticated) {
          setAuthenticated(false);
          return;
        }
        // Showing the design's content beats showing an empty shell, but the
        // UI is told it is looking at a stand-in.
        setSnapshot(MOCK);
        setSource('mock');
        setError(
          err instanceof BffError ? err.message : 'Gagal memuat data.',
        );
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, [authenticated, nonce]);

  /* ------------------------------------------------------- live polling */

  useEffect(() => {
    if (!authenticated || source !== 'api') return;

    const id = window.setInterval(() => {
      const ac = new AbortController();
      fetchData({ bagian: ['liveSession'] }, ac.signal)
        .then((d) => {
          if (d.liveSession) {
            setSnapshot((prev) => ({ ...prev, live: d.liveSession ?? prev.live }));
          }
        })
        .catch((err: unknown) => {
          if (err instanceof BffError && err.isUnauthenticated) {
            setAuthenticated(false);
          }
          // A dropped poll is not worth surfacing; the next one will do.
        });
    }, LIVE_POLL_MS);

    return () => window.clearInterval(id);
  }, [authenticated, source]);

  useEffect(() => {
    if (source !== 'mock') return;
    const id = window.setInterval(() => {
      setSnapshot((prev) =>
        prev.live
          ? {
              ...prev,
              live: {
                ...prev.live,
                speedMbps:
                  MOCK_SPEED_BASE + Math.random() * MOCK_SPEED_SPREAD,
              },
            }
          : prev,
      );
    }, MOCK_TICK_MS);
    return () => window.clearInterval(id);
  }, [source]);

  /* ------------------------------------------------------------ actions */

  const signIn = useCallback(() => {
    setAuthenticated(true);
    setNonce((n) => n + 1);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      /* the cookie is cleared server-side first; nothing to recover here */
    }
    setAuthenticated(false);
    setSnapshot(MOCK);
    setSource('mock');
  }, []);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  const value = useMemo<PortalValue>(
    () => ({
      snapshot,
      settings,
      source,
      loading,
      error,
      authenticated,
      checkingSession,
      signIn,
      signOut,
      refresh,
    }),
    [
      snapshot,
      settings,
      source,
      loading,
      error,
      authenticated,
      checkingSession,
      signIn,
      signOut,
      refresh,
    ],
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}
