import {
  Activity,
  ArrowRight,
  Shield,
  Clock,
  Users,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../UI/button";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="welcome-wrapper">
      {/* Header with Back Button */}
      <div className="welcome-header page-container">
        <Button
          variant="ghost"
          onClick={() => onNavigate("landing")}
          className="btn-ghost text-gray-600"
        >
          <ChevronLeft className="icon-md margin-right-xs" />
          Back to Home
        </Button>
      </div>

      {/* Hero Section */}
      <div className="welcome-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="welcome-content"
        >
          {/* Logo */}
          <div className="welcome-logo">
            <div className="welcome-logo-icon">
              <img src="/imports/logo.jpg" className="logo" alt="" />
            </div>
            <div className="welcome-logo-text">
              <h1 className="welcome-logo-title">Healthcare Base</h1>
              <p className="welcome-logo-subtitle">
                by CBRILLIANCE AI-Techs LTD
              </p>
            </div>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="welcome-tagline"
          >
            Your trusted digital health companion
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="welcome-buttons"
          >
            <Button
              onClick={() => onNavigate("patient-auth")}
              className="btn-primary rounded-xl shadow-lg btn-group"
              size="lg"
            >
              Patient Portal
              <ArrowRight className="icon-md" />
            </Button>
            <Button
              onClick={() => onNavigate("admin-login")}
              variant="outline"
              className="btn-outline green rounded-xl"
              size="lg"
            >
              Admin Access
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="welcome-features"
        >
          <div className="welcome-feature-card">
            <div className="welcome-feature-icon bg-blue-light">
              <Clock className="icon-xl text-blue" />
            </div>
            <h3 className="welcome-feature-title">Quick Booking</h3>
            <p className="welcome-feature-description">
              Schedule appointments with top doctors in seconds
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="welcome-feature-icon bg-green-light">
              <Shield className="icon-xl text-green" />
            </div>
            <h3 className="welcome-feature-title">Secure & Private</h3>
            <p className="welcome-feature-description">
              Your health data is protected with enterprise-grade security
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="welcome-feature-icon bg-blue-light">
              <Users className="icon-xl text-blue" />
            </div>
            <h3 className="welcome-feature-title">Expert Care</h3>
            <p className="welcome-feature-description">
              Access verified healthcare professionals nationwide
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="welcome-footer">
        © 2025 CBRILLIANCE AI-Techs LTD. All rights reserved.
      </div>
    </div>
  );
}
