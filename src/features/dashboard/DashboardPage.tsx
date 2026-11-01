import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  Users,
  HandHeart,
  Ticket as TicketIcon,
  Building2,
  AlertTriangle,
  UtensilsCrossed,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Printer,
  ChevronRight,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Donation } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    members,
    donations,
    tickets,
    stock,
    rooms,
    bookings,
    mealBookings,
    currentBranch,
    addToast
  } = useAppStore();

  const [selectedDonationForReceipt, setSelectedDonationForReceipt] = useState<Donation | null>(null);

  // Computed metrics
  const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const lowStockCount = stock.filter((s) => s.quantityOnHand <= s.minThreshold).length;
  const occupiedRoomsCount = rooms.filter((r) => r.status === 'Occupied').length;
  const totalRoomsCount = rooms.length;
  const occupancyRate = Math.round((occupiedRoomsCount / (totalRoomsCount || 1)) * 100);
  const todayMealsCount = mealBookings.reduce((sum, m) => sum + m.servingsCount, 0);

  // 6-Month Inflow/Outflow Mock Data for Recharts
  const monthlyFinancialData = [
    { month: 'Jun', donations: 840000, expenses: 510000 },
    { month: 'Jul', donations: 1120000, expenses: 620000 },
    { month: 'Aug', donations: 950000, expenses: 580000 },
    { month: 'Sep', donations: 1480000, expenses: 790000 },
    { month: 'Oct', donations: 1320000, expenses: 670000 },
    { month: 'Nov (Mtd)', donations: totalDonationsAmount, expenses: 485000 },
  ];

  // Room distribution for Pie chart
  const roomDistributionData = [
    { name: 'Deluxe AC', value: rooms.filter((r) => r.roomType === 'Deluxe AC').length, color: '#344E41' },
    { name: 'Standard AC', value: rooms.filter((r) => r.roomType === 'Standard AC').length, color: '#588157' },
    { name: 'Standard Non-AC', value: rooms.filter((r) => r.roomType === 'Standard Non-AC').length, color: '#A3B18A' },
    { name: 'Family Suite', value: rooms.filter((r) => r.roomType === 'Family Suite').length, color: '#24372E' },
    { name: 'Dormitory', value: rooms.filter((r) => r.roomType === 'Dormitory Bed').length, color: '#DAD7CD' },
  ];

  const handlePrintReceipt = (donation: Donation) => {
    setSelectedDonationForReceipt(donation);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome / Branch Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7EDE8] dark:bg-[#202A24] text-[#24372E] dark:text-[#E7EDE8] border border-[#D5E0D7] dark:border-[#2F3C33]">
              <Sparkles className="w-3 h-3 text-[#344E41]" />
              Live Operations Feed
            </span>
            <span className="text-xs text-[#68736C] dark:text-[#95A59A]">
              Branch: <strong className="text-[#1F2722] dark:text-[#F0F5F1]">{currentBranch}</strong>
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#68736C] dark:text-[#95A59A]">
            Comprehensive operational telemetry, daily seva donations, room bookings, and queue controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => {
              addToast({
                type: 'success',
                title: 'Daily Summary Exported',
                message: 'Consolidated report downloaded in PDF format.',
              });
            }}
          >
            Export Day Report
          </Button>
          <Button
            size="sm"
            leftIcon={<HandHeart className="w-3.5 h-3.5" />}
            onClick={() => navigate('/donations')}
          >
            New Donation
          </Button>
        </div>
      </div>

      {/* 6 Key Enterprise Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1: Total Donations */}
        <div
          onClick={() => navigate('/donations')}
          className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] hover:border-[#344E41]/40 cursor-pointer transition-all hover:shadow-card group"
        >
          <div className="flex items-center justify-between text-[#68736C] dark:text-[#95A59A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Donations MTD</span>
            <div className="w-7 h-7 rounded-lg bg-[#E7EDE8] dark:bg-[#27332C] flex items-center justify-center text-[#344E41] dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <HandHeart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
            ₹{(totalDonationsAmount / 100000).toFixed(2)}L
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        {/* Metric 2: Total Members */}
        <div
          onClick={() => navigate('/members')}
          className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] hover:border-[#344E41]/40 cursor-pointer transition-all hover:shadow-card group"
        >
          <div className="flex items-center justify-between text-[#68736C] dark:text-[#95A59A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Members</span>
            <div className="w-7 h-7 rounded-lg bg-[#E7EDE8] dark:bg-[#27332C] flex items-center justify-center text-[#344E41] dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
            {members.length} Enrolled
          </div>
          <div className="mt-1 text-[11px] text-[#68736C] dark:text-[#95A59A]">
            {members.filter((m) => m.membershipType === 'Life Member').length} Life Patrons
          </div>
        </div>

        {/* Metric 3: Active Darshan Passes */}
        <div
          onClick={() => navigate('/tickets')}
          className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] hover:border-[#344E41]/40 cursor-pointer transition-all hover:shadow-card group"
        >
          <div className="flex items-center justify-between text-[#68736C] dark:text-[#95A59A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Darshan Tokens</span>
            <div className="w-7 h-7 rounded-lg bg-[#E7EDE8] dark:bg-[#27332C] flex items-center justify-center text-[#344E41] dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <TicketIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
            {tickets.length} Issued
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {tickets.filter((t) => t.status === 'Used/Scanned').length} Scanned & Verified
          </div>
        </div>

        {/* Metric 4: Dharamshala Occupancy */}
        <div
          onClick={() => navigate('/dharamshala')}
          className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] hover:border-[#344E41]/40 cursor-pointer transition-all hover:shadow-card group"
        >
          <div className="flex items-center justify-between text-[#68736C] dark:text-[#95A59A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Occupancy</span>
            <div className="w-7 h-7 rounded-lg bg-[#E7EDE8] dark:bg-[#27332C] flex items-center justify-center text-[#344E41] dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
            {occupancyRate}% Full
          </div>
          <div className="mt-1 text-[11px] text-[#68736C] dark:text-[#95A59A]">
            {occupiedRoomsCount}/{totalRoomsCount} Rooms Checked-In
          </div>
        </div>

        {/* Metric 5: Low Stock Triggers */}
        <div
          onClick={() => navigate('/stock')}
          className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] hover:border-amber-400 cursor-pointer transition-all hover:shadow-card group"
        >
          <div className="flex items-center justify-between text-[#68736C] dark:text-[#95A59A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stock Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
            {lowStockCount} Items Low
          </div>
          <div className="mt-1 text-[11px] text-[#68736C] dark:text-[#95A59A]">
            Threshold replenished
          </div>
        </div>

        {/* Metric 6: Today's Meal Servings */}
        <div
          onClick={() => navigate('/meal-bookings')}
          className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] hover:border-[#344E41]/40 cursor-pointer transition-all hover:shadow-card group"
        >
          <div className="flex items-center justify-between text-[#68736C] dark:text-[#95A59A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Meal Servings</span>
            <div className="w-7 h-7 rounded-lg bg-[#E7EDE8] dark:bg-[#27332C] flex items-center justify-center text-[#344E41] dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
            {todayMealsCount} Thalis
          </div>
          <div className="mt-1 text-[11px] text-[#68736C] dark:text-[#95A59A]">
            Annakshetra Hall 1 & 2
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Inflow vs Operational Outflow Trend */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                Financial Velocity & Seva Collections
              </h3>
              <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
                Comparison of 80G Seva Inflows vs Operating Outflows (Vouchers)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#344E41]" />
                <span className="text-[#68736C] dark:text-[#95A59A]">Donations (₹)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                <span className="text-[#68736C] dark:text-[#95A59A]">Expenses (₹)</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFinancialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="donationsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#344E41" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#344E41" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3B18A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#A3B18A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9E4" strokeOpacity={0.5} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#68736C' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#68736C' }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <RechartsTooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#1F2722',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="donations"
                  stroke="#344E41"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#donationsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#A3B18A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expensesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Dharamshala Room Type Distribution */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                Dharamshala Room Capacity
              </h3>
              <span className="text-xs font-bold text-[#344E41] dark:text-[#88A695]">
                {rooms.length} Total Keys
              </span>
            </div>
            <p className="text-xs text-[#68736C] dark:text-[#95A59A] mb-4">
              Inventory segmented across blocks and tiers
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roomDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1F2722',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#E4E9E4] dark:border-[#2C3830]">
            {roomDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#68736C] dark:text-[#95A59A]">{item.name}</span>
                </div>
                <span className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  {item.value} rooms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Sections: Recent Donations Table & Quick Action Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donations Table (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                Recent Seva Donations
              </h3>
              <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
                Latest tax-exempt contributions across funds
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/donations')}
            >
              View All Register
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-y border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-2.5 px-3">Receipt #</th>
                  <th className="py-2.5 px-3">Donor Name</th>
                  <th className="py-2.5 px-3">Fund / Purpose</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">80G Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {donations.slice(0, 5).map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-[#1F2722] dark:text-[#F0F5F1]">
                      {d.receiptNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                      {d.donorName}
                    </td>
                    <td className="py-3 px-3 text-[#68736C] dark:text-[#95A59A] truncate max-w-[150px]">
                      {d.fund}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E7EDE8] text-[#24372E] dark:bg-[#202A24] dark:text-[#E7EDE8]">
                        {d.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handlePrintReceipt(d)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#344E41] dark:text-[#88A695] hover:underline"
                      >
                        <Printer className="w-3 h-3" />
                        Print 80G
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Pilgrim Queue & Quick Actions Panel (1 Col) */}
        <div className="space-y-6">
          {/* Darshan Queue Counter Widget */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                Darshan Queue Status
              </h3>
              <StatusBadge status="Live Counter" variant="success" size="sm" />
            </div>
            <p className="text-xs text-[#68736C] dark:text-[#95A59A] mb-4">
              Estimated Sanctum wait time: <strong>18 mins</strong>
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#FAFBF9] dark:bg-[#202A24] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                    VIP Abhishek Queue
                  </div>
                  <div className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
                    Slot: 10:00 AM - 11:30 AM
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#344E41] dark:text-emerald-400">
                  42 Devotees
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFBF9] dark:bg-[#202A24] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                    General Free Darshan
                  </div>
                  <div className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
                    Continuous Queue Line B
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#344E41] dark:text-emerald-400">
                  185 Devotees
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4E9E4] dark:border-[#2C3830] flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/tickets')}
              >
                Scan Ticket Pass
              </Button>
            </div>
          </div>

          {/* Quick Shortcuts Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#344E41] text-white shadow-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3B18A]">
              Quick Operations
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => navigate('/members')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                <span>Enroll Life Member</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E7EDE8]" />
              </button>
              <button
                onClick={() => navigate('/dharamshala')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                <span>Direct Room Check-In</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E7EDE8]" />
              </button>
              <button
                onClick={() => navigate('/meal-bookings')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                <span>Issue Bhojan Coupon</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E7EDE8]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable 80G Tax Exemption Receipt Preview Modal */}
      {selectedDonationForReceipt && (
        <Modal
          isOpen={!!selectedDonationForReceipt}
          onClose={() => setSelectedDonationForReceipt(null)}
          title="Official 80G Tax Exemption Receipt"
          subtitle="Registered Trust under Section 80G(5)(vi) of the Income Tax Act, 1961"
          maxWidth="2xl"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDonationForReceipt(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => {
                  window.print();
                  setSelectedDonationForReceipt(null);
                  addToast({
                    type: 'success',
                    title: 'Receipt Sent to Printer',
                    message: `Official 80G certificate dispatched for ${selectedDonationForReceipt.receiptNumber}`,
                  });
                }}
              >
                Print Official Certificate
              </Button>
            </>
          }
        >
          <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl p-6 bg-white dark:bg-[#1E2621] space-y-6 text-[#1F2722] dark:text-[#F0F5F1]">
            {/* Header of Receipt */}
            <div className="flex items-start justify-between border-b border-[#E4E9E4] dark:border-[#2C3830] pb-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#344E41] dark:text-[#88A695]">
                  SHREE TEMPLE & CHARITABLE TRUST FOUNDATION
                </h2>
                <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] mt-0.5">
                  Regd. Office: Main Campus, Heritage Gate, PIN: 400001
                </p>
                <p className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                  PAN: AAATS4910M | Section 80G Order No: CIT/E/80G/2021-22/A-492
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#FAFBF9] dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#2C3830]">
                  {selectedDonationForReceipt.receiptNumber}
                </span>
                <p className="text-[10px] text-[#68736C] dark:text-[#95A59A] mt-1">
                  Date: {selectedDonationForReceipt.donationDate}
                </p>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider block">
                  Received with thanks from
                </span>
                <p className="font-bold text-sm text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
                  {selectedDonationForReceipt.donorName}
                </p>
                <p className="text-[#68736C] dark:text-[#95A59A] mt-0.5">
                  Phone: {selectedDonationForReceipt.donorPhone}
                </p>
                {selectedDonationForReceipt.panNumber && (
                  <p className="text-[#68736C] dark:text-[#95A59A]">
                    Donor PAN: <strong>{selectedDonationForReceipt.panNumber}</strong>
                  </p>
                )}
              </div>

              <div>
                <span className="text-[10px] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider block">
                  Seva Purpose & Mode
                </span>
                <p className="font-bold text-sm text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
                  {selectedDonationForReceipt.fund}
                </p>
                <p className="text-[#68736C] dark:text-[#95A59A] mt-0.5">
                  Mode: {selectedDonationForReceipt.paymentMode}
                </p>
                <p className="text-[#68736C] dark:text-[#95A59A]">
                  Collector: {selectedDonationForReceipt.collectorName}
                </p>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-[#FAFBF9] dark:bg-[#161C18] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider block">
                  Total Contribution Amount
                </span>
                <span className="text-xl font-black text-[#344E41] dark:text-emerald-400">
                  ₹{selectedDonationForReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  80G Exemption Eligible
                </span>
              </div>
            </div>

            {selectedDonationForReceipt.notes && (
              <p className="text-xs italic text-[#68736C] dark:text-[#95A59A]">
                Note: "{selectedDonationForReceipt.notes}"
              </p>
            )}

            <div className="pt-4 border-t border-[#E4E9E4] dark:border-[#2C3830] flex justify-between items-end text-[10px] text-[#68736C] dark:text-[#95A59A]">
              <span>This is a computer-generated official trust acknowledgment.</span>
              <div className="text-right">
                <div className="w-24 border-b border-[#68736C] mb-1" />
                <span>Authorized Trustee Signature</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
