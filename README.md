# TTFMS - Foundation OS | Enterprise ERP Frontend

Production-grade, professional enterprise frontend for **TTFMS (Trust, Temple & Foundation Management System)** built strictly according to the reference dashboard UI/UX design specifications, commercial design tokens, and modular feature architecture.

---

## 🎨 Creative Direction & Visual Architecture

- **Primary Brand Color**: `#344E41` (Deep Forest Green)
- **Palette**: `#24372E` (Deep Forest), `#1B2922` (Dark Accent), `#E7EDE8` (Soft Sage), `#F3F6F3` (Pale Green Surface), `#F7F8F6` (Application Canvas Background), `#FFFFFF` (Surface Card), `#1F2722` (Main Text), `#68736C` (Secondary Text), `#E4E9E4` (Subtle Border).
- **Application Canvas**: Signature large rounded white canvas (`rounded-[32px] md:rounded-[36px]`) with subtle borders and soft shadow framing.
- **Reference Match**:
  - Top Sidebar Pill: Concentric target brand glyph + `TTFMS` + `FOUNDATION OS` + `<<` collapse toggle.
  - Active Nav Item: Dark Charcoal/Forest pill (`bg-[#1F2722]`) with white typography and stroke icon.
  - Bottom Sidebar Pill: `Ahmed - Branch Manager` profile card with user avatar and chevron trigger.
  - Application Header: Bold page title, rounded-full search bar with instant autocomplete, notification bell with unread badge, 3-theme switcher, and user avatar dropdown.

---

## 🌗 Three Complete Visual Themes

1. **Light Theme**:
   - Clean white surfaces, soft neutral `#F7F8F6` canvas, charcoal text, forest-green primary buttons.
2. **Dark Theme**:
   - Deep charcoal `#101412` canvas, dark emerald `#181E1A` surfaces, accessible high-contrast text, emerald status indicators.
3. **Brand Theme**:
   - Forest-green-led interface, `#E7EEE8` sage canvas, `#F4F8F5` content surfaces, `#344E41` primary highlights.

*Themes are synchronized with `data-theme` attributes and persistent in `localStorage`.*

---

## 🚀 Implemented Modules & Features

| # | Module | Core Functionality |
|---|---|---|
| **1** | **Overview (Dashboard)** | 6 Enterprise KPI metric cards, Recharts 6-month financial velocity area chart, room capacity pie chart, recent donations table with 80G print modal, and live Darshan queue widget. |
| **2** | **Members** | Directory table, tier filter (Life Member, Patron, Donor, Associate, Volunteer), status filter, multi-selection, add/edit member form, and **Digital Member Smart Card Drawer** with verified QR code. |
| **3** | **Donations & 80G** | Seva receipts ledger, PAN tracking, fund classification (Annakshetra, Temple, Gaushala, Medical, Education), payment modes, and **Printable 80G Tax Exemption Certificate Modal** with Section 80G(5)(vi) trust seal. |
| **4** | **Tickets & Darshan** | Counter pass allocation (VIP Darshan, Mahapuja Abhishek, Free Pass, Aarti), slot timing, live **Sanctum Gate QR Token Validator Bar**, and printable QR ticket passes. |
| **5** | **Stock & Inventory** | Central Godown SKU balances, low-stock threshold alerts, dual tabs for inventory balances and **Goods Received Notes (GRN) Inward Movement Log**, department issues. |
| **6** | **Dharamshala** | Visual room inventory grid across Block A, Block B, Block C & Tower Suite with color-coded status badges (Available, Occupied, Under Cleaning, Maintenance), guest KYC check-in, and checkout bill settlement. |
| **7** | **Vouchers** | Financial disbursement ledger (Payment, Receipt, Journal, Contra), debit/credit accounts, cost center classification, and single-click **Trustee Approval Workflow**. |
| **8** | **Reports & Analytics** | Financial day book & surplus analytics, 80G fund return schedules, occupancy statistics, stock valuation audit, and export simulation (PDF / Excel). |
| **9** | **Meal Bookings** | Annakshetra dining session schedules (Morning Prasad, Lunch Bhojan, Evening Tea, Dinner Prasad), token counter, diet preferences (Sattvic / Jain), and **Kitchen Token Redemption Desk**. |
| **10** | **Users & Roles** | Multi-branch operator accounts directory, interactive **Role Permissions Matrix (RBAC)** across 11 modules, and cryptographically timestamped **Security Audit Log Trail**. |
| **11** | **Settings** | Trust legal entity profile (Registration, PAN, 80G order), active operating financial year, branch campus switcher, theme selector, and demo state reset. |

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v3 with custom brand tokens
- **Routing**: React Router v7 (`HashRouter` for zero-404 static hosting resilience)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Responsive Area, Bar, and Pie Charts)
- **State Management**: Zustand with persistent storage
- **Font**: Plus Jakarta Sans & Inter (Google Fonts)

---

## 💻 Local Execution Guide

### 1. Prerequisites
Ensure you have Node.js (v18+ or v20+) and npm installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.
