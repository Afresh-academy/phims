import { useState } from 'react';
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import { Label } from '../UI/label';
import { Card } from '../UI/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UI/tabs';
import { ArrowLeft, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface PatientAuthProps {
  onAuth: () => void;
  onBack: () => void;
}

export default function PatientAuth({ onAuth, onBack }: PatientAuthProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupState, setSignupState] = useState('');
  const [signupLocalGov, setSignupLocalGov] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      toast.success('Login successful!');
      setTimeout(() => onAuth(), 500);
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupName && signupEmail && signupPhone && signupState && signupLocalGov && signupPassword) {
      toast.success('Account created successfully!');
      setTimeout(() => onAuth(), 500);
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="patient-auth-container">
      <div className="patient-auth-wrapper">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="patient-auth-back-btn"
        >
          <ArrowLeft className="patient-auth-back-icon" />
          Back
        </Button>

        {/* Logo */}
        <div className="patient-auth-logo">
          <div className="patient-auth-logo-icon">
            <img src="/imports/logo.jpg" className='logo' alt="" />
          </div>
          <div className="patient-auth-logo-text">
            <h2 className="patient-auth-logo-title">Healthcare Base</h2>
            <p className="patient-auth-logo-subtitle">Patient Portal</p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="patient-auth-card">
          <Tabs defaultValue="login" className="patient-auth-tabs">
            <TabsList className="patient-auth-tabs-list">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="patient-auth-form">
                <div className="form-group">
                  <Label htmlFor="login-email" className="form-label">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="cbrilliance@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="login-password" className="form-label">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="patient-auth-options">
                  <button
                    type="button"
                    className="patient-auth-forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="patient-auth-submit-btn patient-auth-login-btn"
                >
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="patient-auth-form">
                <div className="form-group">
                  <Label htmlFor="signup-name" className="form-label">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Cbrillaince"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-email" className="form-label">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Cbrillaince@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-phone" className="form-label">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-state" className="form-label">State</Label>
                  <Input
                    id="signup-state"
                    type="text"
                    placeholder="Enter your state"
                    value={signupState}
                    onChange={(e) => setSignupState(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-local-gov" className="form-label">Local Government Area</Label>
                  <Input
                    id="signup-local-gov"
                    type="text"
                    placeholder="Enter your local government area"
                    value={signupLocalGov}
                    onChange={(e) => setSignupLocalGov(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-password" className="form-label">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-password" className="form-label">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="patient-auth-input"
                  />
                </div>

                <Button
                  type="submit"
                  className="patient-auth-submit-btn patient-auth-signup-btn"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="patient-auth-footer">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}