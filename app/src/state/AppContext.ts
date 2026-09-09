import { createContext, useContext } from 'react';
import type {
  PaymentMethodName,
  ProfileTab,
  ScreenId,
  Theme,
  UsagePeriod,
} from '../types';
import type { TicketFilter } from '../data/tickets';
import type { NotifFilter } from '../data/notifications';

export interface AppState {
  theme: Theme;
  screen: ScreenId;
  /** 0 = pick method, 1 = confirm, 2 = success. */
  payStep: number;
  method: PaymentMethodName;
  period: UsagePeriod;
  tab: ProfileTab;
  showPw: boolean;
  toast: string | null;
  speed: number;
  ticketFilter: TicketFilter;
  notifFilter: NotifFilter;
}

export interface AppActions {
  go: (screen: ScreenId) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  payNext: () => void;
  payBack: () => void;
  setMethod: (method: PaymentMethodName) => void;
  setPeriod: (period: UsagePeriod) => void;
  setTab: (tab: ProfileTab) => void;
  togglePw: () => void;
  showToast: (msg: string) => void;
  setTicketFilter: (filter: TicketFilter) => void;
  setNotifFilter: (filter: NotifFilter) => void;
}

export type AppContextValue = AppState & AppActions;

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
