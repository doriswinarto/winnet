import { createContext, useContext } from 'react';
import type { ProfileTab, ScreenId, Theme, UsagePeriod } from '../types';
import type { TicketFilter } from '../data/tickets';

export interface AppState {
  theme: Theme;
  screen: ScreenId;
  /** 0 = pick method, 1 = confirm, 2 = success. */
  payStep: number;
  /** Selected payment method id, from the panel's list. */
  method: string;
  period: UsagePeriod;
  tab: ProfileTab;
  showPw: boolean;
  toast: string | null;
  ticketFilter: TicketFilter;
  /** Category chip on the notification centre, or 'Semua'. */
  notifFilter: string;
  /** Which ticket the detail screen is showing. */
  ticketId: string | null;
}

export interface AppActions {
  go: (screen: ScreenId) => void;
  openTicket: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  payNext: () => void;
  payBack: () => void;
  setMethod: (method: string) => void;
  setPeriod: (period: UsagePeriod) => void;
  setTab: (tab: ProfileTab) => void;
  togglePw: () => void;
  showToast: (msg: string) => void;
  setTicketFilter: (filter: TicketFilter) => void;
  setNotifFilter: (filter: string) => void;
}

export type AppContextValue = AppState & AppActions;

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
