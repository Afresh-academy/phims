import { useState } from "react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import { Card } from "../UI/card";
import { ArrowLeft, Activity, Shield } from "lucide-react";
import { toast } from "sonner";
import authService from "../../services/authService";
import { LoginData } from "../../types";

interface AdminLoginProps {
  onAuth: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onAuth, onBack }: AdminLoginProps) {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      toast.success("Admin login successful!");
      setTimeout(() => onAuth(), 500);
    } else {
      toast.error("Please fill in all fields");
    }

    setLoginLoading(true);
    try {
      console.log("🔍 Admin - Sending login request:", loginData);

      const response = await authService.adminLogin(loginData);

      console.log("🔍 Admin - Received login response:", response);

      // Call the login function from the context to update global state
      // if (response.data && response.data) {
      //   patientLogin(response.data.user, response.data.token);
      // }

      if (response.success) {
        toast.success(response.message || "Login successful!");
        setTimeout(() => {
          onAuth();

          // navigate("/patient/dashboard");
        }, 1500);
      } else {
        let errorMessage = response.message || "Login failed";

        if (errorMessage.toLowerCase().includes("locked")) {
          errorMessage =
            "Your account has been temporarily locked. Please try again later or contact support.";
        }

        console.log("🔍 Admin - Login failed:", errorMessage);
        toast.error(errorMessage);
        setLoginData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error: any) {
      console.error("🔍 Admin - Login error caught:", error);
      console.error("🔍 Admin - Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        fullError: error,
      });

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoginLoading(false);
      console.log("🔍 Admin - Login request complete");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="back-button">
          <ArrowLeft className="back-icon" />
          Back
        </Button>

        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">
            <img src="/imports/logo.jpg" className="logo" alt="" />
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
            <p className="login-subtitle">
              Secure login for authorized personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="cbrilliance@gmail.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="login-input"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
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

            <Button type="submit" className="login-button">
              <Shield className="button-icon" />
              Secure Login
            </Button>
          </form>

          <div className="security-notice">
            <p className="security-text">
              This portal is restricted to authorized healthcare administrators
              only. Unauthorized access attempts are logged and monitored.
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
