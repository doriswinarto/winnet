import { useEffect, useRef } from 'react';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { CanvasChrome } from './components/CanvasChrome';
import { PhoneFrame } from './components/PhoneFrame';
import { Toast } from './components/Toast';
import { BillingScreen } from './screens/BillingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { PackageScreen } from './screens/PackageScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { StatusScreen } from './screens/StatusScreen';
import { TicketDetailScreen } from './screens/TicketDetailScreen';
import { TicketsScreen } from './screens/TicketsScreen';
import { UsageScreen } from './screens/UsageScreen';
import { usePortal } from './api/PortalContext';
import { useApp } from './state/AppContext';
import { CHROME_SCREENS, type ScreenId } from './types';

const SCREENS: Record<ScreenId, () => React.JSX.Element> = {
  login: LoginScreen,
  register: RegisterScreen,
  home: HomeScreen,
  usage: UsageScreen,
  billing: BillingScreen,
  payment: PaymentScreen,
  package: PackageScreen,
  tickets: TicketsScreen,
  ticket: TicketDetailScreen,
  status: StatusScreen,
  profile: ProfileScreen,
  notif: NotificationsScreen,
};

export default function App() {
  const { screen, toast, go } = useApp();
  const { authenticated, checkingSession } = usePortal();

  // A restored "ingat saya" session skips the login screen on next open.
  const restored = useRef(false);
  useEffect(() => {
    if (authenticated && !restored.current) {
      restored.current = true;
      if (screen === 'login') go('home');
    }
    if (!authenticated) restored.current = false;
  }, [authenticated, screen, go]);

  // Signed out, the only reachable screens are the auth ones. This is a UX
  // guard, not a security one: the node refuses data without a session
  // cookie regardless of what the browser decides to render.
  const gated =
    !authenticated && !checkingSession && CHROME_SCREENS.includes(screen)
      ? 'login'
      : screen;

  const Screen = SCREENS[gated];
  const chrome = CHROME_SCREENS.includes(gated);

  return (
    <div className="canvas">
      <CanvasChrome />
      <PhoneFrame>
        {chrome ? (
          <div
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <AppHeader />
            {/* `key` restarts the rise-in transition on every screen change. */}
            <div
              key={gated}
              className="scroll"
              style={{ flex: 1, padding: '0 20px 18px' }}
            >
              <Screen />
            </div>
            <BottomNav />
          </div>
        ) : (
          <Screen />
        )}
        {toast && <Toast message={toast} />}
      </PhoneFrame>
    </div>
  );
}
