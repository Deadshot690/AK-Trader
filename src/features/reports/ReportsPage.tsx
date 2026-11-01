import React, { useState } from 'react';
import { useAppStore } from '../../store';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  FileCheck2,
  PieChart as PieIcon,
  Filter,
  Building,
  HandHeart,
  Ticket as TicketIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';

export const ReportsPage: React.FC = () => {
  const { donations, vouchers, rooms, bookings, stock, tickets, addToast } = useAppStore();

  const [selectedReport, setSelectedReport] = useState<
    'financial' | 'donations' | 'occupancy' | 'stock'
  >('financial');
  const [dateRange, setDateRange] = useState('This Month (Nov 2026)');

  // Dynamic calculations
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = vouchers
    .filter((v) => v.voucherType === 'Payment Voucher')
    .reduce((sum, v) => sum + v.amount, 0);
  const netSurplus = totalDonations - totalExpenses;

  // Monthly Financial Breakdown
  const financialReportData = [
    { period: 'Week 1', collections: 320000, disbursements: 180000, surplus: 140000 },
    { period: 'Week 2', collections: 450000, disbursements: 220000, surplus: 230000 },
    { period: 'Week 3', collections: 390000, disbursements: 190000, surplus: 200000 },
    { period: 'Week 4 (Current)', collections: totalDonations, disbursements: totalExpenses, surplus: netSurplus },
  ];

  // Fund Breakdown Data
  const fundData = [
    { name: 'Annakshetra', total: 650000, count: 14 },
    { name: 'Temple Renovation', total: 510000, count: 8 },
    { name: 'Gaushala', total: 210000, count: 12 },
    { name: 'Medical Fund', total: 500000, count: 4 },
    { name: 'Education', total: 110000, count: 9 },
    { name: 'General Trust', total: 350000, count: 20 },
  ];

  const handleExport = (format: string) => {
    addToast({
      type: 'success',
      title: 'Report Generated',
      message: `${selectedReport.toUpperCase()} report successfully compiled into ${format}.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Reports, Financial Statements & Audits
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Statutory accounts, 80G tax return schedules, room occupancy rates, and inventory audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] px-3 py-2 text-[#1F2722] dark:text-[#F0F5F1] font-semibold focus:outline-none"
          >
            <option value="Today">Today's Day Book</option>
            <option value="This Week">Current Week</option>
            <option value="This Month (Nov 2026)">This Month (Nov 2026)</option>
            <option value="FY 2026-27">Financial Year 2026-27</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => handleExport('PDF Print')}
          >
            Print
          </Button>

          <Button
            size="sm"
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            onClick={() => handleExport('Excel (.xlsx)')}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <Tabs
        tabs={[
          { id: 'financial', label: 'Financial Day Book & Surplus' },
          { id: 'donations', label: '80G Seva Fund Ledger' },
          { id: 'occupancy', label: 'Dharamshala Room Occupancy' },
          { id: 'stock', label: 'Inventory Audit & Consumption' },
        ]}
        activeTab={selectedReport}
        onChange={(id) => setSelectedReport(id as any)}
      />

      {/* Report 1: Financial Surplus */}
      {selectedReport === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card">
              <span className="text-[10px] uppercase font-bold text-[#68736C] dark:text-[#95A59A] tracking-wider">
                Gross Seva Collections
              </span>
              <div className="text-xl font-black text-[#1F2722] dark:text-[#F0F5F1] mt-1">
                ₹{totalDonations.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Inflow from 80G Receipts
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card">
              <span className="text-[10px] uppercase font-bold text-[#68736C] dark:text-[#95A59A] tracking-wider">
                Operating Disbursements
              </span>
              <div className="text-xl font-black text-[#1F2722] dark:text-[#F0F5F1] mt-1">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Kitchen, Gaushala, Utilities
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2F3C33] shadow-card">
              <span className="text-[10px] uppercase font-bold text-[#344E41] dark:text-emerald-400 tracking-wider">
                Net Operating Surplus
              </span>
              <div className="text-xl font-black text-[#24372E] dark:text-[#F0F5F1] mt-1">
                ₹{netSurplus.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#344E41] dark:text-emerald-400 font-semibold">
                Transferred to Trust General Reserve
              </span>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card">
            <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1] mb-1">
              Weekly Inflow vs Outflow Velocity
            </h3>
            <p className="text-xs text-[#68736C] dark:text-[#95A59A] mb-6">
              Net balance surplus trajectory for {dateRange}
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialReportData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9E4" strokeOpacity={0.6} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#68736C' }} />
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
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="collections" name="Seva Inflow" fill="#344E41" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="disbursements" name="Operating Outflow" fill="#A3B18A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: 80G Seva Fund Ledger */}
      {selectedReport === 'donations' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="p-4 border-b border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#161C18]">
            <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
              Fund-Wise Seva Allocation Schedule
            </h3>
            <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
              Audited breakdown for 80G tax certificate return filing
            </p>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
              <tr>
                <th className="py-3 px-4">Designated Seva Fund</th>
                <th className="py-3 px-4">Receipts Count</th>
                <th className="py-3 px-4">Total Amount (₹)</th>
                <th className="py-3 px-4">Share of Total</th>
                <th className="py-3 px-4 text-right">80G Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
              {fundData.map((f) => (
                <tr key={f.name} className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923]">
                  <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                    {f.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                    {f.count} Donors
                  </td>
                  <td className="py-3.5 px-4 font-black text-sm text-[#344E41] dark:text-emerald-400">
                    ₹{f.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                    {Math.round((f.total / 2330000) * 100)}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      100% Tax Compliant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 3: Dharamshala Occupancy */}
      {selectedReport === 'occupancy' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Dharamshala Room Occupancy & Pilgrim Footfall
          </h3>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
            Current occupancy stands at {rooms.filter((r) => r.status === 'Occupied').length} / {rooms.length} rooms ({Math.round((rooms.filter((r) => r.status === 'Occupied').length / rooms.length) * 100)}%).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
              <span className="text-[10px] font-bold text-[#68736C]">Total Pilgrim Capacity</span>
              <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
                52 Beds
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
              <span className="text-[10px] font-bold text-[#68736C]">Average Daily Tariff</span>
              <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
                ₹1,250
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
              <span className="text-[10px] font-bold text-[#68736C]">Average Stay</span>
              <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
                2.4 Days
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
              <span className="text-[10px] font-bold text-[#68736C]">Cleaning Turnaround</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                45 mins
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report 4: Stock Audit */}
      {selectedReport === 'stock' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="p-4 border-b border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#161C18]">
            <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
              Inventory Valuation & Threshold Safety Buffer
            </h3>
            <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
              Full godown audit of essential puja samagri, grains, and housekeeping provisions
            </p>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Balance in Godown</th>
                <th className="py-3 px-4">Valuation (₹)</th>
                <th className="py-3 px-4 text-right">Replenishment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
              {stock.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                    {s.itemCode}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                    {s.itemName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                    {s.quantityOnHand} {s.unit}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#344E41] dark:text-emerald-400">
                    ₹{(s.quantityOnHand * s.unitPrice).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.quantityOnHand <= s.minThreshold ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Reorder Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Stock Optimal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
