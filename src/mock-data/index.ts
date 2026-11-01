import {
  Member,
  Donation,
  Ticket,
  StockItem,
  StockMovement,
  DharamshalaRoom,
  RoomBooking,
  Voucher,
  MealBooking,
  UserProfile,
  AppNotification,
  AuditLog,
  PermissionSetting
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Ahmed',
    email: 'ahmed.manager@ttfms.org',
    role: 'Branch Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Main City Central Campus',
    phone: '+91 98201 54321',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Rajesh K. Sharma',
    email: 'r.sharma@ttfms.org',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branch: 'Headquarters & Trust Secretariat',
    phone: '+91 98110 98765',
    status: 'Active',
    lastActive: '12 mins ago'
  },
  {
    id: 'usr-3',
    name: 'Sunita Mehra',
    email: 'sunita.accounts@ttfms.org',
    role: 'Head Accountant',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branch: 'Main City Central Campus',
    phone: '+91 97234 11223',
    status: 'Active',
    lastActive: '45 mins ago'
  },
  {
    id: 'usr-4',
    name: 'Vikram Joshi',
    email: 'vikram.desk@ttfms.org',
    role: 'Cashier',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branch: 'Hilltop Shrine Counter',
    phone: '+91 94120 77889',
    status: 'Active',
    lastActive: '3 hours ago'
  },
  {
    id: 'usr-5',
    name: 'Govind Rao',
    email: 'govind.dharamshala@ttfms.org',
    role: 'Dharamshala Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    branch: 'Pilgrim Complex A',
    phone: '+91 99001 22334',
    status: 'Active',
    lastActive: '1 hour ago'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-101',
    memberCode: 'TR-LM-0842',
    fullName: 'Anand Vardhan Singhania',
    email: 'anand.singhania@indocorp.com',
    phone: '+91 98210 44551',
    membershipType: 'Life Member',
    status: 'Active',
    joinDate: '2019-04-12',
    expiryDate: '2049-04-12',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '42 Nariman Point, South Heritage Towers',
    bloodGroup: 'B+',
    familyMembersCount: 4,
    totalDonations: 2500000,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'mem-102',
    memberCode: 'TR-PT-0312',
    fullName: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@aims.org',
    phone: '+91 94441 22890',
    membershipType: 'Patron',
    status: 'Active',
    joinDate: '2021-08-19',
    expiryDate: '2031-08-19',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '18 Besant Avenue, Adyar',
    bloodGroup: 'O+',
    familyMembersCount: 3,
    totalDonations: 1200000,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'mem-103',
    memberCode: 'TR-DM-1120',
    fullName: 'Harish Bhai Patel',
    email: 'harish.patel@pateltextiles.in',
    phone: '+91 98980 11234',
    membershipType: 'Donor Member',
    status: 'Pending Renewal',
    joinDate: '2023-01-10',
    expiryDate: '2026-01-10',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: '77 Ashram Road, Near Riverfront',
    bloodGroup: 'A+',
    familyMembersCount: 5,
    totalDonations: 450000
  },
  {
    id: 'mem-104',
    memberCode: 'TR-AS-0915',
    fullName: 'Pooja Venkatesh Rao',
    email: 'pooja.rao@mindtree.com',
    phone: '+91 97412 88761',
    membershipType: 'Associate',
    status: 'Active',
    joinDate: '2024-03-01',
    expiryDate: '2027-03-01',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '104 Indiranagar 100ft Rd',
    bloodGroup: 'AB+',
    familyMembersCount: 2,
    totalDonations: 75000
  },
  {
    id: 'mem-105',
    memberCode: 'TR-VL-0210',
    fullName: 'Kishanlal Somani',
    email: 'kishan.somani@gmail.com',
    phone: '+91 94140 33219',
    membershipType: 'Volunteer',
    status: 'Active',
    joinDate: '2022-11-15',
    expiryDate: '2027-11-15',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: '12 Johari Bazar, Heritage Circle',
    bloodGroup: 'B-',
    familyMembersCount: 4,
    totalDonations: 25000
  },
  {
    id: 'mem-106',
    memberCode: 'TR-LM-0994',
    fullName: 'Kavita Chidambaram',
    email: 'kavita.c@gmail.com',
    phone: '+91 98402 77123',
    membershipType: 'Life Member',
    status: 'Active',
    joinDate: '2020-06-25',
    expiryDate: '2050-06-25',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: '55 Race Course Road',
    bloodGroup: 'O-',
    familyMembersCount: 3,
    totalDonations: 1850000
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-001',
    receiptNumber: 'RCP-2026-0891',
    donorName: 'Anand Vardhan Singhania',
    donorPhone: '+91 98210 44551',
    donorEmail: 'anand.singhania@indocorp.com',
    panNumber: 'AAACS1928K',
    amount: 150000,
    paymentMode: 'UPI/Online',
    fund: 'Annakshetra (Food Relief)',
    donationDate: '2026-11-01',
    is80GEligible: true,
    notes: 'Sponsorship for 1,000 pilgrims weekend bhojan',
    collectorName: 'Ahmed',
    branch: 'Main City Central Campus'
  },
  {
    id: 'don-002',
    receiptNumber: 'RCP-2026-0892',
    donorName: 'Smt. Gayatri Devi Agrawal',
    donorPhone: '+91 98101 22339',
    donorEmail: 'gayatridevi@agrawalgroups.com',
    panNumber: 'BKOPA8821M',
    amount: 51000,
    paymentMode: 'Cheque',
    fund: 'Temple Renovation',
    donationDate: '2026-11-01',
    is80GEligible: true,
    notes: 'Cheque #441092 drawn on HDFC Bank',
    collectorName: 'Vikram Joshi',
    branch: 'Hilltop Shrine Counter'
  },
  {
    id: 'don-003',
    receiptNumber: 'RCP-2026-0893',
    donorName: 'Rameshwar Lal Sharma',
    donorPhone: '+91 94141 55667',
    donorEmail: 'rameshwar.sharma@yahoo.co.in',
    panNumber: 'AFRPS9021Q',
    amount: 21000,
    paymentMode: 'Cash',
    fund: 'Gaushala (Cattle Care)',
    donationDate: '2026-10-31',
    is80GEligible: true,
    notes: 'Cow fodder and veterinary care monthly seva',
    collectorName: 'Vikram Joshi',
    branch: 'Main City Central Campus'
  },
  {
    id: 'don-004',
    receiptNumber: 'RCP-2026-0894',
    donorName: 'Global Seva Foundation USA',
    donorPhone: '+1 408 555 0192',
    donorEmail: 'grants@globalseva.org',
    amount: 500000,
    paymentMode: 'Bank Transfer',
    fund: 'Medical Assistance',
    donationDate: '2026-10-30',
    is80GEligible: false,
    notes: 'Foreign donor FCRA compliance clearing pending',
    collectorName: 'Sunita Mehra',
    branch: 'Headquarters & Trust Secretariat'
  },
  {
    id: 'don-005',
    receiptNumber: 'RCP-2026-0895',
    donorName: 'Bhavna K. Shah',
    donorPhone: '+91 98251 77332',
    donorEmail: 'bhavnashah@gmail.com',
    panNumber: 'CPXPS4419R',
    amount: 11000,
    paymentMode: 'UPI/Online',
    fund: 'Education & Scholarship',
    donationDate: '2026-10-29',
    is80GEligible: true,
    notes: 'School books and uniform fund',
    collectorName: 'Ahmed',
    branch: 'Main City Central Campus'
  },
  {
    id: 'don-006',
    receiptNumber: 'RCP-2026-0896',
    donorName: 'Mukesh Chandra Gupta',
    donorPhone: '+91 98390 12098',
    donorEmail: 'mukesh.gupta@tradex.com',
    panNumber: 'AEOPG3102N',
    amount: 100000,
    paymentMode: 'Bank Transfer',
    fund: 'General Trust Fund',
    donationDate: '2026-10-28',
    is80GEligible: true,
    collectorName: 'Sunita Mehra',
    branch: 'Main City Central Campus'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-201',
    ticketNumber: 'TKT-DAR-8841',
    devoteeName: 'Sanjay Kumar Verma',
    phone: '+91 99100 88221',
    ticketType: 'Special VIP Darshan',
    slotTime: '10:00 AM - 11:30 AM',
    date: '2026-11-01',
    guestCount: 3,
    amount: 750,
    status: 'Issued',
    counterId: 'Counter 02 (VIP)',
    qrCodeMock: 'QR-VIP-8841-SANJAY'
  },
  {
    id: 'tkt-202',
    ticketNumber: 'TKT-PUJ-1204',
    devoteeName: 'Muralidhar Hegde',
    phone: '+91 98450 66321',
    ticketType: 'Mahapuja / Abhishek',
    slotTime: '06:00 AM - 07:30 AM',
    date: '2026-11-01',
    guestCount: 2,
    amount: 2100,
    status: 'Used/Scanned',
    counterId: 'Puja Booking Desk 1',
    qrCodeMock: 'QR-PUJ-1204-HEGDE'
  },
  {
    id: 'tkt-203',
    ticketNumber: 'TKT-GEN-9901',
    devoteeName: 'Amit Saxena',
    phone: '+91 98290 11994',
    ticketType: 'General Darshan',
    slotTime: '12:00 PM - 02:00 PM',
    date: '2026-11-01',
    guestCount: 4,
    amount: 0,
    status: 'Issued',
    counterId: 'Free Pass Kiosk 4',
    qrCodeMock: 'QR-GEN-9901-AMIT'
  },
  {
    id: 'tkt-204',
    ticketNumber: 'TKT-ART-4091',
    devoteeName: 'Sunil & Sunita Roy',
    phone: '+91 98300 77124',
    ticketType: 'Aarti Pass',
    slotTime: '07:00 PM - 08:00 PM',
    date: '2026-11-01',
    guestCount: 2,
    amount: 500,
    status: 'Issued',
    counterId: 'Counter 01',
    qrCodeMock: 'QR-ART-4091-ROY'
  },
  {
    id: 'tkt-205',
    ticketNumber: 'TKT-VIP-8819',
    devoteeName: 'Rajdeep Sardesai',
    phone: '+91 98200 44109',
    ticketType: 'Special VIP Darshan',
    slotTime: '08:30 AM - 09:30 AM',
    date: '2026-11-01',
    guestCount: 1,
    amount: 250,
    status: 'Used/Scanned',
    counterId: 'Counter 02 (VIP)',
    qrCodeMock: 'QR-VIP-8819-RAJDEEP'
  }
];

export const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stk-01',
    itemCode: 'STK-SAM-01',
    itemName: 'Pure Cow Desi Ghee (Tin 15kg)',
    category: 'Puja Samagri',
    quantityOnHand: 42,
    unit: 'Tins',
    minThreshold: 15,
    unitPrice: 8400,
    location: 'Godown Bay A-1',
    lastUpdated: '2026-10-31'
  },
  {
    id: 'stk-02',
    itemCode: 'STK-SAM-02',
    itemName: 'Mysore Sandalwood Paste & Sticks',
    category: 'Puja Samagri',
    quantityOnHand: 8,
    unit: 'Kg',
    minThreshold: 10, // LOW STOCK ALERT
    unitPrice: 3200,
    location: 'Sanctum Storeroom',
    lastUpdated: '2026-10-29'
  },
  {
    id: 'stk-03',
    itemCode: 'STK-FOOD-11',
    itemName: 'Sona Masoori Rice (Bags 25kg)',
    category: 'Annakshetra Provisions',
    quantityOnHand: 180,
    unit: 'Bags',
    minThreshold: 40,
    unitPrice: 1450,
    location: 'Kitchen Central Grain Store',
    lastUpdated: '2026-11-01'
  },
  {
    id: 'stk-04',
    itemCode: 'STK-FOOD-12',
    itemName: 'Toor Dal Premium (50kg Bag)',
    category: 'Annakshetra Provisions',
    quantityOnHand: 14,
    unit: 'Bags',
    minThreshold: 20, // LOW STOCK ALERT
    unitPrice: 6200,
    location: 'Kitchen Central Grain Store',
    lastUpdated: '2026-10-28'
  },
  {
    id: 'stk-05',
    itemCode: 'STK-LIN-21',
    itemName: 'Cotton Bed Sheets (White Double)',
    category: 'Linen & Bedding',
    quantityOnHand: 450,
    unit: 'Units',
    minThreshold: 100,
    unitPrice: 420,
    location: 'Dharamshala Housekeeping Depot',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'stk-06',
    itemCode: 'STK-CLEAN-05',
    itemName: 'Herbal Floor Disinfectant (5L Canister)',
    category: 'Sanitation & Cleaning',
    quantityOnHand: 6,
    unit: 'Cans',
    minThreshold: 12, // LOW STOCK ALERT
    unitPrice: 550,
    location: 'Sanitation Cell',
    lastUpdated: '2026-10-30'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mvt-01',
    movementType: 'GRN (Receipt)',
    itemCode: 'STK-FOOD-11',
    itemName: 'Sona Masoori Rice (Bags 25kg)',
    quantity: 100,
    source: 'Kishan Traders Mandi',
    destination: 'Kitchen Central Grain Store',
    date: '2026-11-01',
    referenceNumber: 'GRN-2026-1102',
    authorizedBy: 'Ahmed'
  },
  {
    id: 'mvt-02',
    movementType: 'Issue',
    itemCode: 'STK-SAM-01',
    itemName: 'Pure Cow Desi Ghee (Tin 15kg)',
    quantity: 5,
    source: 'Godown Bay A-1',
    destination: 'Main Sanctum Aarti Dept',
    date: '2026-11-01',
    referenceNumber: 'ISS-2026-4401',
    authorizedBy: 'Vikram Joshi'
  }
];

export const INITIAL_ROOMS: DharamshalaRoom[] = [
  { id: 'rm-101', roomNumber: '101', block: 'Block A (Main)', floor: 1, roomType: 'Deluxe AC', status: 'Occupied', dailyTariff: 1500, maxCapacity: 3 },
  { id: 'rm-102', roomNumber: '102', block: 'Block A (Main)', floor: 1, roomType: 'Deluxe AC', status: 'Available', dailyTariff: 1500, maxCapacity: 3 },
  { id: 'rm-103', roomNumber: '103', block: 'Block A (Main)', floor: 1, roomType: 'Standard AC', status: 'Under Cleaning', dailyTariff: 1000, maxCapacity: 2 },
  { id: 'rm-104', roomNumber: '104', block: 'Block A (Main)', floor: 1, roomType: 'Standard Non-AC', status: 'Available', dailyTariff: 600, maxCapacity: 2 },
  { id: 'rm-201', roomNumber: '201', block: 'Block A (Main)', floor: 2, roomType: 'Family Suite', status: 'Occupied', dailyTariff: 2500, maxCapacity: 6 },
  { id: 'rm-202', roomNumber: '202', block: 'Block A (Main)', floor: 2, roomType: 'Deluxe AC', status: 'Available', dailyTariff: 1500, maxCapacity: 3 },
  { id: 'rm-203', roomNumber: '203', block: 'Block B (Annexe)', floor: 2, roomType: 'Standard Non-AC', status: 'Occupied', dailyTariff: 600, maxCapacity: 2 },
  { id: 'rm-301', roomNumber: '301', block: 'Block C (Pilgrim)', floor: 3, roomType: 'Dormitory Bed', status: 'Available', dailyTariff: 200, maxCapacity: 12 },
  { id: 'rm-302', roomNumber: '302', block: 'Block C (Pilgrim)', floor: 3, roomType: 'Dormitory Bed', status: 'Occupied', dailyTariff: 200, maxCapacity: 12 },
  { id: 'rm-401', roomNumber: '401', block: 'Tower Suite', floor: 4, roomType: 'Family Suite', status: 'Maintenance', dailyTariff: 2500, maxCapacity: 6 }
];

export const INITIAL_BOOKINGS: RoomBooking[] = [
  {
    id: 'bk-501',
    bookingRef: 'DHM-BK-9021',
    roomNumber: '101',
    guestName: 'Praveen Chand Mathur',
    phone: '+91 98290 44551',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-8921',
    guestCount: 3,
    checkInDate: '2026-10-31',
    checkOutDate: '2026-11-03',
    advancePaid: 3000,
    totalBill: 4500,
    paymentStatus: 'Advance Paid',
    status: 'Checked-In'
  },
  {
    id: 'bk-502',
    bookingRef: 'DHM-BK-9022',
    roomNumber: '201',
    guestName: 'Balram Murthy & Family',
    phone: '+91 94480 33211',
    idProofType: 'Passport',
    idProofNumber: 'Z8921094',
    guestCount: 5,
    checkInDate: '2026-10-30',
    checkOutDate: '2026-11-02',
    advancePaid: 7500,
    totalBill: 7500,
    paymentStatus: 'Paid',
    status: 'Checked-In'
  },
  {
    id: 'bk-503',
    bookingRef: 'DHM-BK-9023',
    roomNumber: '203',
    guestName: 'Shankar Das Bairagi',
    phone: '+91 94150 99823',
    idProofType: 'Voter ID',
    idProofNumber: 'UP/09/192/44120',
    guestCount: 2,
    checkInDate: '2026-11-01',
    checkOutDate: '2026-11-02',
    advancePaid: 600,
    totalBill: 600,
    paymentStatus: 'Paid',
    status: 'Checked-In'
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'vch-001',
    voucherNumber: 'PV-2026-1401',
    voucherType: 'Payment Voucher',
    debitAccount: 'Annakshetra Vegetable Supplies',
    creditAccount: 'Main Trust Bank Current A/c',
    amount: 48500,
    date: '2026-11-01',
    payeeOrPayer: 'Navrang Mandi Produce Mart',
    description: 'Weekly bulk delivery of green vegetables, potatoes, spices',
    status: 'Approved',
    approvedBy: 'Ahmed',
    department: 'Annakshetra & Bhojanalaya'
  },
  {
    id: 'vch-002',
    voucherNumber: 'PV-2026-1402',
    voucherType: 'Payment Voucher',
    debitAccount: 'Electricity & Solar Utility Repairs',
    creditAccount: 'Petty Cash Ledger',
    amount: 14200,
    date: '2026-10-31',
    payeeOrPayer: 'Apex Solar Technicians',
    description: 'Quarterly inverter battery service and terminal replacement',
    status: 'Disbursed',
    approvedBy: 'Ahmed',
    department: 'Estate & Infrastructure'
  },
  {
    id: 'vch-003',
    voucherNumber: 'RV-2026-0889',
    voucherType: 'Receipt Voucher',
    debitAccount: 'Bank Central Collection Account',
    creditAccount: 'Dharamshala Room Rent Head',
    amount: 84600,
    date: '2026-10-30',
    payeeOrPayer: 'Daily Reception Desk Remittance',
    description: 'Consolidated weekend check-in rentals deposit',
    status: 'Approved',
    approvedBy: 'Sunita Mehra',
    department: 'Dharamshala'
  },
  {
    id: 'vch-004',
    voucherNumber: 'JV-2026-0312',
    voucherType: 'Journal Voucher',
    debitAccount: 'Depreciation on Dharamshala Furniture',
    creditAccount: 'Accumulated Depreciation Reserve',
    amount: 25000,
    date: '2026-10-28',
    payeeOrPayer: 'Internal Audit Adjustment',
    description: 'Monthly statutory depreciation adjustment',
    status: 'Approved',
    approvedBy: 'Rajesh K. Sharma',
    department: 'Finance & Compliance'
  },
  {
    id: 'vch-005',
    voucherNumber: 'PV-2026-1403',
    voucherType: 'Payment Voucher',
    debitAccount: 'Gaushala Cattle Fodder',
    creditAccount: 'Main Trust Bank Current A/c',
    amount: 92000,
    date: '2026-11-01',
    payeeOrPayer: 'Shri Ram Agro Traders',
    description: '40 quintals dry wheat straw and green grass feed',
    status: 'Pending Approval',
    department: 'Gaushala'
  }
];

export const INITIAL_MEAL_BOOKINGS: MealBooking[] = [
  {
    id: 'meal-01',
    tokenNumber: 'ML-TKN-0421',
    devoteeName: 'Kameshwar Mishra & Group',
    phone: '+91 94120 44331',
    session: 'Lunch Bhojan',
    mealType: 'Standard Thali',
    servingsCount: 8,
    bookingDate: '2026-11-01',
    isComplimentary: false,
    totalAmount: 480, // nominal ₹60 per thali token
    status: 'Confirmed'
  },
  {
    id: 'meal-02',
    tokenNumber: 'ML-TKN-0422',
    devoteeName: 'Bhakti Sangam Yatri Mandal',
    phone: '+91 98200 99441',
    session: 'Lunch Bhojan',
    mealType: 'Special Feast (Utsav)',
    servingsCount: 25,
    bookingDate: '2026-11-01',
    isComplimentary: true,
    totalAmount: 0,
    status: 'Confirmed'
  },
  {
    id: 'meal-03',
    tokenNumber: 'ML-TKN-0423',
    devoteeName: 'Hitesh Jariwala',
    phone: '+91 98981 22345',
    session: 'Lunch Bhojan',
    mealType: 'Sattvic / Jain Diet',
    servingsCount: 4,
    bookingDate: '2026-11-01',
    isComplimentary: false,
    totalAmount: 240,
    status: 'Redeemed'
  },
  {
    id: 'meal-04',
    tokenNumber: 'ML-TKN-0424',
    devoteeName: 'Dipali Sengupta',
    phone: '+91 98310 11920',
    session: 'Dinner Prasad',
    mealType: 'Standard Thali',
    servingsCount: 3,
    bookingDate: '2026-11-01',
    isComplimentary: false,
    totalAmount: 180,
    status: 'Confirmed'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'High-Value Donation Received',
    message: '₹1,50,000 received from Anand Singhania via UPI for Annakshetra.',
    timestamp: '15 mins ago',
    read: false,
    type: 'success',
    linkTo: '/donations'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert Triggered',
    message: 'Mysore Sandalwood Paste is below the minimum threshold (8 Kg remaining).',
    timestamp: '1 hour ago',
    read: false,
    type: 'warning',
    linkTo: '/stock'
  },
  {
    id: 'notif-3',
    title: 'Room Check-in Pending Verification',
    message: 'Room 201 guest ID proof verified and checked-in by Front Desk.',
    timestamp: '3 hours ago',
    read: true,
    type: 'info',
    linkTo: '/dharamshala'
  },
  {
    id: 'notif-4',
    title: 'Voucher Approval Required',
    message: 'Payment Voucher PV-2026-1403 for ₹92,000 awaits Branch Manager approval.',
    timestamp: '4 hours ago',
    read: false,
    type: 'alert',
    linkTo: '/vouchers'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: '2026-11-01 17:42:10',
    user: 'Ahmed',
    role: 'Branch Manager',
    action: 'CREATE_DONATION',
    module: 'Donations',
    details: 'Issued receipt RCP-2026-0891 for ₹1,50,000 with 80G certificate',
    ipAddress: '192.168.1.42'
  },
  {
    id: 'aud-02',
    timestamp: '2026-11-01 16:15:00',
    user: 'Govind Rao',
    role: 'Dharamshala Manager',
    action: 'CHECKIN_GUEST',
    module: 'Dharamshala',
    details: 'Guest Praveen Chand Mathur assigned Room 101 with Aadhaar KYC',
    ipAddress: '192.168.1.18'
  },
  {
    id: 'aud-03',
    timestamp: '2026-11-01 15:30:22',
    user: 'Vikram Joshi',
    role: 'Cashier',
    action: 'ISSUE_TICKET',
    module: 'Tickets',
    details: 'Generated 3 VIP Darshan tickets (TKT-DAR-8841)',
    ipAddress: '192.168.1.15'
  },
  {
    id: 'aud-04',
    timestamp: '2026-11-01 14:02:19',
    user: 'Sunita Mehra',
    role: 'Head Accountant',
    action: 'APPROVE_VOUCHER',
    module: 'Vouchers',
    details: 'Approved PV-2026-1401 for Navrang Mandi Produce Mart (₹48,500)',
    ipAddress: '192.168.1.11'
  }
];

export const INITIAL_ROLE_PERMISSIONS: PermissionSetting[] = [
  { module: 'Overview / Dashboard', view: true, create: false, edit: false, delete: false, approve: false, export: true },
  { module: 'Members Directory', view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: 'Donations & 80G', view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: 'Tickets & Darshan', view: true, create: true, edit: true, delete: false, approve: false, export: true },
  { module: 'Stock & Inventory', view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: 'Dharamshala & Rooms', view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: 'Vouchers & Accounts', view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: 'Reports & Audits', view: true, create: false, edit: false, delete: false, approve: false, export: true },
  { module: 'Meal Bookings', view: true, create: true, edit: true, delete: false, approve: false, export: true },
  { module: 'Users & Roles', view: true, create: true, edit: true, delete: true, approve: true, export: true },
  { module: 'Settings', view: true, create: true, edit: true, delete: false, approve: true, export: false }
];
