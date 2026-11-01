import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { DharamshalaRoom, RoomBooking, RoomType, RoomStatus } from '../../types';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Bed,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Calendar,
  CreditCard,
  UserCheck,
  LogOut,
  DoorOpen,
  DollarSign,
  Download
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { Tabs } from '../../components/common/Tabs';

export const DharamshalaPage: React.FC = () => {
  const { rooms, bookings, updateRoomStatus, addBooking, checkoutBooking, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'matrix' | 'bookings'>('matrix');
  const [blockFilter, setBlockFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedRoomForCheckIn, setSelectedRoomForCheckIn] = useState<DharamshalaRoom | null>(null);
  const [settlingBooking, setSettlingBooking] = useState<RoomBooking | null>(null);

  // Check-In Form
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState<'Aadhaar' | 'Passport' | 'Voter ID' | 'Driving License'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [roomNum, setRoomNum] = useState(
    rooms.find((r) => r.status === 'Available')?.roomNumber || '102'
  );
  const [advancePaid, setAdvancePaid] = useState('1500');

  // Computed metrics
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const cleaningCount = rooms.filter((r) => r.status === 'Under Cleaning').length;
  const occupancyRate = Math.round((occupiedCount / (totalRooms || 1)) * 100);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchBlock = blockFilter === 'All' || r.block === blockFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchSearch =
        r.roomNumber.includes(searchQuery) ||
        r.roomType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBlock && matchStatus && matchSearch;
    });
  }, [rooms, blockFilter, statusFilter, searchQuery]);

  const activeBookings = bookings.filter((b) => b.status === 'Checked-In');

  const handleOpenCheckInForRoom = (room: DharamshalaRoom) => {
    setSelectedRoomForCheckIn(room);
    setRoomNum(room.roomNumber);
    setAdvancePaid(String(room.dailyTariff));
    setIsCheckInModalOpen(true);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const targetRoom = rooms.find((r) => r.roomNumber === roomNum);
    const tariff = targetRoom?.dailyTariff || 1500;

    addBooking({
      roomNumber: roomNum,
      guestName,
      phone: phone || '+91 98333 44455',
      idProofType: idType,
      idProofNumber: idNumber || 'XXXX-XXXX-9912',
      guestCount: Number(guestCount) || 2,
      checkInDate: new Date().toISOString().substring(0, 10),
      checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
      advancePaid: Number(advancePaid) || tariff,
      totalBill: tariff * 2,
      paymentStatus: 'Advance Paid',
      status: 'Checked-In',
    });

    setIsCheckInModalOpen(false);
    setGuestName('');
    setIdNumber('');
  };

  const handleConfirmCheckout = () => {
    if (!settlingBooking) return;
    checkoutBooking(settlingBooking.id);
    setSettlingBooking(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Dharamshala & Pilgrim Guest House
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Visual room inventory grid, guest KYC verification, occupancy logs, and checkout settlement.
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
                title: 'Occupancy Log Exported',
                message: 'Guest stay register exported to spreadsheet.',
              });
            }}
          >
            Export Register
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setSelectedRoomForCheckIn(null);
              setIsCheckInModalOpen(true);
            }}
          >
            Guest Check-In
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Occupancy Rate
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {occupancyRate}% Full
          </div>
          <span className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
            {occupiedCount} of {totalRooms} rooms occupied
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Available Now
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {availableCount} Rooms Ready
          </div>
          <span className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
            Immediate walk-in allocation
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Under Housekeeping
          </span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {cleaningCount} Rooms
          </div>
          <span className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
            Cleaning & linen change
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Active Pilgrim Stays
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            {activeBookings.length} Active Records
          </div>
          <span className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
            KYC verified at reception
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'matrix', label: 'Visual Room Inventory Grid', count: rooms.length },
          { id: 'bookings', label: 'Guest Bookings & Stay Register', count: bookings.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Visual Room Grid */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830]">
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Search className="w-4 h-4 text-[#68736C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search room number..."
                className="w-full bg-transparent text-xs text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-[#68736C] font-semibold">Block:</span>
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
              >
                <option value="All">All Blocks</option>
                <option value="Block A (Main)">Block A (Main)</option>
                <option value="Block B (Annexe)">Block B (Annexe)</option>
                <option value="Block C (Pilgrim)">Block C (Pilgrim)</option>
                <option value="Tower Suite">Tower Suite</option>
              </select>

              <span className="text-xs text-[#68736C] font-semibold ml-2">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Under Cleaning">Under Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Room Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {filteredRooms.map((room) => {
              const activeBooking = bookings.find(
                (b) => b.roomNumber === room.roomNumber && b.status === 'Checked-In'
              );

              const statusColor = {
                Available: 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10',
                Occupied: 'border-sky-200 dark:border-sky-900/40 bg-sky-50/20 dark:bg-sky-950/10',
                'Under Cleaning': 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10',
                Maintenance: 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10',
              }[room.status];

              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${statusColor} hover:shadow-card`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-black text-[#1F2722] dark:text-[#F0F5F1]">
                        {room.roomNumber}
                      </span>
                      <StatusBadge status={room.status} size="sm" />
                    </div>

                    <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {room.roomType}
                    </div>
                    <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                      {room.block} • Floor {room.floor}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-[#344E41] dark:text-emerald-400">
                      ₹{room.dailyTariff}/night (Max {room.maxCapacity} Guests)
                    </div>

                    {activeBooking && (
                      <div className="mt-3 p-2 rounded-xl bg-white/70 dark:bg-[#181E1A]/70 border border-[#E4E9E4] dark:border-[#2C3830] text-[11px]">
                        <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1] truncate">
                          {activeBooking.guestName}
                        </div>
                        <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                          Due: {activeBooking.checkOutDate}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#E4E9E4]/60 dark:border-[#2C3830] flex gap-1.5">
                    {room.status === 'Available' && (
                      <Button
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => handleOpenCheckInForRoom(room)}
                      >
                        Check-In
                      </Button>
                    )}

                    {room.status === 'Occupied' && activeBooking && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setSettlingBooking(activeBooking)}
                      >
                        Check-Out
                      </Button>
                    )}

                    {room.status === 'Under Cleaning' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => updateRoomStatus(room.id, 'Available')}
                      >
                        Mark Ready
                      </Button>
                    )}

                    {room.status === 'Maintenance' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => updateRoomStatus(room.id, 'Available')}
                      >
                        Restore Room
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Stay & Bookings Register */}
      {activeTab === 'bookings' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Room #</th>
                  <th className="py-3 px-4">Guest Name & ID KYC</th>
                  <th className="py-3 px-4">Stay Duration</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4">Total / Advance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {b.bookingRef}
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-[#344E41] dark:text-emerald-400">
                      Room {b.roomNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                        {b.guestName}
                      </div>
                      <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                        {b.idProofType}: {b.idProofNumber} • {b.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1F2722] dark:text-[#F0F5F1]">
                      {b.checkInDate} to {b.checkOutDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                      {b.guestCount} Persons
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                        ₹{b.totalBill}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Adv Paid: ₹{b.advancePaid}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'Checked-In' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSettlingBooking(b)}
                        >
                          Check-Out & Settle
                        </Button>
                      ) : (
                        <span className="text-[11px] text-[#68736C]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest Check-In Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Dharamshala Guest Check-In"
        subtitle="Allocate room, register guest identity credentials, and record advance deposit"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCheckInSubmit}>
              Complete Check-In & Issue Key
            </Button>
          </>
        }
      >
        <form onSubmit={handleCheckInSubmit} className="space-y-4">
          <Input
            label="Primary Guest Name"
            placeholder="e.g. Balram Murthy"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Select Room"
              value={roomNum}
              onChange={(e) => {
                setRoomNum(e.target.value);
                const r = rooms.find((rm) => rm.roomNumber === e.target.value);
                if (r) setAdvancePaid(String(r.dailyTariff));
              }}
              options={rooms
                .filter((r) => r.status === 'Available')
                .map((r) => ({
                  value: r.roomNumber,
                  label: `Room ${r.roomNumber} - ${r.roomType} (₹${r.dailyTariff}/day)`,
                }))}
            />
            <Input
              label="Contact Phone"
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Identity Proof Type"
              value={idType}
              onChange={(e) => setIdType(e.target.value as any)}
              options={[
                { value: 'Aadhaar', label: 'Aadhaar Card' },
                { value: 'Passport', label: 'Passport (International/NRI)' },
                { value: 'Voter ID', label: 'Voter ID Card' },
                { value: 'Driving License', label: 'Driving License' },
              ]}
            />
            <Input
              label="ID Document Number"
              placeholder="e.g. 1234-5678-9012"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Number of Guests"
              type="number"
              min="1"
              max="15"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
            <Input
              label="Advance Deposit (₹)"
              type="number"
              value={advancePaid}
              onChange={(e) => setAdvancePaid(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Checkout and Bill Settlement Modal */}
      {settlingBooking && (
        <Modal
          isOpen={!!settlingBooking}
          onClose={() => setSettlingBooking(null)}
          title="Dharamshala Bill Settlement & Checkout"
          subtitle={`Room ${settlingBooking.roomNumber} - Guest: ${settlingBooking.guestName}`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSettlingBooking(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmCheckout}>
                Settle Bill & Free Room
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAFBF9] dark:bg-[#161C18] border border-[#E4E9E4] dark:border-[#2C3830] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#68736C]">Booking Reference:</span>
                <span className="font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  {settlingBooking.bookingRef}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Check-In Date:</span>
                <span className="font-semibold">{settlingBooking.checkInDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Check-Out Date:</span>
                <span className="font-semibold">{settlingBooking.checkOutDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Gross Room Rental:</span>
                <span className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  ₹{settlingBooking.totalBill}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Less: Advance Deposit:</span>
                <span className="font-bold">-₹{settlingBooking.advancePaid}</span>
              </div>
              <div className="pt-2 border-t border-[#E4E9E4] dark:border-[#2C3830] flex justify-between text-sm font-black text-[#344E41] dark:text-emerald-400">
                <span>Net Balance Due:</span>
                <span>₹{Math.max(0, settlingBooking.totalBill - settlingBooking.advancePaid)}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] leading-relaxed">
              Upon confirming checkout, Room {settlingBooking.roomNumber} will automatically transition to "Under Cleaning" status for housekeeping sanitation.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
