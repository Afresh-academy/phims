import { useState } from "react";
import {
  Download,
  FileText,
  TrendingUp,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "../UI/button";
import { Card } from "../UI/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";
import { Calendar } from "../UI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import AdminLayout from "../shared/AdminLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";

interface ReportsProps {
  onNavigate: (screen: string) => void;
}

const transactionData = [
  {
    id: "TXN001",
    date: "Nov 8, 2025",
    patient: "John Smith",
    doctor: "Dr. Sarah Johnson",
    amount: 215400,
    clinicShare: 204630,
    platformFee: 10770,
    status: "Completed",
  },
  {
    id: "TXN002",
    date: "Nov 8, 2025",
    patient: "Emma Wilson",
    doctor: "Dr. Michael Chen",
    amount: 143600,
    clinicShare: 136420,
    platformFee: 7180,
    status: "Completed",
  },
  {
    id: "TXN003",
    date: "Nov 7, 2025",
    patient: "Michael Brown",
    doctor: "Dr. Emily Rodriguez",
    amount: 172320,
    clinicShare: 163704,
    platformFee: 8616,
    status: "Completed",
  },
  {
    id: "TXN004",
    date: "Nov 7, 2025",
    patient: "Sarah Davis",
    doctor: "Dr. James Wilson",
    amount: 258480,
    clinicShare: 245556,
    platformFee: 12924,
    status: "Completed",
  },
  {
    id: "TXN005",
    date: "Nov 6, 2025",
    patient: "David Miller",
    doctor: "Dr. Sarah Johnson",
    amount: 215400,
    clinicShare: 204630,
    platformFee: 10770,
    status: "Completed",
  },
];

const monthlyGrowthData = [
  { month: "Jun", patients: 320, bookings: 450, revenue: 45000 },
  { month: "Jul", patients: 380, bookings: 520, revenue: 52000 },
  { month: "Aug", patients: 410, bookings: 490, revenue: 48000 },
  { month: "Sep", patients: 520, bookings: 650, revenue: 65000 },
  { month: "Oct", patients: 590, bookings: 720, revenue: 72000 },
  { month: "Nov", patients: 640, bookings: 750, revenue: 75000 },
];

const patientActivityData = [
  { date: "Nov 1", newPatients: 12, appointments: 45 },
  { date: "Nov 2", newPatients: 15, appointments: 52 },
  { date: "Nov 3", newPatients: 10, appointments: 48 },
  { date: "Nov 4", newPatients: 18, appointments: 61 },
  { date: "Nov 5", newPatients: 14, appointments: 55 },
  { date: "Nov 6", newPatients: 11, appointments: 38 },
  { date: "Nov 7", newPatients: 9, appointments: 28 },
];

export default function Reports({ onNavigate }: ReportsProps) {
  const [reportType, setReportType] = useState("transactions");
  const [dateRange, setDateRange] = useState("7days");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleExportPDF = () => {
    toast.success("Exporting report as PDF...");
  };

  const handleExportCSV = () => {
    toast.success("Exporting report as CSV...");
  };

  const handleExportExcel = () => {
    toast.success("Exporting report as Excel...");
  };

  return (
    <AdminLayout onNavigate={onNavigate} activeScreen="reports">
      <div className="reports-space">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1 className="reports-title">Reports & Analytics</h1>
            <p className="reports-subtitle">
              Generate and export comprehensive platform reports
            </p>
          </div>
          <div className="export-buttons">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="export-pdf-button"
            >
              <Download className="button-icon" />
              Export PDF
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="export-csv-button"
            >
              <Download className="button-icon" />
              Export CSV
            </Button>
            <Button onClick={handleExportExcel} className="export-excel-button">
              <Download className="button-icon" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="filters-card">
          <div className="filters-container">
            {/* Report Type */}
            <div className="filter-group">
              <label className="filter-label">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="filter-select">
                  <FileText className="filter-icon" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">
                    Transaction Report
                  </SelectItem>
                  <SelectItem value="bookings">Booking Logs</SelectItem>
                  <SelectItem value="patients">Patient Activity</SelectItem>
                  <SelectItem value="revenue">Revenue Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="filter-group">
              <label className="filter-label">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="filter-select">
                  <CalendarIcon className="filter-icon" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {dateRange === "custom" && (
              <>
                <div className="filter-group">
                  <label className="filter-label">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="date-picker-button">
                        <CalendarIcon className="button-icon" />
                        {startDate
                          ? startDate.toLocaleDateString()
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="calendar-popover">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="filter-group">
                  <label className="filter-label">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="date-picker-button">
                        <CalendarIcon className="button-icon" />
                        {endDate ? endDate.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="calendar-popover">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          startDate ? date < startDate : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="summary-grid">
          <Card className="summary-card">
            <div className="summary-card-header">
              <div className="summary-icon bg-blue-light">
                <DollarSign className="icon-blue" />
              </div>
            </div>
            <h3 className="summary-card-title">Total Revenue</h3>
            <p className="summary-card-value">₦‎107700000</p>
            <p className="summary-card-description">Selected period</p>
          </Card>

          <Card className="summary-card">
            <div className="summary-card-header">
              <div className="summary-icon bg-green-light">
                <FileText className="icon-green" />
              </div>
            </div>
            <h3 className="summary-card-title">Total Transactions</h3>
            <p className="summary-card-value">1,249</p>
            <p className="summary-card-description">Completed bookings</p>
          </Card>

          <Card className="summary-card">
            <div className="summary-card-header">
              <div className="summary-icon bg-purple-light">
                <Users className="icon-purple" />
              </div>
            </div>
            <h3 className="summary-card-title">Active Patients</h3>
            <p className="summary-card-value">2,847</p>
            <p className="summary-card-description">Registered users</p>
          </Card>

          <Card className="summary-card">
            <div className="summary-card-header">
              <div className="summary-icon bg-orange-light">
                <TrendingUp className="icon-orange" />
              </div>
            </div>
            <h3 className="summary-card-title">Growth Rate</h3>
            <p className="summary-card-value">+12.5%</p>
            <p className="summary-card-description">Month over month</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Monthly Growth */}
          <Card className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Monthly Growth Trend</h2>
              <p className="chart-subtitle">
                Patients, bookings, and revenue over time
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#007BFF"
                  strokeWidth={2}
                  name="Patients"
                  dot={{ fill: "#007BFF", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00B894"
                  strokeWidth={2}
                  name="Bookings"
                  dot={{ fill: "#00B894", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Patient Activity */}
          <Card className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Patient Activity</h2>
              <p className="chart-subtitle">
                Daily new patients and appointments
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="newPatients"
                  fill="#007BFF"
                  name="New Patients"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="appointments"
                  fill="#00B894"
                  name="Appointments"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Transaction Table */}
        <Card className="transactions-table-card">
          <div className="table-header">
            <h2 className="table-title">Transaction Report</h2>
            <p className="table-subtitle">
              Detailed transaction history with revenue split
            </p>
          </div>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Clinic Share (95%)</TableHead>
                  <TableHead>Platform Fee (5%)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="transaction-id">
                      {transaction.id}
                    </TableCell>
                    <TableCell className="transaction-date">
                      {transaction.date}
                    </TableCell>
                    <TableCell className="patient-name">
                      {transaction.patient}
                    </TableCell>
                    <TableCell className="doctor-name">
                      {transaction.doctor}
                    </TableCell>
                    <TableCell className="amount">
                      ₦{transaction.amount}
                    </TableCell>
                    <TableCell className="clinic-share">
                      ₦{transaction.clinicShare}
                    </TableCell>
                    <TableCell className="platform-fee">
                      ₦{transaction.platformFee}
                    </TableCell>
                    <TableCell>
                      <span className="status-badge-completed">
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Export Info */}
        <Card className="info-card">
          <div className="info-content">
            <div className="info-icon">
              <FileText className="info-icon-svg" />
            </div>
            <div>
              <h3 className="info-title">Export Options</h3>
              <p className="info-description">
                You can export reports in multiple formats: PDF for
                presentations, CSV for data analysis, and Excel for detailed
                financial reviews. All exports include the complete data set
                based on your selected filters and date range.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
