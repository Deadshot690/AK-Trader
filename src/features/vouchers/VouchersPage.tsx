import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Voucher, VoucherType, VoucherStatus } from '../../types';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Download,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';

export const VouchersPage: React.FC = () => {
  const { vouchers, addVoucher, approveVoucher, rejectVoucher, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [voucherType, setVoucherType] = useState<VoucherType>('Payment Voucher');
  const [debitAccount, setDebitAccount] = useState('Annakshetra Vegetable Supplies');
  const [creditAccount, setCreditAccount] = useState('Main Trust Bank Current A/c');
  const [amount, setAmount] = useState('15000');
  const [payeeOrPayer, setPayeeOrPayer] = useState('');
  const [department, setDepartment] = useState('Annakshetra & Bhojanalaya');
  const [description, setDescription] = useState('');

  // Computed metrics
  const totalDisbursed = vouchers
    .filter((v) => v.voucherType === 'Payment Voucher' && (v.status === 'Approved' || v.status === 'Disbursed'))
    .reduce((sum, v) => sum + v.amount, 0);

  const pendingApprovalCount = vouchers.filter((v) => v.status === 'Pending Approval').length;
  const totalVouchersCount = vouchers.length;

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchSearch =
        v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.payeeOrPayer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === 'All' || v.voucherType === typeFilter;
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [vouchers, searchQuery, typeFilter, statusFilter]);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeOrPayer.trim() || !amount) return;

    addVoucher({
      voucherType,
      debitAccount,
      creditAccount,
      amount: Number(amount) || 0,
      date: new Date().toISOString().substring(0, 10),
      payeeOrPayer,
      description,
      status: 'Pending Approval',
      department,
    });

    setIsAddModalOpen(false);
    setPayeeOrPayer('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Financial Vouchers & Disbursements
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Double-entry bookkeeping journal, petty cash reconciliation, and two-step trustee authorization.
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
                title: 'Ledger Exported',
                message: 'Voucher journal book exported to Excel.',
              });
            }}
          >
            Export Ledger
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Create Voucher
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Total Disbursed MTD
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Awaiting Approval
          </span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {pendingApprovalCount} Vouchers
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Vouchers Logged
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            {totalVouchersCount} Entries
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Petty Cash Balance
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            ₹35,800
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
              placeholder="Search voucher #, payee, department, details..."
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
            <option value="Payment Voucher">Payment Voucher</option>
            <option value="Receipt Voucher">Receipt Voucher</option>
            <option value="Journal Voucher">Journal Voucher</option>
            <option value="Contra Voucher">Contra Voucher</option>
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
            <option value="Approved">Approved</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Disbursed">Disbursed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Vouchers Data Table */}
      {filteredVouchers.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Vouchers Found"
          description="No entries match your search criteria. Draft a new payment or receipt voucher."
          actionLabel="Create Voucher"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Voucher #</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Payee / Beneficiary</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Debit / Credit Accounts</th>
                  <th className="py-3 px-4">Amount (₹)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {filteredVouchers.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {v.voucherNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                      {v.voucherType}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                        {v.payeeOrPayer}
                      </div>
                      <div className="text-[10px] text-[#68736C] dark:text-[#95A59A] truncate max-w-xs">
                        {v.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                      {v.department}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      <div className="text-rose-600 dark:text-rose-400">Dr: {v.debitAccount}</div>
                      <div className="text-emerald-600 dark:text-emerald-400">Cr: {v.creditAccount}</div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-[#1F2722] dark:text-[#F0F5F1]">
                      ₹{v.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                      {v.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={v.status} size="sm" />
                      {v.approvedBy && (
                        <div className="text-[9px] text-[#68736C] mt-0.5">
                          by {v.approvedBy}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {v.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveVoucher(v.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#344E41] hover:bg-[#283e34] rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectVoucher(v.id)}
                            className="p-1 text-[#68736C] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Reject Voucher"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#68736C]">Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Voucher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Financial Voucher"
        subtitle="Record general ledger expense, vendor disbursement, or bank contra"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateVoucher}>
              Draft Voucher for Approval
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateVoucher} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Voucher Classification"
              value={voucherType}
              onChange={(e) => setVoucherType(e.target.value as any)}
              options={[
                { value: 'Payment Voucher', label: 'Payment Voucher (Outflow)' },
                { value: 'Receipt Voucher', label: 'Receipt Voucher (Inflow)' },
                { value: 'Journal Voucher', label: 'Journal Voucher (Adjustment)' },
                { value: 'Contra Voucher', label: 'Contra Voucher (Bank/Cash Transfer)' },
              ]}
            />
            <Select
              label="Cost Center / Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Annakshetra & Bhojanalaya', label: 'Annakshetra & Bhojanalaya' },
                { value: 'Estate & Infrastructure', label: 'Estate & Infrastructure' },
                { value: 'Sanctum Puja Seva', label: 'Sanctum Puja Seva' },
                { value: 'Dharamshala Housekeeping', label: 'Dharamshala Housekeeping' },
                { value: 'Gaushala Cell', label: 'Gaushala Cell' },
                { value: 'Finance & Compliance', label: 'Finance & Compliance' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Payee / Vendor / Recipient"
              placeholder="e.g. Navrang Mandi Produce Mart"
              value={payeeOrPayer}
              onChange={(e) => setPayeeOrPayer(e.target.value)}
              required
            />
            <Input
              label="Voucher Amount (₹)"
              type="number"
              placeholder="15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Debit Account (Dr)"
              value={debitAccount}
              onChange={(e) => setDebitAccount(e.target.value)}
              required
            />
            <Input
              label="Credit Account (Cr)"
              value={creditAccount}
              onChange={(e) => setCreditAccount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Narration / Expense Justification"
            placeholder="Detailed purpose for auditors..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};
