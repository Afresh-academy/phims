import { useState } from 'react';
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import { Label } from '../UI/label';
import { Card } from '../UI/card';
import { ArrowLeft, Activity, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onAuth: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onAuth, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      toast.success('Admin login successful!');
      setTimeout(() => onAuth(), 500);
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="login-container">
  <div className="login-wrapper">
    {/* Back Button */}
    <Button
      variant="ghost"
      onClick={onBack}
      className="back-button"
    >
      <ArrowLeft className="back-icon" />
      Back
    </Button>

    {/* Logo */}
    <div className="logo-container">
      <div className="logo-icon">
        <Activity className="logo-icon-svg" />
      </div>
      <div className="logo-text">
        <h2 className="logo-title">Healthcare Base</h2>
        <p className="logo-subtitle">Sub-Admin Portal</p>
      </div>
    </div>

    {/* Login Card */}
    <Card className="login-card">
      <div className="login-header">
        <div className="security-icon">
          <Shield className="security-icon-svg" />
        </div>
        <h2 className="login-title">Admin Access</h2>
        <p className="login-subtitle">Secure login for authorized personnel</p>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="cbrilliance@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" className="checkbox" />
            <span className="remember-text">Remember me</span>
          </label>
          <button type="button" className="forgot-password">
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="login-button"
        >
          <Shield className="button-icon" />
          Secure Login
        </Button>
      </form>

      <div className="security-notice">
        <p className="security-text">
          This portal is restricted to authorized healthcare administrators only.
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </Card>

    <p className="copyright">
      © 2025 CBRILLIANCE AI-Techs LTD. All rights reserved.
    </p>
  </div>
</div>
  );
}
