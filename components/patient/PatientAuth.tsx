import { useState, FormEvent } from "react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import { Card } from "../UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../UI/tabs";
import { ArrowLeft, Activity } from "lucide-react";
import { toast } from "sonner";

import authService from "../../services/authService";
import { SignupData, LoginData } from "../../types";

interface PatientAuthProps {
  onAuth: () => void;
  onBack: () => void;
}

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  state?: string;
  localGov?: string;
}

export default function PatientAuth({ onAuth, onBack }: PatientAuthProps) {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    location: "",
  });

  // Signup state
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    localGov: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginFieldErrors, setLoginFieldErrors] = useState<FieldErrors>({});
  const [signupFieldErrors, setSignupFieldErrors] = useState<FieldErrors>({});

  // Email validation helper
  const validateEmail = (email: string) => {
    if (!email) {
      return { isValid: false, message: "Email is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    return { isValid: true, message: "" };
  };

  // Phone validation helper
  const validatePhone = (phone: string) => {
    if (!phone) {
      return { isValid: false, message: "Phone number is required" };
    }
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, "").length < 10) {
      return { isValid: false, message: "Please enter a valid phone number" };
    }
    return { isValid: true, message: "" };
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    // CRITICAL: Prevent all default behaviors
    e.preventDefault();
    e.stopPropagation();

    console.log("🔍 PatientAuth - Login form submitted");

    // Clear previous errors
    setLoginFieldErrors({});

    // Validate all fields before submission
    const emailValidation = validateEmail(loginData.email);
    const hasErrors = !emailValidation.isValid || !loginData.password;

    if (hasErrors) {
      console.log("🔍 PatientAuth - Login validation errors found");
      const newFieldErrors: FieldErrors = {};

      if (!emailValidation.isValid) {
        newFieldErrors.email = emailValidation.message;
      }

      if (!loginData.password) {
        newFieldErrors.password = "Password is required";
      }

      // if (!loginData.location) {
      //   toast.error("Please select a location");
      // }

      setLoginFieldErrors(newFieldErrors);
      toast.error("Please fix the validation errors");
      return false;
    }

    setLoginLoading(true);

    try {
      console.log("🔍 PatientAuth - Sending login request:", loginData);

      const response = await authService.patientLogin(loginData);

      console.log("🔍 PatientAuth - Received login response:", response);

      // Call the login function from the context to update global state
      // if (response.data && response.data) {
      //   patientLogin(response.data.user, response.data.token);
      // }

      if (response.success) {
        toast.success(response.message || "Login successful!");

        // Wait for token storage
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Verify token
        const storedToken = sessionStorage.getItem("authToken");
        console.log("🔍 PatientAuth - Token after login:", !!storedToken);

        setTimeout(() => {
          onAuth();
        }, 1200);
      } else {
        let errorMessage = response.message || "Login failed";

        if (errorMessage.toLowerCase().includes("locked")) {
          errorMessage =
            "Your account has been temporarily locked. Please try again later or contact support.";
        }

        console.log("🔍 PatientAuth - Login failed:", errorMessage);
        toast.error(errorMessage);
        setLoginData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error: any) {
      console.error("🔍 PatientAuth - Login error caught:", error);
      console.error("🔍 PatientAuth - Error details:", {
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
      console.log("🔍 PatientAuth - Login request complete");
    }

    return false;
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🔍 PatientAuth - Signup form submitted");

    // ... validation code stays the same ...

    setSignupLoading(true);

    try {
      console.log("🔍 PatientAuth - Sending signup request:", signupData);

      const response = await authService.signup(signupData);

      console.log("🔍 PatientAuth - Received signup response:", response);

      if (response.success) {
        toast.success(response.message || "Account created successfully!");

        // CRITICAL FIX: Wait for token to be stored before navigating
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Verify token is actually stored
        const storedToken = sessionStorage.getItem("authToken");
        console.log("🔍 PatientAuth - Token verification after signup:", {
          hasToken: !!storedToken,
          tokenPreview: storedToken
            ? `${storedToken.substring(0, 20)}...`
            : "No token",
        });

        // Navigate to dashboard
        setTimeout(() => {
          onAuth();
        }, 1200); // Reduced from 1500 since we already waited 300ms
      } else {
        const errorMessage = response.message || "Signup failed";
        console.log("🔍 PatientAuth - Signup failed:", errorMessage);
        toast.error(errorMessage);
        setSignupData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error: any) {
      console.error("🔍 PatientAuth - Signup error caught:", error);
      console.error("🔍 PatientAuth - Error details:", {
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

      setSignupData((prev) => ({ ...prev, password: "" }));
    } finally {
      setSignupLoading(false);
      console.log("🔍 PatientAuth - Signup request complete");
    }

    return false;
  };

  return (
    <div className="patient-auth-container">
      <div className="patient-auth-wrapper">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="patient-auth-back-btn">
          <ArrowLeft className="patient-auth-back-icon" />
          Back
        </Button>

        {/* Logo */}
        <div className="patient-auth-logo">
          <div className="patient-auth-logo-icon">
            <img src="/imports/logo.jpg" className="logo" alt="" />
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
                  <Label htmlFor="login-email" className="form-label">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="cbrilliance@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={loginLoading}
                  />
                  {loginFieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginFieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="login-password" className="form-label">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={loginLoading}
                  />
                  {loginFieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginFieldErrors.password}
                    </p>
                  )}
                </div>

                <div className="patient-auth-options">
                  <button
                    type="button"
                    className="patient-auth-forgot-password"
                    disabled={loginLoading}>
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="patient-auth-submit-btn patient-auth-login-btn"
                  disabled={loginLoading}>
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="patient-auth-form">
                <div className="form-group">
                  <Label htmlFor="signup-first-name" className="form-label">
                    First Name
                  </Label>
                  <Input
                    id="signup-first-name"
                    type="text"
                    placeholder="Cbrillaince"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-last-name" className="form-label">
                    Last Name
                  </Label>
                  <Input
                    id="signup-last-name"
                    type="text"
                    placeholder="Cbrillaince"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />

                  {signupFieldErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupFieldErrors.lastName}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-email" className="form-label">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Cbrillaince@example.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />

                  {signupFieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupFieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-phone" className="form-label">
                    Phone Number
                  </Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={signupData.phone}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />
                  {signupFieldErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupFieldErrors.phone}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-state" className="form-label">
                    State
                  </Label>
                  <Input
                    id="signup-state"
                    type="text"
                    placeholder="Enter your state"
                    value={signupData.state}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />
                  {signupFieldErrors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupFieldErrors.state}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-local-gov" className="form-label">
                    Local Government Area
                  </Label>
                  <Input
                    id="signup-local-gov"
                    type="text"
                    placeholder="Enter your local government area"
                    value={signupData.localGov}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        localGov: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />
                  {signupFieldErrors.localGov && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupFieldErrors.localGov}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-password" className="form-label">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                    disabled={signupLoading}
                  />

                  {signupFieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupFieldErrors.password}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="signup-password" className="form-label">
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.confirmPassword || ""}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="patient-auth-input"
                  />
                </div>

                <Button
                  type="submit"
                  className="patient-auth-submit-btn patient-auth-signup-btn">
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
