import { Banknote, TrendingUp, Download, Calendar, Building2, Wallet } from 'lucide-react';
import { Button } from '../UI/button';
import { Card } from '../UI/card';
import { Badge } from '../UI/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../UI/select';
import AdminLayout from '../shared/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

interface RemittanceProps {
  onNavigate: (screen: string) => void;
}

const monthlyData = [
  { month: 'Jan', clinic: 65481600, platform: 3446400 },
  { month: 'Feb', clinic: 75031000, platform: 3949000 },
  { month: 'Mar', clinic: 69574200, platform: 3661800 },
  { month: 'Apr', clinic: 88673000, platform: 4667000 },
  { month: 'May', clinic: 98222400, platform: 5169600 },
  { month: 'Jun', clinic: 102315000, platform: 5385000 },
];

const remittanceTransactions = [
  { id: 'RM001', clinic: 'City Heart Clinic', totalBookings: 45, grossRevenue: 9693000, clinicShare: 9208350.00, platformFee: 484650.00, status: 'Paid', date: 'Nov 1, 2025' },
  { id: 'RM002', clinic: 'Central Medical Center', totalBookings: 38, grossRevenue: 5456800, clinicShare: 5183960, platformFee: 272840.00, status: 'Paid', date: 'Nov 1, 2025' },
  { id: 'RM003', clinic: 'Skin Care Excellence', totalBookings: 52, grossRevenue: 8960640, clinicShare: 8512608, platformFee: 448032.00, status: 'Pending', date: 'Nov 8, 2025' },
  { id: 'RM004', clinic: 'Joint & Bone Center', totalBookings: 31, grossRevenue: 8012880, clinicShare: 7612236, platformFee: 400644.00, status: 'Pending', date: 'Nov 8, 2025' },
  { id: 'RM005', clinic: 'City Heart Clinic', totalBookings: 42, grossRevenue: 9046800, clinicShare: 8594460, platformFee: 452340.00, status: 'Processing', date: 'Nov 7, 2025' },
];

export default function Remittance({ onNavigate }: RemittanceProps) {
  const handleExportRemittance = () => {
    toast.success('Remittance report exported successfully');
  };

  const handleProcessPayout = (id: string) => {
    toast.success(`Processing payout for ${id}`);
  };

  const totalGrossRevenue = remittanceTransactions.reduce((sum, t) => sum + t.grossRevenue, 0);
  const totalClinicShare = remittanceTransactions.reduce((sum, t) => sum + t.clinicShare, 0);
  const totalPlatformFee = remittanceTransactions.reduce((sum, t) => sum + t.platformFee, 0);
  const pendingPayouts = remittanceTransactions.filter(t => t.status === 'Pending').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'Processing':
        return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout onNavigate={onNavigate} activeScreen="remittance">
  <div className="remittance-space">
    {/* Header */}
    <div className="remittance-header">
      <div>
        <h1 className="remittance-title">Remittance Management</h1>
        <p className="remittance-subtitle">Track revenue distribution and process payouts</p>
      </div>
      <Button 
        onClick={handleExportRemittance}
        className="export-remittance-button"
      >
        <Download className="button-icon" />
        Export Remittance
      </Button>
    </div>

    {/* Summary Cards */}
    <div className="summary-grid">
      <Card className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon bg-blue-light">
            <Banknote className="icon-blue" />
          </div>
        </div>
        <h3 className="summary-card-title">Total Revenue</h3>
        <p className="summary-card-value">₦{totalGrossRevenue.toLocaleString()}</p>
        <p className="summary-card-description">All transactions</p>
      </Card>

      <Card className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon bg-green-light">
            <Building2 className="icon-green" />
          </div>
        </div>
        <h3 className="summary-card-title">Clinic Share (95%)</h3>
        <p className="summary-card-value">₦{totalClinicShare.toLocaleString()}</p>
        <p className="summary-card-description">To be distributed</p>
      </Card>

      <Card className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon bg-purple-light">
            <Wallet className="icon-purple" />
          </div>
        </div>
        <h3 className="summary-card-title">Platform Fee (5%)</h3>
        <p className="summary-card-value">₦{totalPlatformFee.toLocaleString()}</p>
        <p className="summary-card-description">Platform earnings</p>
      </Card>

      <Card className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon bg-orange-light">
            <TrendingUp className="icon-orange" />
          </div>
        </div>
        <h3 className="summary-card-title">Pending Payouts</h3>
        <p className="summary-card-value">{pendingPayouts}</p>
        <p className="summary-card-description">Awaiting processing</p>
      </Card>
    </div>

    {/* Revenue Distribution Chart */}
    <Card className="chart-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">Revenue Distribution (95/5 Split)</h2>
          <p className="chart-subtitle">Monthly breakdown of revenue allocation</p>
        </div>
        <Select defaultValue="6months">
          <SelectTrigger className="chart-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="12months">Last 12 months</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            formatter={(value: number) => `₦${value.toLocaleString()}`}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="clinic" fill="#007BFF" name="Clinic Revenue (95%)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="platform" fill="#00B894" name="Platform Fee (5%)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>

    {/* Remittance Transactions */}
    <Card className="transactions-card">
      <div className="transactions-header">
        <h2 className="transactions-title">Remittance Transactions</h2>
        <p className="transactions-subtitle">Recent payout records</p>
      </div>
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Gross Revenue</TableHead>
              <TableHead>Clinic Share (95%)</TableHead>
              <TableHead>Platform Fee (5%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {remittanceTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="transaction-id">{transaction.id}</TableCell>
                <TableCell className="clinic-name">{transaction.clinic}</TableCell>
                <TableCell className="bookings-count">{transaction.totalBookings}</TableCell>
                <TableCell className="gross-revenue">₦{transaction.grossRevenue.toLocaleString()}</TableCell>
                <TableCell className="clinic-share">₦{transaction.clinicShare.toLocaleString()}</TableCell>
                <TableCell className="platform-fee">₦{transaction.platformFee.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="transaction-date">
                  <div className="date-container">
                    <Calendar className="date-icon" />
                    {transaction.date}
                  </div>
                </TableCell>
                <TableCell>
                  {transaction.status === 'Pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleProcessPayout(transaction.id)}
                      className="process-button"
                    >
                      Process
                    </Button>
                  )}
                  {transaction.status === 'Paid' && (
                    <Button size="sm" variant="outline" className="view-button">View</Button>
                  )}
                  {transaction.status === 'Processing' && (
                    <Button size="sm" variant="ghost" disabled className="processing-button">Processing...</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>

    {/* Info Card */}
    <Card className="info-card">
      <div className="info-content">
        <div className="info-icon">
          <Banknote className="info-icon-svg" />
        </div>
        <div>
          <h3 className="info-title">Revenue Split Information</h3>
          <p className="info-description">
            The platform operates on a 95/5 revenue split model. 95% of each consultation fee goes directly to the 
            clinic/doctor, while 5% is retained as a platform fee to maintain and improve the Healthcare Base infrastructure.
          </p>
        </div>
      </div>
    </Card>
  </div>
</AdminLayout>
  );
}
