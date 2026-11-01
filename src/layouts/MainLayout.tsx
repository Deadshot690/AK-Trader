import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToastContainer } from '../components/common/ToastContainer';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { useAppStore } from '../store';
import { DonationFund, PaymentMode, MembershipType } from '../types';

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    addMember,
    addDonation,
    issueTicket,
    addStockItem,
    addBooking,
    addVoucher,
    rooms,
    currentBranch,
  } = useAppStore();

  // Quick Action Modal States
  // 1. Member
  const [memName, setMemName] = useState('');
  const [memPhone, setMemPhone] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memType, setMemType] = useState<MembershipType>('Life Member');
  const [memCity, setMemCity] = useState('');

  // 2. Donation
  const [donName, setDonName] = useState('');
  const [donPhone, setDonPhone] = useState('');
  const [donEmail, setDonEmail] = useState('');
  const [donPan, setDonPan] = useState('');
  const [donAmount, setDonAmount] = useState('5100');
  const [donMode, setDonMode] = useState<PaymentMode>('UPI/Online');
  const [donFund, setDonFund] = useState<DonationFund>('Annakshetra (Food Relief)');

  // 3. Ticket
  const [tktDevotee, setTktDevotee] = useState('');
  const [tktPhone, setTktPhone] = useState('');
  const [tktType, setTktType] = useState('Special VIP Darshan');
  const [tktGuests, setTktGuests] = useState('2');
  const [tktSlot, setTktSlot] = useState('10:00 AM - 11:30 AM');

  // 4. Stock
  const [stkName, setStkName] = useState('');
  const [stkCategory, setStkCategory] = useState('Puja Samagri');
  const [stkQty, setStkQty] = useState('25');
  const [stkUnit, setStkUnit] = useState('Kg');
  const [stkPrice, setStkPrice] = useState('500');

  // 5. Room Check-In
  const [rmGuest, setRmGuest] = useState('');
  const [rmPhone, setRmPhone] = useState('');
  const [rmNumber, setRmNumber] = useState(
    rooms.find((r) => r.status === 'Available')?.roomNumber || '102'
  );
  const [rmIdNumber, setRmIdNumber] = useState('');
  const [rmAdvance, setRmAdvance] = useState('1500');

  // 6. Voucher
  const [vchType, setVchType] = useState('Payment Voucher');
  const [vchPayee, setVchPayee] = useState('');
  const [vchAmount, setVchAmount] = useState('12000');
  const [vchDesc, setVchDesc] = useState('');
  const [vchDept, setVchDept] = useState('Annakshetra & Bhojanalaya');

  const handleQuickAction = (actionKey: string) => {
    setActiveModalKey(actionKey);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName.trim()) return;
    addMember({
      fullName: memName,
      phone: memPhone || '+91 98000 00000',
      email: memEmail || `${memName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      membershipType: memType,
      status: 'Active',
      joinDate: new Date().toISOString().substring(0, 10),
      expiryDate: '2049-12-31',
      city: memCity || 'Mumbai',
      state: 'Maharashtra',
      address: 'Central Trust Region',
      familyMembersCount: 2,
    });
    setMemName('');
    setMemPhone('');
    setActiveModalKey(null);
    navigate('/members');
  };

  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donName.trim() || !donAmount) return;
    addDonation({
      donorName: donName,
      donorPhone: donPhone || '+91 98111 22233',
      donorEmail: donEmail || 'donor@ttfms.org',
      panNumber: donPan || 'AAACS0000K',
      amount: Number(donAmount),
      paymentMode: donMode,
      fund: donFund,
      donationDate: new Date().toISOString().substring(0, 10),
      is80GEligible: true,
      notes: 'Quick desk receipt',
      collectorName: 'Ahmed',
      branch: currentBranch,
    });
    setDonName('');
    setDonAmount('5100');
    setActiveModalKey(null);
    navigate('/donations');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tktDevotee.trim()) return;
    const count = Number(tktGuests) || 1;
    const rate = tktType.includes('VIP') ? 250 : tktType.includes('Puja') ? 1100 : 0;
    issueTicket({
      devoteeName: tktDevotee,
      phone: tktPhone || '+91 99000 11122',
      ticketType: tktType as any,
      slotTime: tktSlot,
      date: new Date().toISOString().substring(0, 10),
      guestCount: count,
      amount: rate * count,
      counterId: 'Desk Counter 1',
    });
    setTktDevotee('');
    setActiveModalKey(null);
    navigate('/tickets');
  };

  const handleCreateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stkName.trim()) return;
    addStockItem({
      itemName: stkName,
      category: stkCategory as any,
      quantityOnHand: Number(stkQty) || 10,
      unit: stkUnit,
      minThreshold: 10,
      unitPrice: Number(stkPrice) || 100,
      location: 'Central Godown',
    });
    setStkName('');
    setActiveModalKey(null);
    navigate('/stock');
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmGuest.trim()) return;
    const targetRoom = rooms.find((r) => r.roomNumber === rmNumber);
    const tariff = targetRoom?.dailyTariff || 1500;
    addBooking({
      roomNumber: rmNumber,
      guestName: rmGuest,
      phone: rmPhone || '+91 98333 44455',
      idProofType: 'Aadhaar',
      idProofNumber: rmIdNumber || 'XXXX-XXXX-1234',
      guestCount: 2,
      checkInDate: new Date().toISOString().substring(0, 10),
      checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
      advancePaid: Number(rmAdvance) || tariff,
      totalBill: tariff * 2,
      paymentStatus: 'Advance Paid',
      status: 'Checked-In',
    });
    setRmGuest('');
    setActiveModalKey(null);
    navigate('/dharamshala');
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vchPayee.trim() || !vchAmount) return;
    addVoucher({
      voucherType: vchType as any,
      debitAccount: `${vchDept} Operational Account`,
      creditAccount: 'Main Trust Bank Current A/c',
      amount: Number(vchAmount),
      date: new Date().toISOString().substring(0, 10),
      payeeOrPayer: vchPayee,
      description: vchDesc || 'Routine trust disbursement',
      status: 'Pending Approval',
      department: vchDept,
    });
    setVchPayee('');
    setActiveModalKey(null);
    navigate('/vouchers');
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8F6] dark:bg-[#101412] text-[#1F2722] dark:text-[#F0F5F1] transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        onQuickAction={handleQuickAction}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Large Rounded Content Canvas matching Screenshot */}
        <main className="flex-1 px-4 md:px-6 pb-6 pt-0 min-w-0">
          <div className="h-full rounded-[28px] md:rounded-[36px] bg-white dark:bg-[#181E1A] border border-[#E4E9E4] dark:border-[#27322A] p-5 sm:p-7 lg:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col min-w-0 overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Feedback Toasts */}
      <ToastContainer />

      {/* Quick Action Modal: New Member */}
      <Modal
        isOpen={activeModalKey === 'new-member'}
        onClose={() => setActiveModalKey(null)}
        title="Register New Trust Member"
        subtitle="Enroll a patron, life member, or associate donor"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setActiveModalKey(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateMember}>
              Save & Enroll Member
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateMember} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Chandra Agrawal"
            value={memName}
            onChange={(e) => setMemName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Phone"
              placeholder="+91 98..."
              value={memPhone}
              onChange={(e) => setMemPhone(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="member@domain.com"
              value={memEmail}
              onChange={(e) => setMemEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Membership Tier"
              value={memType}
              onChange={(e) => setMemType(e.target.value as any)}
              options={[
                { value: 'Life Member', label: 'Life Member (₹2.5L+)' },
                { value: 'Patron', label: 'Patron (₹10L+)' },
                { value: 'Donor Member', label: 'Donor Member (Annual)' },
                { value: 'Associate', label: 'Associate Member' },
                { value: 'Volunteer', label: 'Volunteer Sevadar' },
              ]}
            />
            <Input
              label="City / Region"
              placeholder="e.g. Mumbai, Surat, Delhi"
              value={memCity}
              onChange={(e) => setMemCity(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Quick Action Modal: Record Donation */}
      <Modal
        isOpen={activeModalKey === 'new-donation'}
        onClose={() => setActiveModalKey(null)}
        title="Record New Donation & Generate 80G Receipt"
        subtitle="Collect cash, UPI, cheque, or bank transfer seva"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setActiveModalKey(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateDonation}>
              Generate Official Receipt
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateDonation} className="space-y-4">
          <Input
            label="Donor Full Name"
            placeholder="Devotee or Corporation Name"
            value={donName}
            onChange={(e) => setDonName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Donation Amount (₹)"
              type="number"
              placeholder="5100"
              value={donAmount}
              onChange={(e) => setDonAmount(e.target.value)}
              required
            />
            <Select
              label="Payment Mode"
              value={donMode}
              onChange={(e) => setDonMode(e.target.value as any)}
              options={[
                { value: 'UPI/Online', label: 'UPI / Online Gateway' },
                { value: 'Cash', label: 'Cash (Desk Counter)' },
                { value: 'Cheque', label: 'Cheque / DD' },
                { value: 'Bank Transfer', label: 'RTGS / NEFT' },
                { value: 'In-Kind', label: 'In-Kind Provision' },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Allocated Fund / Seva"
              value={donFund}
              onChange={(e) => setDonFund(e.target.value as any)}
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
              label="Donor PAN (for 80G Exemption)"
              placeholder="e.g. ABCDE1234F"
              value={donPan}
              onChange={(e) => setDonPan(e.target.value.toUpperCase())}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="+91..."
              value={donPhone}
              onChange={(e) => setDonPhone(e.target.value)}
            />
            <Input
              label="Email (for e-Receipt)"
              placeholder="donor@example.com"
              value={donEmail}
              onChange={(e) => setDonEmail(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Quick Action Modal: Issue Ticket */}
      <Modal
        isOpen={activeModalKey === 'new-ticket'}
        onClose={() => setActiveModalKey(null)}
        title="Issue Darshan / Puja Ticket"
        subtitle="Instant pass allocation with printable QR code"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setActiveModalKey(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateTicket}>
              Issue Pass & Token
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Primary Devotee Name"
            placeholder="e.g. Sanjay Verma"
            value={tktDevotee}
            onChange={(e) => setTktDevotee(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Pass Type"
              value={tktType}
              onChange={(e) => setTktType(e.target.value)}
              options={[
                { value: 'Special VIP Darshan', label: 'Special VIP Darshan (₹250)' },
                { value: 'Mahapuja / Abhishek', label: 'Mahapuja / Abhishek (₹1,100)' },
                { value: 'General Darshan', label: 'General Darshan (Free Token)' },
                { value: 'Aarti Pass', label: 'Aarti Pass (₹250)' },
                { value: 'Kalyanam Ritual', label: 'Kalyanam Ritual (₹2,500)' },
              ]}
            />
            <Input
              label="Number of Devotees"
              type="number"
              min="1"
              max="20"
              value={tktGuests}
              onChange={(e) => setTktGuests(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Slot Timing"
              value={tktSlot}
              onChange={(e) => setTktSlot(e.target.value)}
              options={[
                { value: '06:00 AM - 07:30 AM', label: '06:00 AM - 07:30 AM (Brahma Muhurta)' },
                { value: '08:30 AM - 10:00 AM', label: '08:30 AM - 10:00 AM' },
                { value: '10:00 AM - 11:30 AM', label: '10:00 AM - 11:30 AM (Morning Peak)' },
                { value: '12:00 PM - 02:00 PM', label: '12:00 PM - 02:00 PM (Afternoon)' },
                { value: '04:30 PM - 06:00 PM', label: '04:30 PM - 06:00 PM (Evening)' },
                { value: '07:00 PM - 08:30 PM', label: '07:00 PM - 08:30 PM (Maha Aarti)' },
              ]}
            />
            <Input
              label="Mobile Number"
              placeholder="+91..."
              value={tktPhone}
              onChange={(e) => setTktPhone(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Quick Action Modal: Stock Item */}
      <Modal
        isOpen={activeModalKey === 'new-stock'}
        onClose={() => setActiveModalKey(null)}
        title="Add Stock Inventory Item"
        subtitle="Register new provisions, linen, or puja samagri"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setActiveModalKey(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateStock}>
              Save Item
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateStock} className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g. Mustard Oil (Can 15L)"
            value={stkName}
            onChange={(e) => setStkName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Category"
              value={stkCategory}
              onChange={(e) => setStkCategory(e.target.value)}
              options={[
                { value: 'Puja Samagri', label: 'Puja Samagri' },
                { value: 'Annakshetra Provisions', label: 'Annakshetra Provisions' },
                { value: 'Linen & Bedding', label: 'Linen & Bedding' },
                { value: 'Sanitation & Cleaning', label: 'Sanitation & Cleaning' },
                { value: 'Electrical & Hardware', label: 'Electrical & Hardware' },
                { value: 'Office Stationery', label: 'Office Stationery' },
              ]}
            />
            <Input
              label="Opening Quantity"
              type="number"
              value={stkQty}
              onChange={(e) => setStkQty(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Unit (e.g. Kg, Bags, Tins, Units)"
              value={stkUnit}
              onChange={(e) => setStkUnit(e.target.value)}
            />
            <Input
              label="Approx Unit Price (₹)"
              type="number"
              value={stkPrice}
              onChange={(e) => setStkPrice(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Quick Action Modal: Dharamshala Check-In */}
      <Modal
        isOpen={activeModalKey === 'new-room-booking'}
        onClose={() => setActiveModalKey(null)}
        title="Dharamshala Guest Check-In"
        subtitle="Allocate available room and verify guest identity"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setActiveModalKey(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateBooking}>
              Complete Check-In
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <Input
            label="Lead Guest Name"
            placeholder="e.g. Balram Murthy"
            value={rmGuest}
            onChange={(e) => setRmGuest(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Select Available Room"
              value={rmNumber}
              onChange={(e) => setRmNumber(e.target.value)}
              options={rooms
                .filter((r) => r.status === 'Available')
                .map((r) => ({
                  value: r.roomNumber,
                  label: `Room ${r.roomNumber} - ${r.roomType} (₹${r.dailyTariff}/day)`,
                }))}
            />
            <Input
              label="Contact Phone"
              placeholder="+91..."
              value={rmPhone}
              onChange={(e) => setRmPhone(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Aadhaar / ID Proof Number"
              placeholder="e.g. 1234-5678-9012"
              value={rmIdNumber}
              onChange={(e) => setRmIdNumber(e.target.value)}
            />
            <Input
              label="Advance Deposit Paid (₹)"
              type="number"
              value={rmAdvance}
              onChange={(e) => setRmAdvance(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Quick Action Modal: New Voucher */}
      <Modal
        isOpen={activeModalKey === 'new-voucher'}
        onClose={() => setActiveModalKey(null)}
        title="Create Financial Voucher"
        subtitle="Draft payment, receipt, or journal expense entry"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setActiveModalKey(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateVoucher}>
              Draft Voucher
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateVoucher} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Voucher Type"
              value={vchType}
              onChange={(e) => setVchType(e.target.value)}
              options={[
                { value: 'Payment Voucher', label: 'Payment Voucher' },
                { value: 'Receipt Voucher', label: 'Receipt Voucher' },
                { value: 'Journal Voucher', label: 'Journal Voucher' },
                { value: 'Contra Voucher', label: 'Contra Voucher' },
              ]}
            />
            <Select
              label="Department / Cost Center"
              value={vchDept}
              onChange={(e) => setVchDept(e.target.value)}
              options={[
                { value: 'Annakshetra & Bhojanalaya', label: 'Annakshetra & Bhojanalaya' },
                { value: 'Dharamshala Housekeeping', label: 'Dharamshala Housekeeping' },
                { value: 'Estate & Infrastructure', label: 'Estate & Infrastructure' },
                { value: 'Gaushala Cell', label: 'Gaushala Cell' },
                { value: 'Sanctum Puja Seva', label: 'Sanctum Puja Seva' },
                { value: 'Finance & Compliance', label: 'Finance & Compliance' },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Payee / Vendor Name"
              placeholder="e.g. Navrang Mandi Produce Mart"
              value={vchPayee}
              onChange={(e) => setVchPayee(e.target.value)}
              required
            />
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="12000"
              value={vchAmount}
              onChange={(e) => setVchAmount(e.target.value)}
              required
            />
          </div>
          <Input
            label="Narration / Expense Description"
            placeholder="Detailed description for audit trail..."
            value={vchDesc}
            onChange={(e) => setVchDesc(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};
