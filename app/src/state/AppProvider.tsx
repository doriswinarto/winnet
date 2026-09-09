import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppContext, type AppContextValue } from './AppContext';
import type {
  PaymentMethodName,
  ProfileTab,
  ScreenId,
  Theme,
  UsagePeriod,
} from '../types';
import type { TicketFilter } from '../data/tickets';
import type { NotifFilter } from '../data/notifications';

const THEME_KEY = 'winnet.theme';
const TOAST_MS = 2600;

/** The live speed meter re-reads every 1.4s, as in the design. */
const SPEED_INTERVAL_MS = 1400;
const SPEED_BASE = 45.4;
const SPEED_SPREAD = 4.4;
/** Reading shown before the meter has ticked, and on the static frames. */
const SPEED_INITIAL = 48.2;

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
  const [method, setMethod] = useState<PaymentMethodName>('QRIS');
  const [period, setPeriod] = useState<UsagePeriod>('Hari ini');
  const [tab, setTab] = useState<ProfileTab>('Data Pribadi');
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [speed, setSpeed] = useState(SPEED_INITIAL);
  const [ticketFilter, setTicketFilter] = useState<TicketFilter>('Semua');
  const [notifFilter, setNotifFilter] = useState<NotifFilter>('Semua');

  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const id = window.setInterval(
      () => setSpeed(SPEED_BASE + Math.random() * SPEED_SPREAD),
      SPEED_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

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
      speed,
      ticketFilter,
      notifFilter,
      go,
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
      speed,
      ticketFilter,
      notifFilter,
      go,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
