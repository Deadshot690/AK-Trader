import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  LayoutGrid,
  Users,
  HandHeart,
  Ticket as TicketIcon,
  Layers,
  Building2,
  Receipt,
  BarChart3,
  UtensilsCrossed,
  ShieldCheck,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  ChevronRight,
  User,
  LogOut,
  MapPin,
  Check
} from 'lucide-react';

interface SidebarProps {
  onQuickAction?: (actionKey: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onQuickAction,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    currentUser,
    currentBranch,
    setCurrentBranch,
    addToast
  } = useAppStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const branches = [
    'Main City Central Campus',
    'Hilltop Shrine Counter',
    'Pilgrim Complex A',
    'Headquarters & Trust Secretariat'
  ];

  const navItems = [
    {
      id: 'overview',
      name: 'Overview',
      path: '/',
      icon: LayoutGrid,
      hasQuickAction: false,
    },
    {
      id: 'members',
      name: 'Members',
      path: '/members',
      icon: Users,
      hasQuickAction: true,
      quickActionKey: 'new-member',
      quickActionTooltip: 'Register New Member',
    },
    {
      id: 'donations',
      name: 'Donations',
      path: '/donations',
      icon: HandHeart,
      hasQuickAction: true,
      quickActionKey: 'new-donation',
      quickActionTooltip: 'Record New Donation',
    },
    {
      id: 'tickets',
      name: 'Tickets',
      path: '/tickets',
      icon: TicketIcon,
      hasQuickAction: true,
      quickActionKey: 'new-ticket',
      quickActionTooltip: 'Issue Darshan Ticket',
    },
    {
      id: 'stock',
      name: 'Stock',
      path: '/stock',
      icon: Layers,
      hasQuickAction: true,
      quickActionKey: 'new-stock',
      quickActionTooltip: 'Add Stock Item / GRN',
    },
    {
      id: 'dharamshala',
      name: 'Dharamshala',
      path: '/dharamshala',
      icon: Building2,
      hasQuickAction: true,
      quickActionKey: 'new-room-booking',
      quickActionTooltip: 'Guest Check-In',
    },
    {
      id: 'vouchers',
      name: 'Vouchers',
      path: '/vouchers',
      icon: Receipt,
      hasQuickAction: true,
      quickActionKey: 'new-voucher',
      quickActionTooltip: 'Create Payment Voucher',
    },
    {
      id: 'reports',
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      hasQuickAction: true,
      quickActionKey: 'export-report',
      quickActionTooltip: 'Export Financial Report',
    },
    {
      id: 'meal-bookings',
      name: 'Meal Bookings',
      path: '/meal-bookings',
      icon: UtensilsCrossed,
      hasQuickAction: false,
    },
    {
      id: 'users-roles',
      name: 'Users & Roles',
      path: '/users-roles',
      icon: ShieldCheck,
      hasQuickAction: false,
    },
    {
      id: 'settings',
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      hasQuickAction: false,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-40 h-screen transition-all duration-300 ease-in-out shrink-0 flex flex-col justify-between py-5 px-3 select-none bg-[#F7F8F6] dark:bg-[#101412] border-r border-transparent md:border-[#E4E9E4]/60 dark:md:border-[#202923] ${
          isSidebarCollapsed ? 'w-[88px]' : 'w-64'
        } ${
          isMobileOpen
            ? 'translate-x-0 w-64 bg-white dark:bg-[#181E1A] shadow-2xl z-50'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand Header Pill */}
        <div className="space-y-4">
          <div
            className={`flex items-center justify-between rounded-2xl bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#27322A] p-2.5 shadow-2xs ${
              isSidebarCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
              onClick={() => navigate('/')}
            >
              {/* Concentric Circle Brand Icon from screenshot */}
              <div className="w-8 h-8 rounded-xl bg-[#F3F6F3] dark:bg-[#202A24] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-[#344E41] dark:text-[#E7EDE8]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>

              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-extrabold tracking-tight text-[#1F2722] dark:text-[#F0F5F1] leading-none">
                    TTFMS
                  </div>
                  <div className="text-[9px] font-bold tracking-widest text-[#68736C] dark:text-[#95A59A] mt-0.5 uppercase">
                    Foundation OS
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle button */}
            {!isSidebarCollapsed ? (
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-1 rounded-lg text-[#68736C] hover:text-[#1F2722] dark:hover:text-white hover:bg-[#F3F6F3] dark:hover:bg-[#202923] transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-1 rounded-lg text-[#68736C] hover:text-[#1F2722] dark:hover:text-white hover:bg-[#F3F6F3] dark:hover:bg-[#202923] transition-colors mt-2"
                title="Expand Sidebar"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Menu List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <div key={item.id} className="relative group">
                  <NavLink
                    to={item.path}
                    onClick={() => onMobileClose?.()}
                    className={({ isActive: linkActive }) =>
                      `flex items-center justify-between rounded-xl transition-all duration-150 py-2.5 text-sm font-medium ${
                        isSidebarCollapsed ? 'px-3 justify-center' : 'px-3.5'
                      } ${
                        linkActive || isActive
                          ? 'bg-[#1F2722] dark:bg-[#344E41] text-white shadow-xs'
                          : 'text-[#68736C] dark:text-[#95A59A] hover:bg-[#E7EDE8]/60 dark:hover:bg-[#1E2621] hover:text-[#1F2722] dark:hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0 stroke-[1.8]" />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && item.hasQuickAction && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (onQuickAction && item.quickActionKey) {
                            onQuickAction(item.quickActionKey);
                          } else {
                            navigate(item.path);
                          }
                        }}
                        className={`p-0.5 rounded-md transition-colors ${
                          isActive
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-[#68736C] hover:text-[#1F2722] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                        title={item.quickActionTooltip}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    )}
                  </NavLink>

                  {/* Tooltip for collapsed state */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2.5 py-1 rounded-md bg-[#1F2722] text-white text-xs whitespace-nowrap shadow-md z-50 pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section with Dropdown */}
        <div className="relative pt-3">
          {/* Profile Card */}
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center justify-between rounded-2xl bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#27322A] p-2.5 shadow-2xs hover:bg-[#FAFBF9] dark:hover:bg-[#202923] cursor-pointer transition-all ${
              isSidebarCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2E3B32] flex items-center justify-center shrink-0 overflow-hidden text-[#344E41] dark:text-[#E7EDE8]">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#68736C] dark:text-[#95A59A] truncate">
                    {currentUser.role}
                  </div>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <ChevronRight className="w-3.5 h-3.5 text-[#68736C] dark:text-[#95A59A] shrink-0" />
            )}
          </div>

          {/* Profile Flyout Menu */}
          {isProfileMenuOpen && (
            <div
              className={`absolute bottom-full mb-2 left-0 w-60 rounded-2xl bg-white dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] shadow-dropdown p-2 z-50 text-xs animate-in zoom-in-95 duration-150 ${
                isSidebarCollapsed ? 'left-3' : 'left-0'
              }`}
            >
              <div className="px-3 py-2 border-b border-[#E4E9E4] dark:border-[#2C3830] mb-1">
                <p className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-[#344E41] dark:text-[#88A695] font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{currentBranch}</span>
                </div>
              </div>

              {/* Branch Switcher Sub-menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#1F2722] dark:text-[#F0F5F1] hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#68736C]" />
                    Switch Branch
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#68736C]" />
                </button>

                {isBranchMenuOpen && (
                  <div className="mt-1 mb-1 pl-4 space-y-1">
                    {branches.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setCurrentBranch(b);
                          setIsBranchMenuOpen(false);
                          addToast({
                            type: 'info',
                            title: 'Branch Switched',
                            message: `Active branch changed to ${b}`,
                          });
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                          currentBranch === b
                            ? 'bg-[#E7EDE8] dark:bg-[#344E41] text-[#24372E] dark:text-white font-bold'
                            : 'text-[#68736C] dark:text-[#95A59A] hover:bg-[#F3F6F3] dark:hover:bg-[#202923]'
                        }`}
                      >
                        <span className="truncate">{b}</span>
                        {currentBranch === b && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#1F2722] dark:text-[#F0F5F1] hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#68736C]" />
                System Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  addToast({
                    type: 'info',
                    title: 'Demo Logout Action',
                    message: 'Authentication session cleared.',
                  });
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-t border-[#E4E9E4] dark:border-[#2C3830] mt-1 pt-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
