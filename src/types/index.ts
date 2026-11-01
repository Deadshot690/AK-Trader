// ==========================================
// TTFMS - Enterprise ERP TypeScript Types
// ==========================================

export type ThemeMode = 'light' | 'dark' | 'brand';

export type UserRole = 
  | 'Super Admin'
  | 'Branch Manager'
  | 'Head Accountant'
  | 'Cashier'
  | 'Store Keeper'
  | 'Dharamshala Manager';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  branch: string;
  phone: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

// 1. Members
export type MembershipType = 'Life Member' | 'Patron' | 'Donor Member' | 'Associate' | 'Volunteer';
export type MemberStatus = 'Active' | 'Pending Renewal' | 'Inactive' | 'Suspended';

export interface Member {
  id: string;
  memberCode: string;
  fullName: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
  status: MemberStatus;
  joinDate: string;
  expiryDate: string;
  city: string;
  state: string;
  address: string;
  bloodGroup?: string;
  familyMembersCount: number;
  totalDonations: number;
  avatarUrl?: string;
}

// 2. Donations
export type PaymentMode = 'Cash' | 'UPI/Online' | 'Cheque' | 'Bank Transfer' | 'In-Kind';
export type DonationFund = 
  | 'Temple Renovation'
  | 'Annakshetra (Food Relief)'
  | 'Gaushala (Cattle Care)'
  | 'Education & Scholarship'
  | 'Medical Assistance'
  | 'General Trust Fund';

export interface Donation {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  panNumber?: string;
  amount: number;
  paymentMode: PaymentMode;
  fund: DonationFund;
  donationDate: string;
  is80GEligible: boolean;
  notes?: string;
  collectorName: string;
  branch: string;
}

// 3. Tickets (Darshan & Puja & Entry)
export type TicketType = 
  | 'General Darshan'
  | 'Special VIP Darshan'
  | 'Mahapuja / Abhishek'
  | 'Kalyanam Ritual'
  | 'Aarti Pass'
  | 'Vehicle Entry';

export type TicketStatus = 'Issued' | 'Used/Scanned' | 'Cancelled' | 'Expired';

export interface Ticket {
  id: string;
  ticketNumber: string;
  devoteeName: string;
  phone: string;
  ticketType: TicketType;
  slotTime: string;
  date: string;
  guestCount: number;
  amount: number;
  status: TicketStatus;
  counterId: string;
  qrCodeMock: string;
}

// 4. Stock / Inventory
export type StockCategory = 
  | 'Puja Samagri'
  | 'Annakshetra Provisions'
  | 'Linen & Bedding'
  | 'Sanitation & Cleaning'
  | 'Electrical & Hardware'
  | 'Office Stationery';

export interface StockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: StockCategory;
  quantityOnHand: number;
  unit: string;
  minThreshold: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  movementType: 'GRN (Receipt)' | 'Issue' | 'Transfer' | 'Adjustment';
  itemCode: string;
  itemName: string;
  quantity: number;
  source: string;
  destination: string;
  date: string;
  referenceNumber: string;
  authorizedBy: string;
}

// 5. Dharamshala
export type RoomType = 'Standard Non-AC' | 'Standard AC' | 'Deluxe AC' | 'Family Suite' | 'Dormitory Bed';
export type RoomStatus = 'Available' | 'Occupied' | 'Under Cleaning' | 'Maintenance';

export interface DharamshalaRoom {
  id: string;
  roomNumber: string;
  block: 'Block A (Main)' | 'Block B (Annexe)' | 'Block C (Pilgrim)' | 'Tower Suite';
  floor: number;
  roomType: RoomType;
  status: RoomStatus;
  dailyTariff: number;
  maxCapacity: number;
}

export interface RoomBooking {
  id: string;
  bookingRef: string;
  roomNumber: string;
  guestName: string;
  phone: string;
  idProofType: 'Aadhaar' | 'Passport' | 'Voter ID' | 'Driving License';
  idProofNumber: string;
  guestCount: number;
  checkInDate: string;
  checkOutDate: string;
  advancePaid: number;
  totalBill: number;
  paymentStatus: 'Paid' | 'Advance Paid' | 'Due';
  status: 'Checked-In' | 'Reserved' | 'Checked-Out' | 'Cancelled';
}

// 6. Vouchers
export type VoucherType = 'Payment Voucher' | 'Receipt Voucher' | 'Journal Voucher' | 'Contra Voucher';
export type VoucherStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Disbursed' | 'Rejected';

export interface Voucher {
  id: string;
  voucherNumber: string;
  voucherType: VoucherType;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  date: string;
  payeeOrPayer: string;
  description: string;
  status: VoucherStatus;
  approvedBy?: string;
  department: string;
}

// 7. Meal Bookings (Bhojanalaya / Annakshetra)
export type MealSession = 'Morning Prasad' | 'Lunch Bhojan' | 'Evening Tea & Snacks' | 'Dinner Prasad';
export type MealType = 'Standard Thali' | 'Special Feast (Utsav)' | 'Sattvic / Jain Diet' | 'Dietary Packet';

export interface MealBooking {
  id: string;
  tokenNumber: string;
  devoteeName: string;
  phone: string;
  session: MealSession;
  mealType: MealType;
  servingsCount: number;
  bookingDate: string;
  isComplimentary: boolean;
  totalAmount: number;
  status: 'Confirmed' | 'Redeemed' | 'Cancelled';
}

// 8. Notifications
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  linkTo?: string;
}

// 9. Audit Logs
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

// 10. Role Permission Matrix
export interface PermissionSetting {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}
