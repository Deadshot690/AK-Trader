import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { MealBooking, MealSession, MealType } from '../../types';
import {
  UtensilsCrossed,
  Search,
  Filter,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Users,
  QrCode,
  Download,
  Soup,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';

export const MealBookingsPage: React.FC = () => {
  const { mealBookings, addMealBooking, redeemMealToken, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTokenForPrint, setSelectedTokenForPrint] = useState<MealBooking | null>(null);

  // Quick Redemption State
  const [tokenInput, setTokenInput] = useState('');

  // Form State
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [session, setSession] = useState<MealSession>('Lunch Bhojan');
  const [mealType, setMealType] = useState<MealType>('Standard Thali');
  const [servingsCount, setServingsCount] = useState('2');
  const [isComplimentary, setIsComplimentary] = useState(false);

  // Computed metrics
  const totalServings = mealBookings.reduce((sum, m) => sum + m.servingsCount, 0);
  const redeemedCount = mealBookings
    .filter((m) => m.status === 'Redeemed')
    .reduce((sum, m) => sum + m.servingsCount, 0);
  const pendingServings = totalServings - redeemedCount;

  const filteredBookings = useMemo(() => {
    return mealBookings.filter((m) => {
      const matchSearch =
        m.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);

      const matchSession = sessionFilter === 'All' || m.session === sessionFilter;
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;

      return matchSearch && matchSession && matchStatus;
    });
  }, [mealBookings, searchQuery, sessionFilter, statusFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) return;

    const count = Number(servingsCount) || 1;
    const nominalRate = isComplimentary ? 0 : 60;
    const totalAmount = count * nominalRate;

    const tokenNum = addMealBooking({
      devoteeName,
      phone: phone || '+91 94000 33221',
      session,
      mealType,
      servingsCount: count,
      bookingDate: new Date().toISOString().substring(0, 10),
      isComplimentary,
      totalAmount,
    });

    setIsAddModalOpen(false);
    const created = mealBookings.find((m) => m.tokenNumber === tokenNum) || {
      id: 'temp',
      tokenNumber: tokenNum,
      devoteeName,
      phone,
      session,
      mealType,
      servingsCount: count,
      bookingDate: new Date().toISOString().substring(0, 10),
      isComplimentary,
      totalAmount,
      status: 'Confirmed' as const,
    };
    setSelectedTokenForPrint(created as MealBooking);
  };

  const handleQuickRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    redeemMealToken(tokenInput.trim().toUpperCase());
    setTokenInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Annakshetra & Bhojanalaya Meal Tokens
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Daily pilgrim dining schedules, sattvic diet tokens, and kitchen meal-serving counters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Dining Register Exported',
                message: 'Meal tokens tally exported for kitchen head chef.',
              });
            }}
          >
            Export Sheet
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setDevoteeName('');
              setIsAddModalOpen(true);
            }}
          >
            Issue Meal Token
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Total Meals Booked Today
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {totalServings} Thalis
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Served / Redeemed
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {redeemedCount} Served
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Pending in Dining Hall
          </span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {pendingServings} Expected
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Dining Hall Capacity
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            250 Seats
          </div>
        </div>
      </div>

      {/* Meal Session Schedules Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">Morning Prasad</div>
            <div className="text-[10px] text-[#68736C]">07:30 - 09:30 AM</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Soup className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">Lunch Bhojan</div>
            <div className="text-[10px] text-[#68736C]">11:30 AM - 02:30 PM</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">Evening Tea & Snacks</div>
            <div className="text-[10px] text-[#68736C]">04:30 - 06:00 PM</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">Dinner Prasad</div>
            <div className="text-[10px] text-[#68736C]">07:30 - 09:30 PM</div>
          </div>
        </div>
      </div>

      {/* Live Meal Token Verification Bar */}
      <div className="p-4 rounded-2xl bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2F3C33] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#344E41] text-white flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
              Bhojanalaya Kitchen Token Redemption Desk
            </h4>
            <p className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
              Enter token number (e.g. ML-TKN-0421) when presenting coupon at meal counter.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickRedeem} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="e.g. ML-TKN-0421"
            className="flex-1 rounded-xl bg-white dark:bg-[#181E1A] border border-[#D5E0D7] dark:border-[#2F3C33] px-3.5 py-2 text-xs font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none focus:ring-2 focus:ring-[#344E41]"
          />
          <Button size="sm" type="submit">
            Redeem & Serve
          </Button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830]">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68736C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devotee, token #, phone..."
              className="w-full bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none focus:ring-2 focus:ring-[#344E41]/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-[#68736C] font-semibold">Session:</span>
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Sessions</option>
            <option value="Morning Prasad">Morning Prasad</option>
            <option value="Lunch Bhojan">Lunch Bhojan</option>
            <option value="Evening Tea & Snacks">Evening Tea & Snacks</option>
            <option value="Dinner Prasad">Dinner Prasad</option>
          </select>

          <span className="text-xs text-[#68736C] font-semibold ml-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Redeemed">Redeemed / Served</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No Meal Tokens Found"
          description="No meal bookings match your criteria. Issue a coupon token for pilgrims."
          actionLabel="Issue Meal Token"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Devotee / Group Name</th>
                  <th className="py-3 px-4">Session & Diet Type</th>
                  <th className="py-3 px-4">Servings Count</th>
                  <th className="py-3 px-4">Token Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {filteredBookings.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {m.tokenNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {m.devoteeName}
                      <div className="text-[10px] text-[#68736C] font-normal">{m.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                        {m.session}
                      </div>
                      <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                        {m.mealType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-sm text-[#344E41] dark:text-emerald-400">
                      {m.servingsCount} Thalis
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {m.isComplimentary ? 'Complimentary' : `₹${m.totalAmount}`}
                    </td>
                    <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                      {m.bookingDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Printer className="w-3 h-3" />}
                          onClick={() => setSelectedTokenForPrint(m)}
                        >
                          Print Coupon
                        </Button>
                        {m.status === 'Confirmed' && (
                          <button
                            onClick={() => redeemMealToken(m.tokenNumber)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            Redeem
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue Meal Token */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Issue Annakshetra Meal Coupon"
        subtitle="Book bhojanalaya prasad servings with session allotment"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateSubmit}>
              Issue Meal Token
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Devotee / Group Name"
            placeholder="e.g. Bhakti Sangam Yatri Mandal"
            value={devoteeName}
            onChange={(e) => setDevoteeName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Dining Session"
              value={session}
              onChange={(e) => setSession(e.target.value as any)}
              options={[
                { value: 'Lunch Bhojan', label: 'Lunch Bhojan (11:30 AM - 02:30 PM)' },
                { value: 'Dinner Prasad', label: 'Dinner Prasad (07:30 PM - 09:30 PM)' },
                { value: 'Morning Prasad', label: 'Morning Prasad (07:30 AM - 09:30 AM)' },
                { value: 'Evening Tea & Snacks', label: 'Evening Tea & Snacks (04:30 PM - 06:00 PM)' },
              ]}
            />
            <Select
              label="Diet Category"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              options={[
                { value: 'Standard Thali', label: 'Standard Thali' },
                { value: 'Special Feast (Utsav)', label: 'Special Feast (Utsav)' },
                { value: 'Sattvic / Jain Diet', label: 'Sattvic / Jain Diet (No Onion/Garlic)' },
                { value: 'Dietary Packet', label: 'Dietary Travel Packet' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Number of Servings (Thalis)"
              type="number"
              min="1"
              max="500"
              value={servingsCount}
              onChange={(e) => setServingsCount(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isComp"
              checked={isComplimentary}
              onChange={(e) => setIsComplimentary(e.target.checked)}
              className="rounded text-[#344E41] focus:ring-[#344E41]"
            />
            <label htmlFor="isComp" className="text-xs font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
              Complimentary Trust Seva (Waive nominal token fee)
            </label>
          </div>
        </form>
      </Modal>

      {/* Printable Meal Coupon Modal */}
      {selectedTokenForPrint && (
        <Modal
          isOpen={!!selectedTokenForPrint}
          onClose={() => setSelectedTokenForPrint(null)}
          title="Printable Bhojanalaya Coupon"
          subtitle="Present at Annakshetra Counter for Dining Entry"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedTokenForPrint(null)}>
                Close
              </Button>
              <Button
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => {
                  window.print();
                  setSelectedTokenForPrint(null);
                  addToast({
                    type: 'success',
                    title: 'Token Printed',
                    message: `Meal coupon ${selectedTokenForPrint.tokenNumber} sent to printer.`,
                  });
                }}
              >
                Print Token
              </Button>
            </>
          }
        >
          <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl p-5 bg-white dark:bg-[#1E2621] space-y-4 text-center">
            <div className="text-xs font-black tracking-wider uppercase text-[#344E41] dark:text-[#88A695]">
              SHREE ANNAKSHETRA BHOJANALAYA
            </div>
            <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1]">
              {selectedTokenForPrint.session}
            </div>

            <div className="w-32 h-32 mx-auto rounded-2xl bg-[#F3F6F3] dark:bg-[#181E1A] border-2 border-dashed border-[#344E41] p-3 flex flex-col items-center justify-center">
              <QrCode className="w-16 h-16 text-[#1F2722] dark:text-[#F0F5F1]" />
              <span className="font-mono text-[9px] font-bold text-[#68736C] mt-1">
                {selectedTokenForPrint.tokenNumber}
              </span>
            </div>

            <div className="bg-[#FAFBF9] dark:bg-[#161C18] p-3 rounded-xl border border-[#E4E9E4] dark:border-[#2C3830] text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-[#68736C]">Devotee / Group:</span>
                <strong className="text-[#1F2722] dark:text-[#F0F5F1]">
                  {selectedTokenForPrint.devoteeName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Servings Count:</span>
                <strong className="text-emerald-700 dark:text-emerald-400">
                  {selectedTokenForPrint.servingsCount} Thalis
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Diet Category:</span>
                <strong>{selectedTokenForPrint.mealType}</strong>
              </div>
            </div>

            <p className="text-[10px] text-[#68736C]">
              Please queue politely in Dining Hall 1. Tokens valid strictly for date and session issued.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
