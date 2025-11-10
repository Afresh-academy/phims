import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  Save,
  Bell,
  Shield,
} from "lucide-react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import { Card } from "../UI/card";
import { Separator } from "../UI/separator";
import { Switch } from "../UI/switch";
import PatientLayout from "../shared/PatientLayout";
import { toast } from "sonner";
import authService from "../../services/authService";

interface PatientProfileProps {
  userProfile: {
    name: string;
    email: string;
    phone: string;
  };
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface UserData {
  id: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    emergencyContact?: any;
  };
  medicalInfo: {
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
  };
  createdAt: string;
}

export default function PatientProfile({
  userProfile,
  onNavigate,
  onLogout,
}: PatientProfileProps) {
  const [profileData, setProfileData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getUserProfile();
        console.log("🔍 Full profile response:", response);

        if (response.success) {
          const userData = response.profile || response;
          console.log("✅ User profile loaded:", userData);

          if (userData) {
            setUser(userData);
            // Update form fields with actual user data
            if (userData.personalInfo) {
              setProfileData({
                name: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`,
                email: userData.email || userData.personalInfo.email || "",
                phone: userData.personalInfo.phone || "",
              });
            }
          }
        } else {
          console.warn("⚠️ Failed to load user profile:", response.message);
          toast.error(response.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfiless = async () => {
    try {
      setSaving(true);

      const updateData = {
        personalInfo: {
          firstName: profileData.name.split(" ")[0],
          lastName: profileData.name.split(" ").slice(1).join(" "),
          phone: profileData.phone,
        },
      };

      const response = await authService.updateProfile(updateData);

      if (response.success) {
        toast.success("Profile updated successfully!");
        // Refresh user data
        const refreshedResponse = await authService.getUserProfile();
        if (refreshedResponse.success) {
          const userData =
            refreshedResponse.data?.user ||
            refreshedResponse.user ||
            refreshedResponse;
          setUser(userData);
        }
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfilesss = async () => {
    try {
      setSaving(true);

      const nameParts = profileData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updateData = {
        personalInfo: {
          firstName: firstName,
          lastName: lastName,
          phone: profileData.phone,
        },
      };

      console.log("🔄 Sending update data:", updateData);

      const response = await authService.updateProfile(updateData);

      if (response.success) {
        toast.success("Profile updated successfully!");

        const refreshedResponse = await authService.getUserProfile();
        if (refreshedResponse.success) {
          const userData = extractUserData(refreshedResponse);
          setUser(userData);

          if (userData.personalInfo) {
            setProfileData({
              name: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`,
              email: userData.email || userData.personalInfo.email || "",
              phone: userData.personalInfo.phone || "",
            });
          }
        }
      } else {
        console.error("❌ Profile update failed:", response);
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
  try {
    setSaving(true);

    const nameParts = profileData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const updateData = {
      personalInfo: {
        firstName: firstName,
        lastName: lastName,
        phone: profileData.phone,
      },
    };

    console.log("🔄 Sending update data:", updateData);

    const response = await authService.updateProfile(updateData);

    if (response.success) {
      toast.success("Profile updated successfully!");
      
      // Refresh user data using the same structure as useEffect
      const refreshedResponse = await authService.getUserProfile();
      if (refreshedResponse.success) {
        const userData = refreshedResponse.profile || refreshedResponse;
        setUser(userData);
        
        if (userData.personalInfo) {
          setProfileData({
            name: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`,
            email: userData.email || userData.personalInfo.email || "",
            phone: userData.personalInfo.phone || "",
          });
        }
      }
    } else {
      console.error("❌ Profile update failed:", response);
      toast.error(response.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    toast.error("Failed to update profile");
  } finally {
    setSaving(false);
  }
};



  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    setTimeout(() => onLogout(), 500);
  };

  // Format date for display
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.personalInfo) {
      return `${user.personalInfo.firstName.charAt(
        0
      )}${user.personalInfo.lastName.charAt(0)}`.toUpperCase();
    }
    return userProfile.name.charAt(0).toUpperCase();
  };

  // Get full name from user data
  const getFullName = () => {
    if (user?.personalInfo) {
      return `${user.personalInfo.firstName} ${user.personalInfo.lastName}`;
    }
    return userProfile.name;
  };




  if (loading) {
    return (
      <PatientLayout
        onNavigate={onNavigate}
        activeScreen="patient-profile"
        userProfile={userProfile}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading profile...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout
      onNavigate={onNavigate}
      activeScreen="patient-profile"
      userProfile={userProfile}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-gray-900 mb-6">Personal Information</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="pl-10 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="pl-10 rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="pl-10 rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-5 mt-6">
                <Save className="mr-2 w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Medical Information (Read-only) */}
            {user?.medicalInfo && (
              <div>
                <h3 className="text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Blood Group:</span>
                    <span className="ml-2 text-gray-900">
                      {user.medicalInfo.bloodGroup || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Allergies:</span>
                    <span className="ml-2 text-gray-900">
                      {user.medicalInfo.allergies?.length > 0
                        ? user.medicalInfo.allergies.join(", ")
                        : "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Conditions:</span>
                    <span className="ml-2 text-gray-900">
                      {user.medicalInfo.chronicConditions?.length > 0
                        ? user.medicalInfo.chronicConditions.join(", ")
                        : "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Medications:</span>
                    <span className="ml-2 text-gray-900">
                      {user.medicalInfo.medications?.length > 0
                        ? user.medicalInfo.medications.join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Security Section */}
            <div>
              <h3 className="text-gray-900 mb-4">Security</h3>
              <Button
                variant="outline"
                className="w-full justify-start rounded-lg"
                onClick={() => onNavigate("change-password")}>
                <Lock className="mr-2 w-4 h-4" />
                Change Password
              </Button>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-semibold">
                  {getUserInitials()}
                </span>
              </div>
              <h3 className="text-gray-900 mb-1">{getFullName()}</h3>
              <p className="text-sm text-gray-600">
                {user?.email || profileData.email}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Member since</p>
                <p className="text-sm text-gray-700">
                  {user?.createdAt
                    ? formatMemberSince(user.createdAt)
                    : "January 2025"}
                </p>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">Notifications</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-500">
                      Receive updates via SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">Account Stats</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Total Appointments
                  </span>
                  <span className="text-sm text-gray-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Upcoming</span>
                  <span className="text-sm text-gray-900">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Health Records</span>
                  <span className="text-sm text-gray-900">8 Files</span>
                </div>
              </div>
            </Card>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="mr-2 w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
