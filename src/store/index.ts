import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ThemeMode,
  UserProfile,
  Member,
  Donation,
  Ticket,
  StockItem,
  StockMovement,
  DharamshalaRoom,
  RoomBooking,
  Voucher,
  MealBooking,
  AppNotification,
  AuditLog,
  PermissionSetting
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MEMBERS,
  INITIAL_DONATIONS,
  INITIAL_TICKETS,
  INITIAL_STOCK,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_VOUCHERS,
  INITIAL_MEAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ROLE_PERMISSIONS
} from '../mock-data';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface AppState {
  // Theme & Layout
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Current session
  currentUser: UserProfile;
  currentBranch: string;
  setCurrentBranch: (branch: string) => void;
  
  // Toast notifications
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // In-app notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  
  // Global search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>) => void;

  // Permissions
  rolePermissions: PermissionSetting[];
  updatePermission: (module: string, key: keyof Omit<PermissionSetting, 'module'>, val: boolean) => void;

  // Module Data: Members
  members: Member[];
  addMember: (m: Omit<Member, 'id' | 'memberCode' | 'totalDonations'>) => void;
  updateMember: (id: string, m: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  // Module Data: Donations
  donations: Donation[];
  addDonation: (d: Omit<Donation, 'id' | 'receiptNumber'>) => string;
  deleteDonation: (id: string) => void;

  // Module Data: Tickets
  tickets: Ticket[];
  issueTicket: (t: Omit<Ticket, 'id' | 'ticketNumber' | 'status' | 'qrCodeMock'>) => string;
  scanTicket: (ticketNumber: string) => boolean;
  cancelTicket: (id: string) => void;

  // Module Data: Stock
  stock: StockItem[];
  stockMovements: StockMovement[];
  addStockItem: (item: Omit<StockItem, 'id' | 'itemCode' | 'lastUpdated'>) => void;
  updateStockQuantity: (id: string, delta: number) => void;
  addStockMovement: (m: Omit<StockMovement, 'id' | 'date'>) => void;

  // Module Data: Dharamshala
  rooms: DharamshalaRoom[];
  bookings: RoomBooking[];
  updateRoomStatus: (id: string, status: DharamshalaRoom['status']) => void;
  addBooking: (b: Omit<RoomBooking, 'id' | 'bookingRef'>) => string;
  checkoutBooking: (bookingId: string) => void;

  // Module Data: Vouchers
  vouchers: Voucher[];
  addVoucher: (v: Omit<Voucher, 'id' | 'voucherNumber'>) => string;
  approveVoucher: (id: string) => void;
  rejectVoucher: (id: string) => void;

  // Module Data: Meal Bookings
  mealBookings: MealBooking[];
  addMealBooking: (b: Omit<MealBooking, 'id' | 'tokenNumber' | 'status'>) => string;
  redeemMealToken: (tokenNumber: string) => boolean;

  // Users
  users: UserProfile[];
  addUser: (u: Omit<UserProfile, 'id' | 'lastActive'>) => void;
  updateUser: (id: string, u: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme & Layout
      theme: 'light',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      // Current session
      currentUser: INITIAL_USERS[0],
      currentBranch: 'Main City Central Campus',
      setCurrentBranch: (branch) => set({ currentBranch: branch }),

      // Toast notifications
      toasts: [],
      addToast: (toast) => {
        const id = 'toast-' + Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      // In-app notifications
      notifications: INITIAL_NOTIFICATIONS,
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // Global search
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Audit logs
      auditLogs: INITIAL_AUDIT_LOGS,
      addAuditLog: (log) => {
        const newLog: AuditLog = {
          ...log,
          id: 'aud-' + Date.now().toString(36),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ipAddress: '192.168.1.42',
        };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
      },

      // Permissions
      rolePermissions: INITIAL_ROLE_PERMISSIONS,
      updatePermission: (module, key, val) =>
        set((state) => ({
          rolePermissions: state.rolePermissions.map((rp) =>
            rp.module === module ? { ...rp, [key]: val } : rp
          ),
        })),

      // Members
      members: INITIAL_MEMBERS,
      addMember: (m) => {
        const count = get().members.length + 1;
        const prefix = m.membershipType === 'Life Member' ? 'LM' : m.membershipType === 'Patron' ? 'PT' : 'MB';
        const memberCode = `TR-${prefix}-${String(count).padStart(4, '0')}`;
        const newMember: Member = {
          ...m,
          id: 'mem-' + Date.now(),
          memberCode,
          totalDonations: 0,
        };
        set((state) => ({ members: [newMember, ...state.members] }));
        get().addAuditLog({
          user: get().currentUser.name,
          role: get().currentUser.role,
          action: 'REGISTER_MEMBER',
          module: 'Members',
          details: `Registered ${newMember.fullName} (${memberCode})`,
        });
        get().addToast({
          type: 'success',
          title: 'Member Registered',
          message: `${newMember.fullName} enrolled successfully with code ${memberCode}.`,
        });
      },
      updateMember: (id, partial) => {
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...partial } : m)),
        }));
        get().addToast({
          type: 'info',
          title: 'Member Profile Updated',
          message: 'Changes saved successfully.',
        });
      },
      deleteMember: (id) => {
        const found = get().members.find((m) => m.id === id);
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }));
        get().addToast({
          type: 'warning',
          title: 'Member Removed',
          message: `${found?.fullName || 'Member'} record has been deleted.`,
        });
      },

      // Donations
      donations: INITIAL_DONATIONS,
      addDonation: (d) => {
        const count = get().donations.length + 897;
        const receiptNumber = `RCP-2026-${String(count).padStart(4, '0')}`;
        const newDonation: Donation = {
          ...d,
          id: 'don-' + Date.now(),
          receiptNumber,
        };
        set((state) => ({ donations: [newDonation, ...state.donations] }));
        get().addAuditLog({
          user: get().currentUser.name,
          role: get().currentUser.role,
          action: 'RECEIVE_DONATION',
          module: 'Donations',
          details: `Issued receipt ${receiptNumber} for ₹${d.amount.toLocaleString('en-IN')} to ${d.donorName}`,
        });
        get().addToast({
          type: 'success',
          title: 'Donation Recorded',
          message: `Receipt ${receiptNumber} generated for ₹${d.amount.toLocaleString('en-IN')}.`,
        });
        return receiptNumber;
      },
      deleteDonation: (id) =>
        set((state) => ({ donations: state.donations.filter((d) => d.id !== id) })),

      // Tickets
      tickets: INITIAL_TICKETS,
      issueTicket: (t) => {
        const count = get().tickets.length + 1001;
        const prefix = t.ticketType.includes('VIP') ? 'VIP' : t.ticketType.includes('Puja') ? 'PUJ' : 'DAR';
        const ticketNumber = `TKT-${prefix}-${count}`;
        const newTicket: Ticket = {
          ...t,
          id: 'tkt-' + Date.now(),
          ticketNumber,
          status: 'Issued',
          qrCodeMock: `QR-${ticketNumber}-${t.devoteeName.toUpperCase().replace(/\s+/g, '_')}`,
        };
        set((state) => ({ tickets: [newTicket, ...state.tickets] }));
        get().addAuditLog({
          user: get().currentUser.name,
          role: get().currentUser.role,
          action: 'ISSUE_TICKET',
          module: 'Tickets',
          details: `Issued pass ${ticketNumber} for ${t.devoteeName} (${t.guestCount} guests)`,
        });
        get().addToast({
          type: 'success',
          title: 'Darshan Pass Issued',
          message: `Token ${ticketNumber} generated successfully.`,
        });
        return ticketNumber;
      },
      scanTicket: (ticketNumber) => {
        const ticket = get().tickets.find((t) => t.ticketNumber === ticketNumber);
        if (!ticket) {
          get().addToast({
            type: 'error',
            title: 'Scan Failed',
            message: `Ticket ${ticketNumber} not found in database.`,
          });
          return false;
        }
        if (ticket.status === 'Used/Scanned') {
          get().addToast({
            type: 'warning',
            title: 'Already Redeemed',
            message: `Ticket ${ticketNumber} was already scanned earlier.`,
          });
          return false;
        }
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.ticketNumber === ticketNumber ? { ...t, status: 'Used/Scanned' } : t
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Entry Verified',
          message: `Pass for ${ticket.devoteeName} verified and entry granted.`,
        });
        return true;
      },
      cancelTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? { ...t, status: 'Cancelled' } : t)),
        }));
        get().addToast({
          type: 'info',
          title: 'Ticket Cancelled',
          message: 'The ticket has been marked cancelled.',
        });
      },

      // Stock
      stock: INITIAL_STOCK,
      stockMovements: INITIAL_STOCK_MOVEMENTS,
      addStockItem: (item) => {
        const count = get().stock.length + 1;
        const itemCode = `STK-GEN-${String(count).padStart(2, '0')}`;
        const newItem: StockItem = {
          ...item,
          id: 'stk-' + Date.now(),
          itemCode,
          lastUpdated: new Date().toISOString().substring(0, 10),
        };
        set((state) => ({ stock: [newItem, ...state.stock] }));
        get().addToast({
          type: 'success',
          title: 'Stock Item Added',
          message: `${newItem.itemName} registered under ${newItem.category}.`,
        });
      },
      updateStockQuantity: (id, delta) => {
        set((state) => ({
          stock: state.stock.map((item) => {
            if (item.id === id) {
              const updatedQty = Math.max(0, item.quantityOnHand + delta);
              return {
                ...item,
                quantityOnHand: updatedQty,
                lastUpdated: new Date().toISOString().substring(0, 10),
              };
            }
            return item;
          }),
        }));
      },
      addStockMovement: (m) => {
        const count = get().stockMovements.length + 1103;
        const ref = m.movementType.includes('GRN') ? `GRN-2026-${count}` : `ISS-2026-${count}`;
        const newMvt: StockMovement = {
          ...m,
          id: 'mvt-' + Date.now(),
          referenceNumber: ref,
          date: new Date().toISOString().substring(0, 10),
        };
        set((state) => ({ stockMovements: [newMvt, ...state.stockMovements] }));
        // Also adjust stock quantity accordingly
        const stockItem = get().stock.find((s) => s.itemCode === m.itemCode);
        if (stockItem) {
          const delta = m.movementType.includes('GRN') ? m.quantity : -m.quantity;
          get().updateStockQuantity(stockItem.id, delta);
        }
        get().addToast({
          type: 'success',
          title: 'Movement Recorded',
          message: `${m.movementType} ${ref} logged for ${m.quantity} ${m.itemName}.`,
        });
      },

      // Dharamshala
      rooms: INITIAL_ROOMS,
      bookings: INITIAL_BOOKINGS,
      updateRoomStatus: (id, status) => {
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
        get().addToast({
          type: 'info',
          title: 'Room Status Changed',
          message: `Room status updated to ${status}.`,
        });
      },
      addBooking: (b) => {
        const count = get().bookings.length + 9024;
        const bookingRef = `DHM-BK-${count}`;
        const newBooking: RoomBooking = {
          ...b,
          id: 'bk-' + Date.now(),
          bookingRef,
        };
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          rooms: state.rooms.map((r) =>
            r.roomNumber === b.roomNumber ? { ...r, status: 'Occupied' } : r
          ),
        }));
        get().addAuditLog({
          user: get().currentUser.name,
          role: get().currentUser.role,
          action: 'CHECKIN_GUEST',
          module: 'Dharamshala',
          details: `Checked-in ${b.guestName} to Room ${b.roomNumber} (${bookingRef})`,
        });
        get().addToast({
          type: 'success',
          title: 'Guest Checked In',
          message: `${b.guestName} allocated Room ${b.roomNumber}. Booking ref: ${bookingRef}`,
        });
        return bookingRef;
      },
      checkoutBooking: (bookingId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return;
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'Checked-Out', paymentStatus: 'Paid' } : b
          ),
          rooms: state.rooms.map((r) =>
            r.roomNumber === booking.roomNumber ? { ...r, status: 'Under Cleaning' } : r
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Guest Checked Out',
          message: `Room ${booking.roomNumber} is now marked Under Cleaning.`,
        });
      },

      // Vouchers
      vouchers: INITIAL_VOUCHERS,
      addVoucher: (v) => {
        const count = get().vouchers.length + 1404;
        const prefix = v.voucherType.includes('Payment')
          ? 'PV'
          : v.voucherType.includes('Receipt')
          ? 'RV'
          : 'JV';
        const voucherNumber = `${prefix}-2026-${count}`;
        const newVoucher: Voucher = {
          ...v,
          id: 'vch-' + Date.now(),
          voucherNumber,
        };
        set((state) => ({ vouchers: [newVoucher, ...state.vouchers] }));
        get().addToast({
          type: 'success',
          title: 'Voucher Created',
          message: `${voucherNumber} drafted for ₹${v.amount.toLocaleString('en-IN')}.`,
        });
        return voucherNumber;
      },
      approveVoucher: (id) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, status: 'Approved', approvedBy: get().currentUser.name } : v
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Voucher Approved',
          message: 'Voucher marked approved for payment release.',
        });
      },
      rejectVoucher: (id) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, status: 'Rejected' } : v
          ),
        }));
        get().addToast({
          type: 'warning',
          title: 'Voucher Rejected',
          message: 'Voucher status updated to Rejected.',
        });
      },

      // Meal Bookings
      mealBookings: INITIAL_MEAL_BOOKINGS,
      addMealBooking: (b) => {
        const count = get().mealBookings.length + 425;
        const tokenNumber = `ML-TKN-${String(count).padStart(4, '0')}`;
        const newBooking: MealBooking = {
          ...b,
          id: 'meal-' + Date.now(),
          tokenNumber,
          status: 'Confirmed',
        };
        set((state) => ({ mealBookings: [newBooking, ...state.mealBookings] }));
        get().addToast({
          type: 'success',
          title: 'Meal Token Issued',
          message: `Token ${tokenNumber} generated for ${b.servingsCount} persons (${b.session}).`,
        });
        return tokenNumber;
      },
      redeemMealToken: (tokenNumber) => {
        const token = get().mealBookings.find((m) => m.tokenNumber === tokenNumber);
        if (!token) {
          get().addToast({
            type: 'error',
            title: 'Invalid Token',
            message: `Token ${tokenNumber} does not exist.`,
          });
          return false;
        }
        if (token.status === 'Redeemed') {
          get().addToast({
            type: 'warning',
            title: 'Already Redeemed',
            message: `Token ${tokenNumber} has already been availed.`,
          });
          return false;
        }
        set((state) => ({
          mealBookings: state.mealBookings.map((m) =>
            m.tokenNumber === tokenNumber ? { ...m, status: 'Redeemed' } : m
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Meal Token Redeemed',
          message: `Token for ${token.servingsCount} servings marked as served.`,
        });
        return true;
      },

      // Users
      users: INITIAL_USERS,
      addUser: (u) => {
        const newUser: UserProfile = {
          ...u,
          id: 'usr-' + Date.now(),
          lastActive: 'Never',
        };
        set((state) => ({ users: [...state.users, newUser] }));
        get().addToast({
          type: 'success',
          title: 'User Created',
          message: `User account for ${u.name} has been provisioned.`,
        });
      },
      updateUser: (id, partial) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...partial } : u)),
        }));
        get().addToast({
          type: 'info',
          title: 'User Updated',
          message: 'Account details modified successfully.',
        });
      },
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
        get().addToast({
          type: 'warning',
          title: 'User Deactivated',
          message: 'User removed from active roles.',
        });
      },
    }),
    {
      name: 'ttfms_erp_store_v1',
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
        currentBranch: state.currentBranch,
        members: state.members,
        donations: state.donations,
        tickets: state.tickets,
        stock: state.stock,
        rooms: state.rooms,
        bookings: state.bookings,
        vouchers: state.vouchers,
        mealBookings: state.mealBookings,
        users: state.users,
        rolePermissions: state.rolePermissions,
      }),
    }
  )
);
