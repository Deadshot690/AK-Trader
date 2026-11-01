import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { UserProfile, UserRole } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Lock,
  Unlock,
  KeyRound,
  History,
  Check,
  X,
  Edit2,
  Trash2,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Tabs } from '../../components/common/Tabs';

export const UsersRolesPage: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    rolePermissions,
    updatePermission,
    auditLogs,
    addToast
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'audit'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Cashier');
  const [branch, setBranch] = useState('Main City Central Campus');
  const [phone, setPhone] = useState('');

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.branch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('Cashier');
    setBranch('Main City Central Campus');
    setPhone('');
    setIsAddUserModalOpen(true);
  };

  const handleOpenEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setBranch(u.branch);
    setPhone(u.phone);
    setIsAddUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, { name, email, role, branch, phone });
    } else {
      addUser({
        name,
        email,
        role,
        branch,
        phone,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }

    setIsAddUserModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Users, Roles & Security Access Control
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Role-based authorization (RBAC), multi-branch operator provisioning, and immutable audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={handleOpenAddModal}
          >
            Provision User
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Active Operators
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {users.length} Users
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Enterprise Roles
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            6 Levels
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Modules Governed
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {rolePermissions.length} Workflows
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Audit Events Logged
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {auditLogs.length} Events
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'users', label: 'User Accounts Directory', count: users.length },
          { id: 'matrix', label: 'Role Permissions Matrix' },
          { id: 'audit', label: 'Security Audit Log Trail', count: auditLogs.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: User Directory */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] max-w-md">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#68736C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search operators by name, role, email, branch..."
                className="w-full bg-transparent text-xs text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none"
              />
            </div>
          </div>

          <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                  <tr>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Designated Branch</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2E3B32] overflow-hidden shrink-0">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E7EDE8] text-[#24372E] dark:bg-[#202A24] dark:text-[#E7EDE8]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#1F2722] dark:text-[#F0F5F1] font-medium">
                        {u.branch}
                      </td>
                      <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                        {u.phone}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={u.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                        {u.lastActive}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-[#68736C] hover:text-[#1F2722] dark:hover:text-white rounded-lg hover:bg-[#F3F6F3] dark:hover:bg-[#202923]"
                            title="Edit Role/Branch"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {u.name !== 'Ahmed' && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 text-[#68736C] hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Deactivate Operator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* Tab 2: Role Permissions Matrix */}
      {activeTab === 'matrix' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="p-4 border-b border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#161C18] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                Role-Based Access Control (RBAC) Permissions Matrix
              </h3>
              <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
                Configure capability access policies across all 11 core ERP modules
              </p>
            </div>
            <span className="text-xs font-semibold text-[#344E41] dark:text-emerald-400">
              Auto-saved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Core Module</th>
                  <th className="py-3 px-4 text-center">View</th>
                  <th className="py-3 px-4 text-center">Create</th>
                  <th className="py-3 px-4 text-center">Edit</th>
                  <th className="py-3 px-4 text-center">Delete</th>
                  <th className="py-3 px-4 text-center">Approve</th>
                  <th className="py-3 px-4 text-center">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {rolePermissions.map((rp) => (
                  <tr
                    key={rp.module}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {rp.module}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={rp.view}
                        onChange={(e) => updatePermission(rp.module, 'view', e.target.checked)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={rp.create}
                        onChange={(e) => updatePermission(rp.module, 'create', e.target.checked)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={rp.edit}
                        onChange={(e) => updatePermission(rp.module, 'edit', e.target.checked)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={rp.delete}
                        onChange={(e) => updatePermission(rp.module, 'delete', e.target.checked)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={rp.approve}
                        onChange={(e) => updatePermission(rp.module, 'approve', e.target.checked)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={rp.export}
                        onChange={(e) => updatePermission(rp.module, 'export', e.target.checked)}
                        className="rounded text-[#344E41] focus:ring-[#344E41]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Log Trail */}
      {activeTab === 'audit' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="p-4 border-b border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#161C18]">
            <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
              Immutable Audit & Compliance Trail
            </h3>
            <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
              Cryptographically timestamped user actions, financial approvals, and record modifications
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator & Role</th>
                  <th className="py-3 px-4">Action Code</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-[#68736C] dark:text-[#95A59A]">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                        {log.user}
                      </div>
                      <div className="text-[10px] text-[#68736C]">{log.role}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-bold text-[#344E41] dark:text-[#88A695] bg-[#E7EDE8] dark:bg-[#202A24] px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                      {log.module}
                    </td>
                    <td className="py-3.5 px-4 text-[#1F2722] dark:text-[#F0F5F1]">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#68736C]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Provision Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title={editingUser ? `Edit Operator: ${editingUser.name}` : 'Provision New Operator Account'}
        subtitle="Assign role level, credentials, and branch access"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveUser}>
              {editingUser ? 'Save Changes' : 'Provision Account'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <Input
            label="Operator Full Name"
            placeholder="e.g. Vikram Joshi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Trust Email Address"
              type="email"
              placeholder="v.joshi@ttfms.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Mobile"
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Role Assignment"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              options={[
                { value: 'Branch Manager', label: 'Branch Manager' },
                { value: 'Super Admin', label: 'Super Admin' },
                { value: 'Head Accountant', label: 'Head Accountant' },
                { value: 'Cashier', label: 'Cashier (Front Desk)' },
                { value: 'Store Keeper', label: 'Store Keeper (Godown)' },
                { value: 'Dharamshala Manager', label: 'Dharamshala Manager' },
              ]}
            />
            <Select
              label="Branch Assignment"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              options={[
                { value: 'Main City Central Campus', label: 'Main City Central Campus' },
                { value: 'Hilltop Shrine Counter', label: 'Hilltop Shrine Counter' },
                { value: 'Pilgrim Complex A', label: 'Pilgrim Complex A' },
                { value: 'Headquarters & Trust Secretariat', label: 'Headquarters & Trust Secretariat' },
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
