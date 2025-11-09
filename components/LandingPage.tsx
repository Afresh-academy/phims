import { useState } from 'react';
import { 
  Calendar, 
  Shield, 
  Clock, 
  FileText, 
  Users, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X,
  Star,
  TrendingUp,
  Heart,
  Smartphone,
  Lock,
  Bell
} from 'lucide-react';
import { Button } from './UI/button';
import { Card } from './UI/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

const features = [
  {
    icon: Calendar,
    title: 'Easy Appointment Booking',
    description: 'Schedule appointments with top healthcare professionals in just a few clicks. View real-time availability and get instant confirmations.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: FileText,
    title: 'Digital Health Records',
    description: 'Access your complete medical history, lab results, prescriptions, and imaging reports anytime, anywhere. All securely encrypted.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is protected with bank-level encryption. We comply with all healthcare privacy regulations and standards.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Manage your healthcare on your schedule. Book appointments, view records, and get notifications round the clock.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss an appointment or medication. Get timely notifications for upcoming visits, prescription refills, and lab results.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your healthcare from any device. Our responsive platform works seamlessly on desktop, tablet, and mobile.',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const stats = [
  { value: '50K+', label: 'Active Patients' },
  { value: '500+', label: 'Healthcare Providers' },
  { value: '100K+', label: 'Appointments Booked' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const howItWorks = [
  {
    step: '1',
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. Set up your profile and add your medical information.',
  },
  {
    step: '2',
    title: 'Find Your Doctor',
    description: 'Browse our network of qualified healthcare professionals. Filter by specialty, location, and availability.',
  },
  {
    step: '3',
    title: 'Book Appointment',
    description: 'Choose a convenient time slot and book your appointment. Receive instant confirmation and reminders.',
  },
  {
    step: '4',
    title: 'Get Quality Care',
    description: 'Visit your healthcare provider and get the care you need. All records are automatically updated.',
  },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Patient',
    content: 'Healthcare Base has transformed how I manage my family\'s health. Booking appointments is so easy, and having all our records in one place is a game-changer.',
    rating: 5,
  },
  {
    name: 'Dr. James Wilson',
    role: 'General Practitioner',
    content: 'As a healthcare provider, this platform has streamlined my practice. The admin tools are intuitive, and my patients love the convenience.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Patient',
    content: 'I was skeptical at first, but Healthcare Base exceeded my expectations. The reminder system ensures I never miss important appointments.',
    rating: 5,
  },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-header-content">
            {/* Logo */}
            <div className="landing-logo">
              <div className="landing-logo-icon">
                <img src="/imports/logo.jpg" className='logo' alt="" />
              </div>
              <div className="landing-logo-text">
                <h2>Healthcare Base</h2>
                <p>CBRILLIANCE AI-Techs</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="landing-nav">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#contact">Contact</a>
            </nav>

            {/* Desktop Actions */}
            <div className="landing-actions">
              <Button 
                variant="outline" 
                onClick={() => onNavigate('admin-login')}
              >
                Admin Login
              </Button>
              <Button 
                onClick={() => onNavigate('welcome')}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="landing-mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <nav className="landing-mobile-nav">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#contact">Contact</a>
              <div className="landing-mobile-actions">
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('admin-login')}
                  >
                    Admin Login
                  </Button>
                </div>
                <div>
                  <Button 
                    onClick={() => onNavigate('welcome')}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <div className="landing-hero-content">
            <div className="landing-hero-content">
              <div className="landing-hero-badge">
                <p>🏥 Trusted by 50,000+ Patients</p>
              </div>
              <h1 className="landing-hero-title">
                Your Health, Simplified & Secured
              </h1>
              <p className="landing-hero-description">
                Book appointments with top healthcare professionals, access your medical records anytime, 
                and take control of your health journey—all in one secure platform.
              </p>
              <div className="landing-hero-actions">
                <Button 
                  size="lg"
                  onClick={() => onNavigate('welcome')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('admin-login')}
                >
                  Healthcare Provider Login
                </Button>
              </div>
              <div className="landing-hero-rating">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p>4.9/5 from 2,500+ reviews</p>
              </div>
            </div>
            <div className="landing-hero-image">
              <div className="landing-hero-image-container">
                <ImageWithFallback
                  src="/imports/main-w.jpg"
                  alt="Healthcare Professional"
                />
              </div>
              {/* Floating Stats Cards */}
              <div className="landing-hero-float-card landing-hero-float-card-bottom">
                <div className="landing-hero-float-card-content">
                  <div className="landing-hero-float-card-icon bg-green-100">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="landing-hero-float-card-text">
                    <p>Active Users</p>
                    <p>50,000+</p>
                  </div>
                </div>
              </div>
              <div className="landing-hero-float-card landing-hero-float-card-top">
                <div className="landing-hero-float-card-content">
                  <div className="landing-hero-float-card-icon bg-blue-100">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="landing-hero-float-card-text">
                    <p>Satisfaction</p>
                    <p>98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        <div className="landing-stats-container">
          <div className="landing-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="landing-stat-item">
                <p className="landing-stat-value">{stat.value}</p>
                <p className="landing-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-features-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              Everything You Need for Better Healthcare
            </h2>
            <p className="landing-section-description">
              Powerful features designed to make healthcare management simple, secure, and accessible for everyone.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="landing-feature-card">
                  <div className={`landing-feature-icon ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="landing-feature-title">{feature.title}</h3>
                  <p className="landing-feature-description">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="landing-how-it-works">
        <div className="landing-how-it-works-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              How It Works
            </h2>
            <p className="landing-section-description">
              Get started with Healthcare Base in four simple steps
            </p>
          </div>

          <div className="landing-steps-grid">
            {howItWorks.map((item, index) => (
              <div key={index} className="landing-step-item">
                <div className="landing-step-number">
                  <span>{item.step}</span>
                </div>
                <h3 className="landing-step-title">{item.title}</h3>
                <p className="landing-step-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="landing-testimonials">
        <div className="landing-testimonials-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              Trusted by Thousands
            </h2>
            <p className="landing-section-description">
              See what our patients and healthcare providers are saying
            </p>
          </div>

          <div className="landing-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="landing-testimonial-card">
                <div className="landing-testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="landing-testimonial-content">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="landing-testimonial-author">{testimonial.name}</p>
                  <p className="landing-testimonial-role">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-container">
          <h2 className="landing-cta-title">
            Ready to Take Control of Your Health?
          </h2>
          <p className="landing-cta-description">
            Join thousands of patients who trust Healthcare Base for their healthcare needs. 
            Get started today—it's free!
          </p>
          <div className="landing-cta-actions">
            <Button 
              size="lg"
              onClick={() => onNavigate('welcome')}
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onNavigate('admin-login')}
            >
              Provider Portal
            </Button>
          </div>
        </div>
      </section>

      {/* For Healthcare Providers */}
      <section className="landing-providers">
        <div className="landing-providers-container">
          <div className="landing-providers-content">
            <div className="landing-providers-image">
              <ImageWithFallback
                src="/imports/doc2.jpg"
                alt="Healthcare Technology"
              />
            </div>
            <div>
              <h2 className="landing-providers-title">
                For Healthcare Providers
              </h2>
              <p className="landing-providers-description">
                Streamline your practice with our comprehensive admin dashboard. Manage appointments, 
                track revenue, and provide better care with powerful analytics.
              </p>
              <div className="landing-providers-features">
                <div className="landing-provider-feature">
                  <CheckCircle className="landing-provider-feature-icon" />
                  <div>
                    <h3 className="landing-provider-feature-title">Appointment Management</h3>
                    <p className="landing-provider-feature-description">Efficiently manage bookings, cancellations, and rescheduling</p>
                  </div>
                </div>
                <div className="landing-provider-feature">
                  <CheckCircle className="landing-provider-feature-icon" />
                  <div>
                    <h3 className="landing-provider-feature-title">Revenue Analytics</h3>
                    <p className="landing-provider-feature-description">Track earnings with detailed remittance reports and charts</p>
                  </div>
                </div>
                <div className="landing-provider-feature">
                  <CheckCircle className="landing-provider-feature-icon" />
                  <div>
                    <h3 className="landing-provider-feature-title">Export Reports</h3>
                    <p className="landing-provider-feature-description">Generate and export detailed reports in PDF or Excel format</p>
                  </div>
                </div>
              </div>
              <Button 
                size="lg"
                onClick={() => onNavigate('admin-login')}
              >
                Access Provider Portal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-grid">
            <div>
              <div className="landing-footer-logo">
                <div className="landing-footer-logo-icon">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="landing-footer-logo-text">
                  <h3>Healthcare Base</h3>
                  <p>CBRILLIANCE AI-Techs LTD</p>
                </div>
              </div>
              <p className="landing-footer-description">
                Empowering patients and healthcare providers with modern, secure, and accessible healthcare management.
              </p>
            </div>

            <div>
              <h4 className="landing-footer-column-title">Product</h4>
              <ul className="landing-footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="landing-footer-column-title">Company</h4>
              <ul className="landing-footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="landing-footer-column-title">Legal</h4>
              <ul className="landing-footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA Compliance</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <div className="landing-footer-bottom-content">
              <p className="landing-footer-copyright">
                © 2025 CBRILLIANCE AI-Techs LTD. All rights reserved.
              </p>
              <div className="landing-footer-social">
                <a href="#">
                  <Lock className="w-5 h-5" />
                </a>
                <a href="#">
                  <Shield className="w-5 h-5" />
                </a>
                <a href="#">
                  <Users className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}