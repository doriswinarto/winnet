import { createContext, useContext } from 'react';
import type { PortalSettings } from '@shared/portal';
import type { PortalSnapshot } from '../data/mock';

/** Where the rendered data came from — surfaced so the UI can say so. */
export type DataSource = 'api' | 'mock';

export interface PortalValue {
  snapshot: PortalSnapshot;
  settings: PortalSettings;
  source: DataSource;
  loading: boolean;
  /** Set when a live fetch failed and the mock is standing in. */
  error: string | null;
  authenticated: boolean;
  /** True until the initial session check has settled. */
  checkingSession: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
  refresh: () => void;
}

export const PortalContext = createContext<PortalValue | null>(null);

export function usePortal(): PortalValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside <PortalProvider>');
  return ctx;
}
