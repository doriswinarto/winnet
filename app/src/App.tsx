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
  const { screen, toast } = useApp();
  const Screen = SCREENS[screen];
  const chrome = CHROME_SCREENS.includes(screen);

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
              key={screen}
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
