import {
  Activity,
  LayoutDashboard,
  Calendar,
  DollarSign,
  FileText,
  Menu,
  X,
  LogOut,
  Banknote,
} from "lucide-react";
import { Button } from "../UI/button";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

export default function AdminLayout({
  children,
  onNavigate,
  activeScreen,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      screen: "admin-dashboard",
    },
    {
      id: "booking-management",
      label: "Bookings",
      icon: Calendar,
      screen: "booking-management",
    },
    {
      id: "remittance",
      label: "Remittance",
      icon: Banknote,
      screen: "remittance",
    },
    { id: "reports", label: "Reports", icon: FileText, screen: "reports" },
  ];

  return (
    <div className="admin-layout">
      {/* Top Navigation */}
      <nav className="admin-nav">
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-icon">
                <Activity className="logo-icon-svg" />
              </div>
              <div className="logo-text">
                <h3 className="logo-title">Healthcare Base</h3>
                <p className="logo-subtitle">Admin Portal</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeScreen === item.screen ? "default" : "ghost"}
                    onClick={() => onNavigate(item.screen)}
                    className={`nav-button ${
                      activeScreen === item.screen
                        ? "nav-button-active"
                        : "nav-button-inactive"
                    }`}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </Button>
                );
              })}

              <Button
                variant="ghost"
                onClick={() => onNavigate("welcome")}
                className="logout-button"
              >
                <LogOut className="nav-icon" />
                <span className="nav-label">Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="mobile-menu-icon" />
              ) : (
                <Menu className="mobile-menu-icon" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeScreen === item.screen ? "default" : "ghost"}
                    onClick={() => {
                      onNavigate(item.screen);
                      setMobileMenuOpen(false);
                    }}
                    className={`mobile-nav-button ${
                      activeScreen === item.screen
                        ? "mobile-nav-button-active"
                        : "mobile-nav-button-inactive"
                    }`}
                  >
                    <Icon className="mobile-nav-icon" />
                    {item.label}
                  </Button>
                );
              })}

              <Button
                variant="ghost"
                onClick={() => {
                  onNavigate("welcome");
                  setMobileMenuOpen(false);
                }}
                className="mobile-logout-button"
              >
                <LogOut className="mobile-nav-icon" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
