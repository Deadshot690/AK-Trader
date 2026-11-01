import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Donation, DonationFund, PaymentMode } from '../../types';
import {
  HandHeart,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Trash2,
  FileCheck2,
  Building,
  CreditCard,
  QrCode,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';

export const DonationsPage: React.FC = () => {
  const { donations, addDonation, deleteDonation, currentBranch, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [fundFilter, setFundFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [selectedDonationForReceipt, setSelectedDonationForReceipt] = useState<Donation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [amount, setAmount] = useState('5100');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI/Online');
  const [fund, setFund] = useState<DonationFund>('Annakshetra (Food Relief)');
  const [is80G, setIs80G] = useState(true);
  const [notes, setNotes] = useState('');

  // Computed metrics
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const total80GAmount = donations
    .filter((d) => d.is80GEligible)
    .reduce((sum, d) => sum + d.amount, 0);
  const onlineCount = donations.filter((d) => d.paymentMode === 'UPI/Online').length;

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchSearch =
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.panNumber && d.panNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.donorPhone.includes(searchQuery);

      const matchFund = fundFilter === 'All' || d.fund === fundFilter;
      const matchMode = modeFilter === 'All' || d.paymentMode === modeFilter;

      return matchSearch && matchFund && matchMode;
    });
  }, [donations, searchQuery, fundFilter, modeFilter]);

  const handleSaveDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !amount) return;

    const receiptNum = addDonation({
      donorName,
      donorPhone: donorPhone || '+91 98000 11223',
      donorEmail: donorEmail || 'donor@ttfms.org',
      panNumber: panNumber ? panNumber.toUpperCase() : undefined,
      amount: Number(amount),
      paymentMode,
      fund,
      donationDate: new Date().toISOString().substring(0, 10),
      is80GEligible: is80G,
      notes,
      collectorName: 'Ahmed',
      branch: currentBranch,
    });

    setIsAddModalOpen(false);
    // Automatically offer to view the generated receipt
    const created = donations.find((d) => d.receiptNumber === receiptNum) || {
      id: 'temp',
      receiptNumber: receiptNum,
      donorName,
      donorPhone: donorPhone || '+91 98000 11223',
      donorEmail: donorEmail || 'donor@ttfms.org',
      panNumber: panNumber ? panNumber.toUpperCase() : undefined,
      amount: Number(amount),
      paymentMode,
      fund,
      donationDate: new Date().toISOString().substring(0, 10),
      is80GEligible: is80G,
      notes,
      collectorName: 'Ahmed',
      branch: currentBranch,
    };
    setSelectedDonationForReceipt(created as Donation);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Donations & 80G Tax Certificates
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Audit register of charitable seva, automatic 80G receipt numbers, and donor pan records.
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
                title: 'Export Generated',
                message: 'Donations ledger exported to Excel/CSV format.',
              });
            }}
          >
            Export Register
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setDonorName('');
              setAmount('5100');
              setPanNumber('');
              setIsAddModalOpen(true);
            }}
          >
            Record Donation
          </Button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Total Collections
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            80G Exempt Receipts
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            ₹{total80GAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Total Receipts
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {donations.length} Issued
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Digital & UPI Share
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            {Math.round((onlineCount / (donations.length || 1)) * 100)}% Online
          </div>
        </div>
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
              placeholder="Search donor name, receipt #, PAN, phone..."
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
            <span className="font-semibold">Fund:</span>
          </div>
          <select
            value={fundFilter}
            onChange={(e) => setFundFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Funds</option>
            <option value="Annakshetra (Food Relief)">Annakshetra</option>
            <option value="Temple Renovation">Temple Renovation</option>
            <option value="Gaushala (Cattle Care)">Gaushala</option>
            <option value="Education & Scholarship">Education</option>
            <option value="Medical Assistance">Medical</option>
            <option value="General Trust Fund">General Fund</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-[#68736C] ml-2">
            <span className="font-semibold">Mode:</span>
          </div>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Modes</option>
            <option value="UPI/Online">UPI / Online</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="In-Kind">In-Kind</option>
          </select>
        </div>
      </div>

      {/* Donations Data Table */}
      {filteredDonations.length === 0 ? (
        <EmptyState
          icon={HandHeart}
          title="No Donations Found"
          description="No donation matches your search query or filters. Clear the search or record a new receipt."
          actionLabel="Record Donation"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Donor & PAN</th>
                  <th className="py-3 px-4">Allocated Seva Fund</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">80G Tax Status</th>
                  <th className="py-3 px-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {filteredDonations.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {d.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                        {d.donorName}
                      </div>
                      <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                        {d.panNumber ? (
                          <span className="font-mono text-[#344E41] dark:text-[#88A695] font-semibold">
                            PAN: {d.panNumber}
                          </span>
                        ) : (
                          'PAN Not Provided'
                        )}{' '}
                        • {d.donorPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1F2722] dark:text-[#F0F5F1] font-medium">
                      {d.fund}
                    </td>
                    <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                      {d.donationDate}
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-[#1F2722] dark:text-[#F0F5F1]">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E7EDE8] text-[#24372E] dark:bg-[#202A24] dark:text-[#E7EDE8]">
                        {d.paymentMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {d.is80GEligible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Eligible 80G
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#68736C]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Printer className="w-3 h-3" />}
                          onClick={() => setSelectedDonationForReceipt(d)}
                        >
                          Print 80G
                        </Button>
                        <button
                          onClick={() => deleteDonation(d.id)}
                          className="p-1.5 text-[#68736C] hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete Donation Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Donation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Seva Donation"
        subtitle="Generate authentic computerized 80G receipt with tax-exemption seal"
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveDonation}>
              Save & Print Official Receipt
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveDonation} className="space-y-4">
          <Input
            label="Donor Full Name"
            placeholder="e.g. Anand Vardhan Singhania"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Donation Amount (₹)"
              type="number"
              placeholder="5100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Select
              label="Payment Mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as any)}
              options={[
                { value: 'UPI/Online', label: 'UPI / Online Transfer' },
                { value: 'Cash', label: 'Cash (Cashier Counter)' },
                { value: 'Cheque', label: 'Cheque / Demand Draft' },
                { value: 'Bank Transfer', label: 'NEFT / RTGS' },
                { value: 'In-Kind', label: 'In-Kind Seva Goods' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Allocated Seva Fund"
              value={fund}
              onChange={(e) => setFund(e.target.value as any)}
              options={[
                { value: 'Annakshetra (Food Relief)', label: 'Annakshetra (Food Relief)' },
                { value: 'Temple Renovation', label: 'Temple Renovation' },
                { value: 'Gaushala (Cattle Care)', label: 'Gaushala (Cattle Care)' },
                { value: 'Education & Scholarship', label: 'Education & Scholarship' },
                { value: 'Medical Assistance', label: 'Medical Assistance' },
                { value: 'General Trust Fund', label: 'General Trust Fund' },
              ]}
            />
            <Input
              label="Donor PAN (Required for 80G Tax Exemption)"
              placeholder="e.g. ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Donor Contact Phone"
              placeholder="+91..."
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
            />
            <Input
              label="Donor Email Address"
              type="email"
              placeholder="donor@example.com"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is80G"
              checked={is80G}
              onChange={(e) => setIs80G(e.target.checked)}
              className="rounded text-[#344E41] focus:ring-[#344E41]"
            />
            <label htmlFor="is80G" className="text-xs font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
              Eligible for 50% Tax Exemption under Section 80G(5)(vi)
            </label>
          </div>

          <Input
            label="Notes / Special Seva Dedication"
            placeholder="e.g. In memory of Late Smt. Shanti Devi / On occasion of Birthday"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* Official 80G Receipt Printable View */}
      {selectedDonationForReceipt && (
        <Modal
          isOpen={!!selectedDonationForReceipt}
          onClose={() => setSelectedDonationForReceipt(null)}
          title="Official 80G Tax Exemption Certificate"
          subtitle="Registered Trust under Section 80G(5)(vi) of Income Tax Act 1961"
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
                    title: 'Certificate Dispatched',
                    message: `80G certificate dispatched for ${selectedDonationForReceipt.receiptNumber}`,
                  });
                }}
              >
                Print / Save PDF
              </Button>
            </>
          }
        >
          <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl p-6 bg-white dark:bg-[#1E2621] space-y-6 text-[#1F2722] dark:text-[#F0F5F1]">
            <div className="flex items-start justify-between border-b border-[#E4E9E4] dark:border-[#2C3830] pb-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#344E41] dark:text-[#88A695]">
                  SHREE TEMPLE & CHARITABLE TRUST FOUNDATION
                </h2>
                <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] mt-0.5">
                  Regd. Office: Main Campus, Heritage Gate, PIN: 400001
                </p>
                <p className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                  PAN: AAATS4910M | 80G Order: CIT/E/80G/2021-22/A-492
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
                  Collector: {selectedDonationForReceipt.collectorName} ({selectedDonationForReceipt.branch})
                </p>
              </div>
            </div>

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
