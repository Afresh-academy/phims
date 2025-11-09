import { useState } from 'react';
import { Toaster } from './components/UI/sonner'
import LandingPage from './components/LandingPage';
import WelcomeScreen from './components/patient/WelcomeScreen';
import PatientAuth from './components/patient/PatientAuth';
import PatientDashboard from './components/patient/PatientDashboard';
import BookAppointment from './components/patient/BookAppointment';
import PaymentConfirmation from './components/patient/PaymentConfirmation';
import PatientProfile from './components/patient/PatientProfile';
import HealthRecords from './components/patient/HealthRecords';
import Notifications from './components/patient/Notifications';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import BookingManagement from './components/admin/BookingManagement';
import Remittance from './components/admin/Remittance';
import Reports from './components/admin/Reports';

export interface BookingData {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  amount: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [isPatientAuthenticated, setIsPatientAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'cbrilliance',
    email: 'cbrilliance.io',
    phone: '+1 234 567 8900',
  });
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handlePatientAuth = () => {
    setIsPatientAuthenticated(true);
    setCurrentScreen('patient-dashboard');
  };

  const handleAdminAuth = () => {
    setIsAdminAuthenticated(true);
    setCurrentScreen('admin-dashboard');
  };

  const handlePatientLogout = () => {
    setIsPatientAuthenticated(false);
    setCurrentScreen('welcome');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentScreen('welcome');
  };

  const handleBookingComplete = (booking: BookingData) => {
    setCurrentBooking(booking);
    setCurrentScreen('payment-confirmation');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      // Landing Page
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />;

      // Welcome & Auth
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigation} />;
      
      case 'patient-auth':
        return (
          <PatientAuth
            onAuth={handlePatientAuth}
            onBack={() => handleNavigation('welcome')}
          />
        );

      // Patient Screens
      case 'patient-dashboard':
        return (
          <PatientDashboard
            onNavigate={handleNavigation}
            userProfile={userProfile}
          />
        );

      case 'book-appointment':
        return (
          <BookAppointment
            onNavigate={handleNavigation}
            onBookingComplete={handleBookingComplete}
          />
        );

      case 'payment-confirmation':
        return (
          <PaymentConfirmation
            booking={currentBooking}
            onNavigate={handleNavigation}
          />
        );

      case 'patient-profile':
        return (
          <PatientProfile
            userProfile={userProfile}
            onNavigate={handleNavigation}
            onLogout={handlePatientLogout}
          />
        );

      case 'records':
        return (
          <HealthRecords
            onNavigate={handleNavigation}
            userProfile={userProfile}
          />
        );

      case 'notifications':
        return (
          <Notifications
            onNavigate={handleNavigation}
            userProfile={userProfile}
          />
        );

      // Admin Screens
      case 'admin-login':
        return (
          <AdminLogin
            onAuth={handleAdminAuth}
            onBack={() => handleNavigation('landing')}
          />
        );

      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigation} />;

      case 'booking-management':
        return <BookingManagement onNavigate={handleNavigation} />;

      case 'remittance':
        return <Remittance onNavigate={handleNavigation} />;

      case 'reports':
        return <Reports onNavigate={handleNavigation} />;

      // Default
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
      <Toaster position="top-right" richColors />
    </div>
  );
}
