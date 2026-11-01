import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Member, MembershipType, MemberStatus } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Edit2,
  IdCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  QrCode,
  CheckCircle2,
  X,
  CreditCard
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';

export const MembersPage: React.FC = () => {
  const { members, addMember, updateMember, deleteMember, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Modal & Drawer states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipType: 'Life Member' as MembershipType,
    status: 'Active' as MemberStatus,
    joinDate: new Date().toISOString().substring(0, 10),
    expiryDate: '2049-12-31',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '',
    bloodGroup: 'B+',
    familyMembersCount: 2,
  });

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.memberCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTier = tierFilter === 'All' || m.membershipType === tierFilter;
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;

      return matchSearch && matchTier && matchStatus;
    });
  }, [members, searchQuery, tierFilter, statusFilter]);

  // Bulk selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMemberIds(filteredMembers.map((m) => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    selectedMemberIds.forEach((id) => deleteMember(id));
    setSelectedMemberIds([]);
    addToast({
      type: 'warning',
      title: 'Bulk Delete Complete',
      message: `${selectedMemberIds.length} member records were deleted.`,
    });
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      membershipType: 'Life Member',
      status: 'Active',
      joinDate: new Date().toISOString().substring(0, 10),
      expiryDate: '2049-12-31',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '',
      bloodGroup: 'B+',
      familyMembersCount: 2,
    });
    setEditingMember(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      status: member.status,
      joinDate: member.joinDate,
      expiryDate: member.expiryDate,
      city: member.city,
      state: member.state,
      address: member.address,
      bloodGroup: member.bloodGroup || 'B+',
      familyMembersCount: member.familyMembersCount,
    });
    setIsAddModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingMember) {
      updateMember(editingMember.id, formData);
    } else {
      addMember(formData);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Trust Membership Directory
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Manage patrons, life members, digital identity smart cards, and renewal schedules.
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
                title: 'Export Started',
                message: 'Exporting member register as CSV...',
              });
            }}
          >
            Export Directory
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={openAddModal}
          >
            Register Member
          </Button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Total Members
          </span>
          <div className="text-lg font-extrabold text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {members.length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Life Patrons
          </span>
          <div className="text-lg font-extrabold text-[#344E41] dark:text-emerald-400 mt-0.5">
            {members.filter((m) => m.membershipType === 'Life Member').length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Active Standing
          </span>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {members.filter((m) => m.status === 'Active').length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Renewals Due
          </span>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
            {members.filter((m) => m.status === 'Pending Renewal').length}
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
              placeholder="Search by name, code, phone, city..."
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
            <span className="font-semibold">Tier:</span>
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
          >
            <option value="All">All Tiers</option>
            <option value="Life Member">Life Member</option>
            <option value="Patron">Patron</option>
            <option value="Donor Member">Donor Member</option>
            <option value="Associate">Associate</option>
            <option value="Volunteer">Volunteer</option>
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
            <option value="Active">Active</option>
            <option value="Pending Renewal">Pending Renewal</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedMemberIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2F3C33] text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold text-[#24372E] dark:text-[#E7EDE8]">
            <CheckCircle2 className="w-4 h-4 text-[#344E41]" />
            <span>{selectedMemberIds.length} members selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Members Data Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Members Found"
          description="No records match your query. Clear filters or add a new member."
          actionLabel="Add New Member"
          onAction={openAddModal}
        />
      ) : (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedMemberIds.length === filteredMembers.length &&
                        filteredMembers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded text-[#344E41] focus:ring-[#344E41]"
                    />
                  </th>
                  <th className="py-3 px-4">Member Info</th>
                  <th className="py-3 px-4">Membership Tier</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">City / Region</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total Seva</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(m.id)}
                        onChange={() => handleToggleSelect(m.id)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2E3B32] flex items-center justify-center font-bold text-xs text-[#344E41] dark:text-[#E7EDE8] overflow-hidden shrink-0">
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} alt={m.fullName} className="w-full h-full object-cover" />
                          ) : (
                            m.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                            {m.fullName}
                          </div>
                          <div className="font-mono text-[10px] text-[#68736C] dark:text-[#95A59A]">
                            {m.memberCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={m.membershipType} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-[#68736C] dark:text-[#95A59A]">
                      <div>{m.phone}</div>
                      <div className="text-[10px] truncate max-w-[140px]">{m.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#1F2722] dark:text-[#F0F5F1]">
                      {m.city}, {m.state}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={m.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#1F2722] dark:text-[#F0F5F1]">
                      ₹{m.totalDonations.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingMember(m)}
                          className="p-1.5 text-[#68736C] hover:text-[#344E41] dark:hover:text-emerald-400 hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] rounded-lg transition-colors"
                          title="View Digital ID Smart Card"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 text-[#68736C] hover:text-[#1F2722] dark:hover:text-white hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMember(m.id)}
                          className="p-1.5 text-[#68736C] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Member Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingMember ? `Edit Member: ${editingMember.fullName}` : 'Register New Member'}
        subtitle="Manage personal records, membership tier, and validity dates"
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveMember}>
              {editingMember ? 'Save Modifications' : 'Create Member Record'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rameshwar Lal Singhania"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Phone"
              placeholder="+91..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="member@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Membership Tier"
              value={formData.membershipType}
              onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as any })}
              options={[
                { value: 'Life Member', label: 'Life Member' },
                { value: 'Patron', label: 'Patron' },
                { value: 'Donor Member', label: 'Donor Member' },
                { value: 'Associate', label: 'Associate' },
                { value: 'Volunteer', label: 'Volunteer' },
              ]}
            />
            <Select
              label="Membership Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Pending Renewal', label: 'Pending Renewal' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Suspended', label: 'Suspended' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>

          <Input
            label="Residential Address"
            placeholder="Street address, building, apartment..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
              ]}
            />
            <Input
              label="Family Dependents Count"
              type="number"
              min="0"
              max="20"
              value={formData.familyMembersCount}
              onChange={(e) => setFormData({ ...formData, familyMembersCount: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>

      {/* Member Detail & Digital Smart Card Drawer */}
      {viewingMember && (
        <Drawer
          isOpen={!!viewingMember}
          onClose={() => setViewingMember(null)}
          title="Digital Member Profile & Smart Card"
          subtitle={`Member Code: ${viewingMember.memberCode}`}
          width="lg"
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewingMember(null)}
            >
              Close Drawer
            </Button>
          }
        >
          <div className="space-y-6">
            {/* Virtual Membership Smart Card */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#24372E] via-[#344E41] to-[#1B2922] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="text-[10px] tracking-widest uppercase font-bold text-[#A3B18A]">
                    TTFMS TRUST FOUNDATION
                  </div>
                  <div className="text-base font-extrabold tracking-tight mt-0.5">
                    Official Member Smart Card
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs text-white">
                  {viewingMember.membershipType}
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center font-bold text-xl text-white">
                  {viewingMember.avatarUrl ? (
                    <img
                      src={viewingMember.avatarUrl}
                      alt={viewingMember.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    viewingMember.fullName.charAt(0)
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold leading-snug">
                    {viewingMember.fullName}
                  </div>
                  <div className="font-mono text-xs text-[#E7EDE8]/80 mt-0.5">
                    {viewingMember.memberCode}
                  </div>
                  <div className="text-[11px] text-[#A3B18A] mt-0.5">
                    Blood Group: {viewingMember.bloodGroup || 'B+'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-[#E7EDE8]/80 relative z-10">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#A3B18A]">
                    Validity Thru
                  </span>
                  <span>{viewingMember.expiryDate}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                  <QrCode className="w-4 h-4 text-white" />
                  <span className="font-mono text-[10px]">VERIFIED-ID</span>
                </div>
              </div>
            </div>

            {/* Quick Member Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
                <span className="text-[10px] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider block">
                  Cumulative Seva Donations
                </span>
                <span className="text-base font-extrabold text-[#344E41] dark:text-emerald-400 mt-1 block">
                  ₹{viewingMember.totalDonations.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
                <span className="text-[10px] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider block">
                  Family Dependents
                </span>
                <span className="text-base font-extrabold text-[#1F2722] dark:text-[#F0F5F1] mt-1 block">
                  {viewingMember.familyMembersCount} Persons
                </span>
              </div>
            </div>

            {/* Contact Details List */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] space-y-3 text-xs">
              <h4 className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                Contact & Residential Record
              </h4>
              <div className="flex items-center gap-2.5 text-[#68736C] dark:text-[#95A59A]">
                <Phone className="w-4 h-4 text-[#344E41]" />
                <span className="text-[#1F2722] dark:text-[#F0F5F1]">{viewingMember.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#68736C] dark:text-[#95A59A]">
                <Mail className="w-4 h-4 text-[#344E41]" />
                <span className="text-[#1F2722] dark:text-[#F0F5F1]">{viewingMember.email}</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#68736C] dark:text-[#95A59A]">
                <MapPin className="w-4 h-4 text-[#344E41] shrink-0 mt-0.5" />
                <span className="text-[#1F2722] dark:text-[#F0F5F1]">
                  {viewingMember.address || 'Central Trust Region'}, {viewingMember.city}, {viewingMember.state}
                </span>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
