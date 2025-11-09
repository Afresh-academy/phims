import { Users, Calendar, Banknote, TrendingUp, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { Button } from '../UI/button';
import { Card } from '../UI/card';
import { Badge } from '../UI/badge';
import AdminLayout from '../shared/AdminLayout';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
}

// Mock Data
const revenueData = [
  { month: 'Jan', clinic: 65481600, platform: 3446400 },
  { month: 'Feb', clinic: 75031000, platform: 3949000 },
  { month: 'Mar', clinic: 69574200, platform: 3661800 },
  { month: 'Apr', clinic: 88673000, platform: 4667000 },
  { month: 'May', clinic: 98222400, platform:  5169600},
  { month: 'Jun', clinic: 102315000, platform: 5385000 },
];

const bookingsData = [
  { name: 'Mon', bookings: 45 },
  { name: 'Tue', bookings: 52 },
  { name: 'Wed', bookings: 48 },
  { name: 'Thu', bookings: 61 },
  { name: 'Fri', bookings: 55 },
  { name: 'Sat', bookings: 38 },
  { name: 'Sun', bookings: 28 },
];

const revenueSplitData = [
  { name: 'Clinic Revenue (95%)', value: 102315000, color: '#007BFF' },
  { name: 'Platform Fee (5%)', value: 5385000, color: '#00B894' },
];

const recentBookings = [
  { id: 1, patient: 'John Smith', doctor: 'Dr. Sarah Johnson', amount: 215400, status: 'Confirmed', date: 'Nov 8, 2025' },
  { id: 2, patient: 'Emma Wilson', doctor: 'Dr. Michael Chen', amount: 143600, status: 'Pending', date: 'Nov 8, 2025' },
  { id: 3, patient: 'Michael Brown', doctor: 'Dr. Emily Rodriguez', amount: 172320, status: 'Confirmed', date: 'Nov 8, 2025' },
  { id: 4, patient: 'Sarah Davis', doctor: 'Dr. James Wilson', amount: 258480, status: 'Confirmed', date: 'Nov 7, 2025' },
];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  return (
    <AdminLayout onNavigate={onNavigate} activeScreen="admin-dashboard">
  <div className="dashboard-space">
    {/* Header */}
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Monitor your healthcare platform performance</p>
      </div>
      <Button className="export-button">
        <Download className="icon-spacing" />
        Export Report
      </Button>
    </div>

    {/* Stats Cards */}
    <div className="stats-grid">
      <Card className="stat-card-item">
        <div className="stat-card-header">
          <div className="icon-container bg-blue-light">
            <Users className="icon-blue" />
          </div>
          <Badge className="badge-success">
            <ArrowUpRight className="badge-icon" />
            12%
          </Badge>
        </div>
        <h3 className="stat-card-title">Total Patients</h3>
        <p className="stat-card-value">2,847</p>
      </Card>

      <Card className="stat-card-item">
        <div className="stat-card-header">
          <div className="icon-container bg-green-light">
            <Calendar className="icon-green" />
          </div>
          <Badge className="badge-success">
            <ArrowUpRight className="badge-icon" />
            8%
          </Badge>
        </div>
        <h3 className="stat-card-title">Total Bookings</h3>
        <p className="stat-card-value">1,249</p>
      </Card>

      <Card className="stat-card-item">
        <div className="stat-card-header">
          <div className="icon-container bg-purple-light">
            <Banknote className="icon-purple" />
          </div>
          <Badge className="badge-success">
            <ArrowUpRight className="badge-icon" />
            15%
          </Badge>
        </div>
        <h3 className="stat-card-title">Total Revenue</h3>
        <p className="stat-card-value"> ₦‎102,315,000</p>
      </Card>

      <Card className="stat-card-item">
        <div className="stat-card-header">
          <div className="icon-container bg-orange-light">
            <TrendingUp className="icon-orange" />
          </div>
          <Badge className="badge-danger">
            <ArrowDownRight className="badge-icon" />
            3%
          </Badge>
        </div>
        <h3 className="stat-card-title">Platform Fee</h3>
        <p className="stat-card-value">₦‎5,385,000</p>
      </Card>
    </div>

    {/* Charts Row */}
    <div className="charts-grid">
      {/* Revenue Trend */}
      <Card className="chart-card">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Revenue Trend</h2>
            <p className="chart-subtitle">Monthly revenue breakdown (95/5 split)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorClinic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B894" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00B894" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="clinic" 
              stroke="#007BFF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorClinic)" 
              name="Clinic Revenue (95%)"
            />
            <Area 
              type="monotone" 
              dataKey="platform" 
              stroke="#00B894" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPlatform)" 
              name="Platform Fee (5%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bookings Chart */}
      <Card className="chart-card">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Weekly Bookings</h2>
            <p className="chart-subtitle">Last 7 days activity</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="bookings" fill="#007BFF" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Revenue Split & Recent Bookings */}
    <div className="content-grid">
      {/* Revenue Split Pie Chart */}
      <Card className="revenue-card">
        <h2 className="chart-title">Revenue Split (This Month)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={revenueSplitData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {revenueSplitData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="revenue-legend">
          {revenueSplitData.map((item, index) => (
            <div key={index} className="revenue-item">
              <div className="revenue-label">
                <div className="color-dot" style={{ backgroundColor: item.color }} />
                <span className="revenue-name">{item.name}</span>
              </div>
              <span className="revenue-amount">₦{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Bookings */}
      <Card className="bookings-card">
        <div className="bookings-header">
          <h2 className="chart-title">Recent Bookings</h2>
          <Button 
            variant="link" 
            className="view-all-button"
            onClick={() => onNavigate('booking-management')}
          >
            View All →
          </Button>
        </div>

        <div className="bookings-list">
          {recentBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="booking-item"
            >
              <div className="booking-info">
                <p className="booking-patient">{booking.patient}</p>
                <p className="booking-doctor">{booking.doctor}</p>
                <p className="booking-date">{booking.date}</p>
              </div>
              <div className="booking-details">
                <p className="booking-amount">₦{booking.amount}</p>
                <Badge 
                  variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}
                  className={booking.status === 'Confirmed' ? 'badge-confirmed' : 'badge-secondary'}
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
</AdminLayout>
  );
}
