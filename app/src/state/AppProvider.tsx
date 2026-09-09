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
  const [history, setHistory] = useState<ScreenId[]>([]);

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
    setScreen((current) => {
      if (current !== next) setHistory((h) => [...h, current]);
      return next;
    });
    setPayStep(0);
    setToast(null);
  }, []);

  const resetTo = useCallback((next: ScreenId) => {
    window.clearTimeout(toastTimer.current);
    setHistory([]);
    setScreen(next);
    setPayStep(0);
    setToast(null);
  }, []);

  /**
   * Back semantics for the Android hardware button. Within the payment flow
   * it rewinds a step rather than leaving the screen, which is what a
   * customer part-way through paying expects. Signing out clears the stack so
   * back from Login cannot walk into a signed-in screen.
   */
  const back = useCallback((): boolean => {
    if (screen === 'payment' && payStep > 0) {
      setPayStep(0);
      return true;
    }
    if (history.length === 0) return false;

    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    window.clearTimeout(toastTimer.current);
    setScreen(previous);
    setPayStep(0);
    setToast(null);
    return true;
  }, [screen, payStep, history]);

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
      history,
      go,
      openTicket,
      back,
      resetTo,
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
      history,
      go,
      openTicket,
      back,
      resetTo,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
