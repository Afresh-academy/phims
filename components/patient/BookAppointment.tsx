import { useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Card } from "../UI/card";
import { Badge } from "../UI/badge";
import { Calendar } from "../UI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import { RadioGroup, RadioGroupItem } from "../UI/radio-group";
import { Label } from "../UI/label";
import PatientLayout from "../shared/PatientLayout";
import { BookingData } from "../../App";
import { toast } from "sonner";

interface BookAppointmentProps {
  onNavigate: (screen: string) => void;
  onBookingComplete: (booking: BookingData) => void;
}

const doctors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    clinic: "City Heart Clinic",
    rating: 4.9,
    reviews: 234,
    experience: "15 years",
    fee: 215284.50,
    available: true,
    image: "👩‍⚕️",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "General Physician",
    clinic: "Central Medical Center",
    rating: 4.8,
    reviews: 189,
    experience: "12 years",
    fee: 143523,
    available: true,
    image: "👨‍⚕️",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    clinic: "Skin Care Excellence",
    rating: 4.9,
    reviews: 312,
    experience: "10 years",
    fee: 17227,
    available: true,
    image: "👩‍⚕️",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedic",
    clinic: "Joint & Bone Center",
    rating: 4.7,
    reviews: 156,
    experience: "18 years",
    fee: 258341,
    available: false,
    image: "👨‍⚕️",
  },
];

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

export default function BookAppointment({
  onNavigate,
  onBookingComplete,
}: BookAppointmentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof doctors)[0] | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");

  const userProfile = {
    name: "Cbrillaince",
    email: "cbrillaince@example.com",
    phone: "+1 234 567 8900",
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please select a doctor, date, and time");
      return;
    }

    const booking: BookingData = {
      id: Math.random().toString(36).substr(2, 9),
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      clinic: selectedDoctor.clinic,
      date: selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: selectedTime,
      amount: selectedDoctor.fee,
    };

    onBookingComplete(booking);
  };

  return (
    <PatientLayout
      onNavigate={onNavigate}
      activeScreen="book-appointment"
      userProfile={userProfile}
    >
      <div className="book-appointment-container">
        {/* Header */}
        <div>
          <h1 className="appointment-title">Book an Appointment</h1>
          <p className="appointment-subtitle">
            Find and schedule with top healthcare professionals
          </p>
        </div>

        {/* Search */}
        <Card className="search-card">
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by doctor name, specialty, or clinic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </Card>

        <div className="appointment-grid">
          {/* Doctors List */}
          <div className="doctors-section">
            <h2 className="doctors-title">Available Doctors</h2>

            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className={`doctor-card ${
                  selectedDoctor?.id === doctor.id ? "doctor-card-selected" : ""
                } ${!doctor.available ? "doctor-card-unavailable" : ""}`}
                onClick={() => doctor.available && setSelectedDoctor(doctor)}
              >
                <div className="doctor-card-content">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="doctor-avatar">{doctor.image}</div>
                    <div className="doctor-info">
                      <div className="doctor-header">
                        <div>
                          <h3 className="doctor-name">{doctor.name}</h3>
                          <p className="doctor-specialty">{doctor.specialty}</p>
                        </div>
                        {!doctor.available && (
                          <Badge variant="secondary">Not Available</Badge>
                        )}
                      </div>

                      <div className="doctor-rating">
                        <Star className="rating-star" />
                        <span>{doctor.rating}</span>
                        <span className="rating-count">({doctor.reviews})</span>
                      </div>

                      <div className="doctor-experience">
                        {doctor.experience}
                      </div>

                      <div className="doctor-clinic">
                        <MapPin className="clinic-icon" />
                        {doctor.clinic}
                      </div>

                      <div className="doctor-footer">
                        <div className="doctor-fee">
                          <Banknote className="fee-icon" />
                          <span className="fee-amount">₦{doctor.fee}</span>
                          <span className="fee-label">consultation fee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Booking Panel */}
          <div>
            <Card className="booking-panel">
              <h2 className="booking-title">Select Date & Time</h2>

              {selectedDoctor ? (
                <div className="space-y-4">
                  {/* Selected Doctor */}
                  <div className="selected-doctor-info">
                    <p className="selected-doctor-label">Selected Doctor</p>
                    <p className="selected-doctor-name">
                      {selectedDoctor.name}
                    </p>
                    <p className="selected-doctor-specialty">
                      {selectedDoctor.specialty}
                    </p>
                  </div>

                  {/* Date Picker */}
                  <div className="date-picker-section">
                    <Label className="date-picker-label">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="date-picker-trigger"
                        >
                          <CalendarIcon className="calendar-icon" />
                          {selectedDate ? (
                            selectedDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          ) : (
                            <span className="date-placeholder">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="calendar-popover">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="time-slots-section">
                      <Label className="time-slots-label">Select Time</Label>
                      <RadioGroup
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                      >
                        <div className="time-slots-grid">
                          {timeSlots.map((time) => (
                            <div key={time}>
                              <RadioGroupItem
                                value={time}
                                id={time}
                                className="time-slot-option"
                              />
                              <Label htmlFor={time} className="time-slot-label">
                                <Clock className="time-icon" />
                                {time}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Payment Info */}
                  {selectedTime && (
                    <div className="payment-info">
                      <div className="payment-details">
                        <div className="payment-row">
                          <span className="payment-label">
                            Consultation Fee
                          </span>
                          <span className="payment-amount">
                            ${selectedDoctor.fee}
                          </span>
                        </div>
                        <div className="payment-sub-row">
                          <span>To Clinic (95%)</span>
                          <span>${(selectedDoctor.fee * 0.95).toFixed(2)}</span>
                        </div>
                        <div className="payment-sub-row">
                          <span>Platform Fee (5%)</span>
                          <span>${(selectedDoctor.fee * 0.05).toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleBookAppointment}
                        className="book-button"
                      >
                        Proceed to Payment
                        <ArrowRight className="book-button-icon" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="booking-empty-state">
                  <CalendarIcon className="booking-empty-icon" />
                  <p className="booking-empty-text">
                    Select a doctor to continue
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
