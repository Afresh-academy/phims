import {
  Calendar,
  Bell,
  FileText,
  Activity,
  Clock,
  Plus,
  User,
} from "lucide-react";
import { Button } from "../UI/button";
import { Card } from "../UI/card";
import { Badge } from "../UI/badge";
import PatientLayout from "../shared/PatientLayout";
import { useEffect, useState } from "react";
import authService from "../../services/authService";
import { toast } from "sonner";

interface PatientDashboardProps {
  onNavigate: (screen: string) => void;
  userProfile: {
    name: string;
    email: string;

    phone: string;
  };
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

interface Hospital {
  name: string;
  doctors: Array<{
    name: string;
    specialty: string;
  }>;
}

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "Nov 10, 2025",
    time: "10:30 AM",
    clinic: "City Heart Clinic",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Physician",
    date: "Nov 15, 2025",
    time: "2:00 PM",
    clinic: "Central Medical Center",
    status: "Pending",
  },
];

const notifications = [
  {
    id: 1,
    message: "Your appointment with Dr. Sarah Johnson is confirmed",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    message: "Lab results are now available",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    message: "Prescription refill reminder",
    time: "2 days ago",
    unread: false,
  },
];

const healthRecordsSummary = [
  { label: "Blood Type", value: "A+" },
  { label: "Allergies", value: "None" },
  { label: "Last Checkup", value: "Oct 15, 2025" },
  { label: "Prescriptions", value: "2 Active" },
];



export default function PatientDashboard({
  onNavigate,
  userProfile,
}: PatientDashboardProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


   const filteredDoctors = hospitals.flatMap((hospital) =>
    hospital.doctors
      .filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((doctor) => ({
        ...doctor,
        clinic: hospital.name,
      }))
  );

  // Fetch hospitals data on component mount
  useEffect(() => {
    const fetchHospitalsData = async () => {
      try {
        console.log("🔄 Fetching hospitals data from backend...");

        // Add a small delay to allow token storage to complete after signup
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Call the backend API directly
        // The API will return an error if not authenticated
        const response = await authService.displayListOfHospitals();

        console.log("📊 Hospitals API response:", response);

        // Check if request was successful
        if (response.success) {
          setHospitals(response.hospitals || []);
          console.log("✅ Hospitals data set:", response.hospitals);
        } else {
          // If authentication failed, the error message will tell us
          console.warn("⚠️ Failed to fetch hospitals:", response.message);
          setError(response.message || "Failed to fetch hospitals data");
        }
      } catch (error: any) {
        console.error("❌ Error fetching hospitals data:", error);
        setError(error.message || "Failed to load hospitals data");
      } finally {
        setLoading(false);
        console.log("🔍 Patient - hospitals data fetch complete");
      }
    };

    fetchHospitalsData();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        if (response.success) {
          console.log("✅ User profile loaded:", response.profile);
          // Update your user state here
          setUser(response.profile);
        } else {
          console.warn("⚠️ Failed to load user profile:", response.message);
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  user && console.log("👤 Current user profile:", user.personalInfo.firstName);

  // Get the display name - use retrieved user data or fallback to props
  const getDisplayName = () => {
    if (user?.personalInfo?.firstName) {
      return user.personalInfo.firstName;
    }

    // Fallback to the prop name
    return userProfile.name.split(" ")[0];
  };
  return (
    <PatientLayout
      onNavigate={onNavigate}
      activeScreen="dashboard"
      userProfile={userProfile}>
      <div className="dashboard-space">
        {/* Welcome Banner */}
        <Card className="welcome-banner">
          <div className="banner-content">
            <div>
              <h1 className="banner-title">
                Welcome back, {getDisplayName()}!
              </h1>
              <p className="banner-subtitle">
                You have {filteredDoctors.length} upcoming appointments
              </p>
            </div>
            <div className="banner-icon-container">
              <img src="/imports/logo.jpg" className="logo" alt="" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="quick-actions-grid">
          <Button
            onClick={() => onNavigate("book-appointment")}
            className="quick-action-primary">
            <Plus className="quick-action-icon" />
            <span>Book a Doctor</span>
          </Button>

          <Card className="quick-action-card">
            <div className="quick-action-content">
              <div className="quick-action-icon-container bg-blue-light">
                <Calendar className="quick-action-card-icon icon-blue" />
              </div>
              <div>
                <p className="quick-action-label">Appointments</p>
                <p className="quick-action-value">
                  {upcomingAppointments.length}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="quick-action-card"
            onClick={() => onNavigate("records")}>
            <div className="quick-action-content">
              <div className="quick-action-icon-container bg-green-light">
                <FileText className="quick-action-card-icon icon-green" />
              </div>
              <div>
                <p className="quick-action-label">Records</p>
                <p className="quick-action-value">12 Files</p>
              </div>
            </div>
          </Card>

          <Card
            className="quick-action-card"
            onClick={() => onNavigate("notifications")}>
            <div className="quick-action-content">
              <div className="quick-action-icon-container bg-orange-light">
                <Bell className="quick-action-card-icon icon-orange" />
              </div>
              <div>
                <p className="quick-action-label">Notifications</p>
                <p className="quick-action-value">
                  {notifications.filter((n) => n.unread).length} New
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Upcoming Appointments */}
          <Card className="appointments-section">
            <div className="section-header">
              <h2 className="section-title">Upcoming Appointments</h2>
              <Button variant="ghost" size="sm" className="view-all-button">
                View All
              </Button>
            </div>

            <div className="appointments-list">
              {filteredDoctors.map((appointment, index) => (
                <Card key={index} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-doctor-info">
                      <div className="appointment-icon-container">
                        <User className="appointment-icon icon-blue" />
                      </div>
                      <div>
                        <h3 className="doctor-name">{appointment.name}</h3>
                        <p className="doctor-specialty">
                          {appointment.specialty}
                        </p>
                      </div>
                    </div>
                    {/* <Badge
                      variant={
                        appointment.status === "Confirmed"
                          ? "default"
                          : "secondary"
                      }
                      className={`status-badge ${
                        appointment.status === "Confirmed"
                          ? "status-confirmed"
                          : "status-pending"
                      }`}>
                      {appointment.status}
                    </Badge> */}
                  </div>

                  <div className="appointment-datetime">
                    <div className="datetime-item">
                      <Calendar className="datetime-icon" />
                      {/* {appointment.date} */}
                    </div>
                    <div className="datetime-item">
                      <Clock className="datetime-icon" />
                      {/* {appointment.time} */}
                    </div>
                  </div>

                  <p className="appointment-clinic">📍 {appointment.clinic}</p>
                </Card>
              ))}
            </div>
          </Card>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Health Record Summary */}
            <Card className="health-summary-card">
              <h2 className="section-title">Health Summary</h2>
              <div className="health-summary-list">
                {healthRecordsSummary.map((record, index) => (
                  <div key={index} className="health-summary-item">
                    <span className="health-summary-label">{record.label}</span>
                    <span className="health-summary-value">{record.value}</span>
                  </div>
                ))}
              </div>
              <Button variant="link" className="view-full-record-button">
                View Full Record →
              </Button>
            </Card>

            {/* Notifications */}
            <Card className="notifications-sidebar-card">
              <h2 className="section-title">Notifications</h2>
              <div className="notifications-sidebar-list">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-sidebar-item ${
                      notification.unread
                        ? "notification-unread"
                        : "notification-read"
                    }`}>
                    <div className="notification-sidebar-content">
                      {notification.unread && (
                        <div className="notification-unread-indicator" />
                      )}
                      <div className="notification-sidebar-details">
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <p className="notification-time">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="view-all-notifications-button">
                View All Notifications →
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
