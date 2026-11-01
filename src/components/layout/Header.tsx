import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Palette,
  ChevronDown,
  Menu,
  Check,
  CheckCheck,
  X,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    members,
    donations,
    tickets,
    stock,
    rooms,
    vouchers
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map route to human readable header title
  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/members')) return 'Members Directory';
    if (path.startsWith('/donations')) return 'Donations & Receipts';
    if (path.startsWith('/tickets')) return 'Tickets & Darshan Passes';
    if (path.startsWith('/stock')) return 'Inventory & Stock Control';
    if (path.startsWith('/dharamshala')) return 'Dharamshala Management';
    if (path.startsWith('/vouchers')) return 'Financial Vouchers & Cash';
    if (path.startsWith('/reports')) return 'Reports & Analytics';
    if (path.startsWith('/meal-bookings')) return 'Meal & Prasad Bookings';
    if (path.startsWith('/users-roles')) return 'Users & Access Control';
    if (path.startsWith('/settings')) return 'Settings & Trust Configuration';
    return 'ERP Console';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Search results calculation
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return null;
    const q = searchQuery.toLowerCase();

    const matchedMembers = members
      .filter((m) => m.fullName.toLowerCase().includes(q) || m.phone.includes(q) || m.memberCode.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedDonations = donations
      .filter((d) => d.donorName.toLowerCase().includes(q) || d.receiptNumber.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedTickets = tickets
      .filter((t) => t.devoteeName.toLowerCase().includes(q) || t.ticketNumber.toLowerCase().includes(q))
      .slice(0, 2);

    const matchedStock = stock
      .filter((s) => s.itemName.toLowerCase().includes(q) || s.itemCode.toLowerCase().includes(q))
      .slice(0, 2);

    const matchedRooms = rooms
      .filter((r) => r.roomNumber.toLowerCase().includes(q) || r.roomType.toLowerCase().includes(q))
      .slice(0, 2);

    const matchedVouchers = vouchers
      .filter((v) => v.voucherNumber.toLowerCase().includes(q) || v.payeeOrPayer.toLowerCase().includes(q))
      .slice(0, 2);

    return {
      members: matchedMembers,
      donations: matchedDonations,
      tickets: matchedTickets,
      stock: matchedStock,
      rooms: matchedRooms,
      vouchers: matchedVouchers,
      total:
        matchedMembers.length +
        matchedDonations.length +
        matchedTickets.length +
        matchedStock.length +
        matchedRooms.length +
        matchedVouchers.length,
    };
  }, [searchQuery, members, donations, tickets, stock, rooms, vouchers]);

  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 shrink-0">
      {/* Left: Mobile hamburger + Prominent Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl border border-[#E4E9E4] dark:border-[#2C3830] bg-white dark:bg-[#181E1A] text-[#1F2722] dark:text-[#F0F5F1]"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F2722] dark:text-[#F0F5F1]">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Right Controls: Search + Notification + Theme Switcher + Avatar */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div ref={searchRef} className="relative">
          <div className="flex items-center bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#2C3830] rounded-full px-3.5 py-2 shadow-2xs hover:border-[#344E41]/40 focus-within:border-[#344E41] focus-within:ring-2 focus-within:ring-[#344E41]/20 transition-all w-48 sm:w-64 md:w-80">
            <Search className="w-4 h-4 text-[#68736C] dark:text-[#95A59A] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search..."
              className="w-full bg-transparent border-none text-xs md:text-sm text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C]/70 dark:placeholder-[#95A59A]/60 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#68736C] hover:text-[#1F2722] dark:hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isSearchOpen && searchResults && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] shadow-dropdown p-3 z-50 text-xs animate-in zoom-in-95 duration-150 max-h-[420px] overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A] border-b border-[#E4E9E4] dark:border-[#2C3830] mb-2 flex justify-between">
                <span>Search Matches</span>
                <span>{searchResults.total} Results</span>
              </div>

              {searchResults.total === 0 ? (
                <div className="py-6 text-center text-[#68736C] dark:text-[#95A59A]">
                  No matching records found for "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.members.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#344E41] dark:text-[#88A695] px-2 mb-1">
                        Members
                      </div>
                      {searchResults.members.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            navigate('/members');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                              {m.fullName}
                            </div>
                            <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                              {m.memberCode} • {m.membershipType}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-[#68736C]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.donations.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#344E41] dark:text-[#88A695] px-2 mb-1">
                        Donations
                      </div>
                      {searchResults.donations.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            navigate('/donations');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                              {d.donorName}
                            </div>
                            <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                              {d.receiptNumber} • ₹{d.amount.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-[#68736C]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.tickets.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#344E41] dark:text-[#88A695] px-2 mb-1">
                        Tickets & Darshan
                      </div>
                      {searchResults.tickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            navigate('/tickets');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                              {t.devoteeName}
                            </div>
                            <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                              {t.ticketNumber} • {t.ticketType}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-[#68736C]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.rooms.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#344E41] dark:text-[#88A695] px-2 mb-1">
                        Dharamshala Rooms
                      </div>
                      {searchResults.rooms.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            navigate('/dharamshala');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
                              Room {r.roomNumber} ({r.roomType})
                            </div>
                            <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                              {r.block} • Status: {r.status}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-[#68736C]" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell Icon */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-center text-[#1F2722] dark:text-[#F0F5F1] hover:bg-[#FAFBF9] dark:hover:bg-[#202923] shadow-2xs relative transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#181E1A]" />
            )}
          </button>

          {/* Notifications Flyout Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] shadow-dropdown p-3 z-50 text-xs animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#E4E9E4] dark:border-[#2C3830] pb-2 mb-2 px-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#1F2722] dark:text-[#F0F5F1]">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] px-1.5 py-0.2 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="flex items-center gap-1 text-[11px] text-[#344E41] dark:text-[#88A695] hover:underline font-semibold"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-[#68736C]">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkTo) navigate(n.linkTo);
                        setIsNotifOpen(false);
                      }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                        n.read
                          ? 'bg-transparent border-transparent text-[#68736C] dark:text-[#95A59A] hover:bg-[#F3F6F3] dark:hover:bg-[#242F28]'
                          : 'bg-[#FAFBF9] dark:bg-[#222C25] border-[#E4E9E4] dark:border-[#2C3830] text-[#1F2722] dark:text-[#F0F5F1]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{n.title}</span>
                        <span className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher Button */}
        <div ref={themeRef} className="relative">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#2C3830] flex items-center justify-center text-[#1F2722] dark:text-[#F0F5F1] hover:bg-[#FAFBF9] dark:hover:bg-[#202923] shadow-2xs transition-all"
            aria-label="Switch Theme"
            title={`Current theme: ${theme}`}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-600" />
            ) : theme === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : (
              <Palette className="w-4 h-4 text-[#344E41] dark:text-[#88A695]" />
            )}
          </button>

          {/* Theme Dropdown Menu */}
          {isThemeOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] shadow-dropdown p-1.5 z-50 text-xs animate-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-bold text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider">
                Select Theme
              </div>
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  theme === 'light'
                    ? 'bg-[#F3F6F3] dark:bg-[#242F28] font-bold text-[#1F2722]'
                    : 'text-[#68736C] hover:bg-[#FAFBF9] dark:hover:bg-[#242F28]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Theme</span>
                </div>
                {theme === 'light' && <Check className="w-3.5 h-3.5 text-[#344E41]" />}
              </button>

              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#242F28] font-bold text-white'
                    : 'text-[#68736C] dark:text-[#95A59A] hover:bg-[#FAFBF9] dark:hover:bg-[#242F28]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Dark Theme</span>
                </div>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 text-sky-400" />}
              </button>

              <button
                onClick={() => {
                  setTheme('brand');
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  theme === 'brand'
                    ? 'bg-[#E7EDE8] font-bold text-[#1F2722]'
                    : 'text-[#68736C] hover:bg-[#FAFBF9] dark:hover:bg-[#242F28]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#344E41]" />
                  <span>Brand Theme</span>
                </div>
                {theme === 'brand' && <Check className="w-3.5 h-3.5 text-[#344E41]" />}
              </button>
            </div>
          )}
        </div>

        {/* User Avatar with Chevron */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-1 p-1 rounded-full bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#2C3830] hover:bg-[#FAFBF9] dark:hover:bg-[#202923] shadow-2xs transition-all"
            aria-label="User Profile Dropdown"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#E7EDE8] dark:bg-[#202A24] border border-[#D5E0D7] dark:border-[#2E3B32]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#68736C] dark:text-[#95A59A] pr-1" />
          </button>

          {/* Quick Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830] shadow-dropdown p-2 z-50 text-xs animate-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <p className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#68736C] dark:text-[#95A59A]">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={() => {
                  navigate('/settings');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-[#1F2722] dark:text-[#F0F5F1] hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] mt-1 transition-colors"
              >
                Profile & Settings
              </button>
              <button
                onClick={() => {
                  navigate('/users-roles');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-[#1F2722] dark:text-[#F0F5F1] hover:bg-[#F3F6F3] dark:hover:bg-[#242F28] transition-colors"
              >
                Access Control & Roles
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
