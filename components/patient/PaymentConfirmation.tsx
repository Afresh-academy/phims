import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../UI/button";
import { Card } from "../UI/card";
import { Separator } from "../UI/separator";
import PatientLayout from "../shared/PatientLayout";
import { BookingData } from "../../App";
import { motion } from "motion/react";

interface PaymentConfirmationProps {
  booking: BookingData | null;
  onNavigate: (screen: string) => void;
}

export default function PaymentConfirmation({
  booking,
  onNavigate,
}: PaymentConfirmationProps) {
  let userProfile = {
    name: "cbrilliance",
    email: "cbrilliance@example.com",
    phone: "+1 234 567 8900",
  };

  if (!booking) {
    return (
      <PatientLayout
        onNavigate={onNavigate}
        activeScreen="book-appointment"
        userProfile={userProfile}
      >
        <div className="text-center py-12">
          <p className="text-gray-600">No booking information available</p>
          <Button
            onClick={() => onNavigate("book-appointment")}
            className="mt-4"
          >
            Book an Appointment
          </Button>
        </div>
      </PatientLayout>
    );
  }

  const clinicAmount = booking.amount * 0.95;
  const platformFee = booking.amount * 0.05;

  return (
    <PatientLayout
      onNavigate={onNavigate}
      activeScreen="book-appointment"
      userProfile={userProfile}
    >
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your appointment has been successfully booked
          </p>
        </motion.div>

        {/* Booking Summary Card */}
        <Card className="p-6 md:p-8 shadow-lg border-0 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-gray-900 mb-1">Booking Summary</h2>
            <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
          </div>

          <Separator className="mb-6" />

          {/* Doctor Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <div className="text-2xl">👨‍⚕️</div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900">{booking.doctorName}</h3>
                <p className="text-sm text-gray-600">{booking.specialty}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p>{booking.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p>{booking.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p>{booking.clinic}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Payment Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">Payment Details</h3>
            </div>

            <div className="space-y-3 bg-green-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="text-gray-900">
                  ₦{booking.amount.toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>To Clinic (95%)</span>
                  <span>₦{clinicAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee (5%)</span>
                  <span>₦{platformFee.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-green-600">
                  ₦{booking.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Payment processed successfully via secure payment gateway
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => onNavigate("patient-dashboard")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-5"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Dashboard
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-lg py-5"
          >
            <Download className="mr-2 w-4 h-4" />
            Download Receipt
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="text-gray-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                You'll receive a confirmation email at {userProfile.email}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                A reminder will be sent 24 hours before your appointment
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                Please arrive 10 minutes early with your ID and insurance card
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                You can reschedule or cancel up to 24 hours in advance
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </PatientLayout>
  );
}
