import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppContext, type AppContextValue } from './AppContext';
import type { ProfileTab, ScreenId, Theme, UsagePeriod } from '../types';
import type { TicketFilter } from '../data/tickets';

const THEME_KEY = 'winnet.theme';
const TOAST_MS = 2600;

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'neon' ? 'neon' : 'lite';
  } catch {
    return 'lite';
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [screen, setScreen] = useState<ScreenId>('login');
  const [payStep, setPayStep] = useState(0);
  // Defaults to QRIS, the panel's usual first method; corrected once the
  // real list arrives and the customer picks one.
  const [method, setMethod] = useState<string>('qris');
  const [period, setPeriod] = useState<UsagePeriod>('Hari ini');
  const [tab, setTab] = useState<ProfileTab>('Data Pribadi');
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ticketFilter, setTicketFilter] = useState<TicketFilter>('Semua');
  const [notifFilter, setNotifFilter] = useState<string>('Semua');
  const [ticketId, setTicketId] = useState<string | null>(null);

  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // The theme owns the whole document so the page background matches the app
  // even when the phone frame is inset on a desktop viewport.
  useEffect(() => {
    document.documentElement.classList.toggle('neon', theme === 'neon');
    document.documentElement.classList.toggle('lite', theme !== 'neon');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable — the theme just won't persist */
    }
  }, [theme]);

  const showToast = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const go = useCallback((next: ScreenId) => {
    window.clearTimeout(toastTimer.current);
    setScreen(next);
    setPayStep(0);
    setToast(null);
  }, []);

  const openTicket = useCallback(
    (id: string) => {
      setTicketId(id);
      go('ticket');
    },
    [go],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      screen,
      payStep,
      method,
      period,
      tab,
      showPw,
      toast,
      ticketFilter,
      notifFilter,
      ticketId,
      go,
      openTicket,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'neon' ? 'lite' : 'neon')),
      payNext: () => setPayStep((s) => Math.min(s + 1, 2)),
      payBack: () => setPayStep(0),
      setMethod,
      setPeriod,
      setTab,
      togglePw: () => setShowPw((v) => !v),
      showToast,
      setTicketFilter,
      setNotifFilter,
    }),
    [
      theme,
      screen,
      payStep,
      method,
      period,
      tab,
      showPw,
      toast,
      ticketFilter,
      notifFilter,
      ticketId,
      go,
      openTicket,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
