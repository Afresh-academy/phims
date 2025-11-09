import { useState } from 'react';
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import { Card } from '../UI/card';
import { Badge } from '../UI/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../UI/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../UI/dropdown-menu';
import AdminLayout from '../shared/AdminLayout';
import { toast } from 'sonner';

interface BookingManagementProps {
  onNavigate: (screen: string) => void;
}

const bookings = [
  { id: 'BK001', patient: 'John Smith', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Nov 10, 2025', time: '10:30 AM', amount: 215400, status: 'Confirmed' },
  { id: 'BK002', patient: 'Emma Wilson', doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Nov 10, 2025', time: '11:00 AM', amount: 143600, status: 'Pending' },
  { id: 'BK003', patient: 'Michael Brown', doctor: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', date: 'Nov 11, 2025', time: '09:00 AM', amount: 172320, status: 'Confirmed' },
  { id: 'BK004', patient: 'Sarah Davis', doctor: 'Dr. James Wilson', specialty: 'Orthopedic', date: 'Nov 11, 2025', time: '02:00 PM', amount: 258480, status: 'Pending' },
  { id: 'BK005', patient: 'David Miller', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Nov 12, 2025', time: '03:30 PM', amount: 215400, status: 'Confirmed' },
  { id: 'BK006', patient: 'Lisa Anderson', doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Nov 12, 2025', time: '04:00 PM', amount: 143600, status: 'Cancelled' },
  { id: 'BK007', patient: 'Robert Taylor', doctor: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', date: 'Nov 13, 2025', time: '10:00 AM', amount: 215400, status: 'Confirmed' },
  { id: 'BK008', patient: 'Jennifer Lee', doctor: 'Dr. James Wilson', specialty: 'Orthopedic', date: 'Nov 13, 2025', time: '11:30 AM', amount: 258480, status: 'Pending' },
];

export default function BookingManagement({ onNavigate }: BookingManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (bookingId: string) => {
    toast.success(`Booking ${bookingId} approved`);
  };

  const handleCancel = (bookingId: string) => {
    toast.error(`Booking ${bookingId} cancelled`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Badge className="bg-green-100 text-green-700">Confirmed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout onNavigate={onNavigate} activeScreen="booking-management">
  <div className="booking-management-space">
    {/* Header */}
    <div className="booking-header">
      <h1 className="booking-title">Booking Management</h1>
      <p className="booking-subtitle">View and manage all patient appointments</p>
    </div>

    {/* Filters */}
    <Card className="filters-card">
      <div className="filters-container">
        {/* Search */}
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search by patient, doctor, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="filter-select">
            <Filter className="filter-icon" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>

    {/* Stats Summary */}
    <div className="stats-summary-grid">
      <Card className="stat-card-summary">
        <p className="stat-label">Total Bookings</p>
        <p className="stat-value">{bookings.length}</p>
      </Card>
      <Card className="stat-card-summary">
        <p className="stat-label">Confirmed</p>
        <p className="stat-value-confirmed">{bookings.filter(b => b.status === 'Confirmed').length}</p>
      </Card>
      <Card className="stat-card-summary">
        <p className="stat-label">Pending</p>
        <p className="stat-value-pending">{bookings.filter(b => b.status === 'Pending').length}</p>
      </Card>
      <Card className="stat-card-summary">
        <p className="stat-label">Cancelled</p>
        <p className="stat-value-cancelled">{bookings.filter(b => b.status === 'Cancelled').length}</p>
      </Card>
    </div>

    {/* Bookings Table */}
    <Card className="bookings-table-card">
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="booking-id">{booking.id}</TableCell>
                <TableCell className="patient-name">{booking.patient}</TableCell>
                <TableCell className="doctor-name">{booking.doctor}</TableCell>
                <TableCell className="specialty">{booking.specialty}</TableCell>
                <TableCell>
                  <div className="datetime-container">
                    <div className="date-row">
                      <Calendar className="datetime-icon" />
                      {booking.date}
                    </div>
                    <div className="time-row">
                      <Clock className="datetime-icon" />
                      {booking.time}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="amount">₦{booking.amount}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="action-button">
                        <MoreVertical className="action-icon" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleApprove(booking.id)}>
                        <CheckCircle className="menu-icon approve-icon" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCancel(booking.id)}>
                        <XCircle className="menu-icon cancel-icon" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="empty-state">
          <Calendar className="empty-icon" />
          <p className="empty-text">No bookings found</p>
        </div>
      )}
    </Card>
  </div>
</AdminLayout>
  );
}
