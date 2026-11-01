import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Ticket, TicketType, TicketStatus } from '../../types';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  Plus,
  QrCode,
  CheckCircle2,
  XCircle,
  Printer,
  Download,
  Users,
  Clock,
  ScanLine,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';

export const TicketsPage: React.FC = () => {
  const { tickets, issueTicket, scanTicket, cancelTicket, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTicketForPrint, setSelectedTicketForPrint] = useState<Ticket | null>(null);

  // Quick Scanner State
  const [scanInput, setScanInput] = useState('');

  // Form State
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('Special VIP Darshan');
  const [slotTime, setSlotTime] = useState('10:00 AM - 11:30 AM');
  const [guestCount, setGuestCount] = useState('2');
  const [counterId, setCounterId] = useState('Counter 02 (VIP)');

  const ratePerHead = ticketType.includes('VIP')
    ? 250
    : ticketType.includes('Puja')
    ? 1100
    : ticketType.includes('Aarti')
    ? 250
    : ticketType.includes('Kalyanam')
    ? 2500
    : 0;

  const totalCalculatedAmount = ratePerHead * (Number(guestCount) || 1);

  // Summary Metrics
  const totalIssued = tickets.length;
  const scannedCount = tickets.filter((t) => t.status === 'Used/Scanned').length;
  const vipCount = tickets.filter((t) => t.ticketType.includes('VIP')).length;
  const totalDevoteesToday = tickets.reduce((sum, t) => sum + t.guestCount, 0);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.phone.includes(searchQuery);

      const matchType = typeFilter === 'All' || t.ticketType === typeFilter;
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [tickets, searchQuery, typeFilter, statusFilter]);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) return;

    const count = Number(guestCount) || 1;
    const tktNum = issueTicket({
      devoteeName,
      phone: phone || '+91 99000 11223',
      ticketType,
      slotTime,
      date: new Date().toISOString().substring(0, 10),
      guestCount: count,
      amount: totalCalculatedAmount,
      counterId,
    });

    setIsIssueModalOpen(false);
    const created = tickets.find((t) => t.ticketNumber === tktNum) || {
      id: 'temp',
      ticketNumber: tktNum,
      devoteeName,
      phone,
      ticketType,
      slotTime,
      date: new Date().toISOString().substring(0, 10),
      guestCount: count,
      amount: totalCalculatedAmount,
      status: 'Issued' as TicketStatus,
      counterId,
      qrCodeMock: `QR-${tktNum}`,
    };
    setSelectedTicketForPrint(created as Ticket);
  };

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    scanTicket(scanInput.trim().toUpperCase());
    setScanInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Tickets, Darshan & Puja Passes
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Real-time counter issuance, time-slot scheduling, and instant QR verification.
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
                title: 'Daily Register Exported',
                message: 'Darshan tokens summary downloaded.',
              });
            }}
          >
            Export Register
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setDevoteeName('');
              setIsIssueModalOpen(true);
            }}
          >
            Issue New Pass
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Total Passes Issued
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {totalIssued} Passes
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Devotees Expected
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            {totalDevoteesToday} Pilgrims
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Scanned / Admitted
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {scannedCount} Admitted
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Special VIP Queue
          </span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {vipCount} Passes
          </div>
        </div>
      </div>

      {/* Live QR Validator Bar */}
      <div className="p-4 rounded-2xl bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2F3C33] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#344E41] text-white flex items-center justify-center shrink-0">
            <ScanLine className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
              Sanctum Gate QR Scanner & Token Validator
            </h4>
            <p className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
              Scan ticket barcode or paste ticket number (e.g. TKT-DAR-8841) to verify entry.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickScan} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Enter or scan token code..."
            className="flex-1 rounded-xl bg-white dark:bg-[#181E1A] border border-[#D5E0D7] dark:border-[#2F3C33] px-3.5 py-2 text-xs font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none focus:ring-2 focus:ring-[#344E41]"
          />
          <Button size="sm" type="submit">
            Verify Pass
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
              placeholder="Search devotee name, ticket #, phone..."
              className="w-full bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none focus:ring-2 focus:ring-[#344E41]/20"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#68736C] hover:text-[#1F2722] shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-[#68736C]">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Special VIP Darshan">Special VIP Darshan</option>
            <option value="Mahapuja / Abhishek">Mahapuja / Abhishek</option>
            <option value="General Darshan">General Darshan</option>
            <option value="Aarti Pass">Aarti Pass</option>
            <option value="Kalyanam Ritual">Kalyanam Ritual</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-[#68736C] ml-2">
            <span className="font-semibold">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Issued">Issued</option>
            <option value="Used/Scanned">Used / Scanned</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tickets Data Table */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No Tickets Found"
          description="No darshan pass matches your criteria. Try adjusting filters or issue a new pass."
          actionLabel="Issue Ticket"
          onAction={() => setIsIssueModalOpen(true)}
        />
      ) : (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Pass Token #</th>
                  <th className="py-3 px-4">Devotee Name & Phone</th>
                  <th className="py-3 px-4">Category & Slot Time</th>
                  <th className="py-3 px-4">Pilgrims</th>
                  <th className="py-3 px-4">Fee (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                        {t.devoteeName}
                      </div>
                      <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                        {t.phone} • {t.counterId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                        {t.ticketType}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#68736C] dark:text-[#95A59A] mt-0.5">
                        <Clock className="w-3 h-3 text-[#344E41]" />
                        <span>{t.slotTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {t.guestCount} {t.guestCount > 1 ? 'Persons' : 'Person'}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-sm text-[#1F2722] dark:text-[#F0F5F1]">
                      {t.amount > 0 ? `₹${t.amount.toLocaleString('en-IN')}` : 'Free Seva'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Printer className="w-3 h-3" />}
                          onClick={() => setSelectedTicketForPrint(t)}
                        >
                          Print QR
                        </Button>
                        {t.status === 'Issued' && (
                          <button
                            onClick={() => scanTicket(t.ticketNumber)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            Mark Admitted
                          </button>
                        )}
                        {t.status === 'Issued' && (
                          <button
                            onClick={() => cancelTicket(t.id)}
                            className="p-1.5 text-[#68736C] hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Cancel Ticket"
                          >
                            <XCircle className="w-3.5 h-3.5" />
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

      {/* Issue Ticket Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Darshan / Puja Ticket"
        subtitle="Generate authentic computerized pass with timing slot and QR token"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleIssueSubmit}>
              Print Pass & Collect ₹{totalCalculatedAmount}
            </Button>
          </>
        }
      >
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <Input
            label="Devotee Full Name"
            placeholder="e.g. Muralidhar Hegde"
            value={devoteeName}
            onChange={(e) => setDevoteeName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Darshan Category"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value as any)}
              options={[
                { value: 'Special VIP Darshan', label: 'Special VIP Darshan (₹250/head)' },
                { value: 'Mahapuja / Abhishek', label: 'Mahapuja / Abhishek (₹1,100/head)' },
                { value: 'General Darshan', label: 'General Free Darshan (₹0)' },
                { value: 'Aarti Pass', label: 'Aarti Pass (₹250/head)' },
                { value: 'Kalyanam Ritual', label: 'Kalyanam Ritual (₹2,500/head)' },
              ]}
            />
            <Input
              label="Devotees Count"
              type="number"
              min="1"
              max="20"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Sanctum Slot Time"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              options={[
                { value: '06:00 AM - 07:30 AM', label: '06:00 AM - 07:30 AM (Brahma Muhurta)' },
                { value: '08:30 AM - 10:00 AM', label: '08:30 AM - 10:00 AM (Morning)' },
                { value: '10:00 AM - 11:30 AM', label: '10:00 AM - 11:30 AM (Peak)' },
                { value: '12:00 PM - 02:00 PM', label: '12:00 PM - 02:00 PM (Afternoon)' },
                { value: '04:30 PM - 06:00 PM', label: '04:30 PM - 06:00 PM (Evening)' },
                { value: '07:00 PM - 08:30 PM', label: '07:00 PM - 08:30 PM (Maha Aarti)' },
              ]}
            />
            <Input
              label="Mobile Number"
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#161C18] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-between">
            <span className="text-xs text-[#68736C] dark:text-[#95A59A]">
              Total Payable Token Amount:
            </span>
            <span className="text-lg font-black text-[#344E41] dark:text-emerald-400">
              ₹{totalCalculatedAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </form>
      </Modal>

      {/* Printable Ticket Pass with QR Code */}
      {selectedTicketForPrint && (
        <Modal
          isOpen={!!selectedTicketForPrint}
          onClose={() => setSelectedTicketForPrint(null)}
          title="Printable Darshan Token"
          subtitle="Sanctum Entry Pass with Quick-Scan QR Code"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedTicketForPrint(null)}>
                Dismiss
              </Button>
              <Button
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => {
                  window.print();
                  setSelectedTicketForPrint(null);
                  addToast({
                    type: 'success',
                    title: 'Pass Printed',
                    message: `Darshan pass ${selectedTicketForPrint.ticketNumber} printed.`,
                  });
                }}
              >
                Print Pass
              </Button>
            </>
          }
        >
          <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl p-5 bg-white dark:bg-[#1E2621] space-y-4 text-center">
            <div className="text-xs font-black tracking-wider uppercase text-[#344E41] dark:text-[#88A695]">
              SHREE TEMPLE FOUNDATION
            </div>
            <div className="text-base font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
              {selectedTicketForPrint.ticketType}
            </div>

            {/* QR Mock Box */}
            <div className="w-36 h-36 mx-auto rounded-2xl bg-[#F3F6F3] dark:bg-[#181E1A] border-2 border-dashed border-[#344E41] p-3 flex flex-col items-center justify-center">
              <QrCode className="w-20 h-20 text-[#1F2722] dark:text-[#F0F5F1]" />
              <span className="font-mono text-[9px] font-bold text-[#68736C] mt-1">
                {selectedTicketForPrint.ticketNumber}
              </span>
            </div>

            <div className="bg-[#FAFBF9] dark:bg-[#161C18] p-3 rounded-xl border border-[#E4E9E4] dark:border-[#2C3830] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#68736C]">Devotee:</span>
                <strong className="text-[#1F2722] dark:text-[#F0F5F1]">
                  {selectedTicketForPrint.devoteeName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Devotees:</span>
                <strong className="text-[#1F2722] dark:text-[#F0F5F1]">
                  {selectedTicketForPrint.guestCount} Persons
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Time Slot:</span>
                <strong className="text-[#344E41] dark:text-emerald-400">
                  {selectedTicketForPrint.slotTime}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68736C]">Amount:</span>
                <strong className="text-[#1F2722] dark:text-[#F0F5F1]">
                  {selectedTicketForPrint.amount > 0
                    ? `₹${selectedTicketForPrint.amount}`
                    : 'Free Token'}
                </strong>
              </div>
            </div>

            <p className="text-[10px] text-[#68736C]">
              Please present this pass at Gate 02 Sanctum queue 10 minutes prior to slot time.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
