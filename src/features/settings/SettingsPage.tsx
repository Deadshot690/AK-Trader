import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { ThemeMode } from '../../types';
import {
  Settings,
  Building,
  Palette,
  Sun,
  Moon,
  Check,
  Shield,
  FileText,
  RotateCcw,
  Save,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, currentBranch, setCurrentBranch, addToast } = useAppStore();

  // Trust Info Form State
  const [trustName, setTrustName] = useState('Shree Temple & Charitable Trust Foundation');
  const [regNumber, setRegNumber] = useState('E-19842/MUMBAI/TRUST');
  const [trustPan, setTrustPan] = useState('AAATS4910M');
  const [order80G, setOrder80G] = useState('CIT/E/80G/2021-22/A-492');
  const [financialYear, setFinancialYear] = useState('FY 2026-2027');
  const [receiptPrefix, setReceiptPrefix] = useState('RCP-2026-');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Trust configuration and preferences updated.',
    });
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('ttfms_erp_store_v1');
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Trust Foundation Settings & System Configuration
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Configure trust statutory identities, financial numbering sequences, and visual themes.
          </p>
        </div>

        <Button
          size="sm"
          leftIcon={<Save className="w-3.5 h-3.5" />}
          onClick={handleSaveSettings}
        >
          Save All Changes
        </Button>
      </div>

      {/* Section 1: Three Visual Themes Picker */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#344E41] dark:text-[#88A695]" />
            Application Visual Theme
          </h3>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
            Select one of the three commercial-grade color themes:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Theme */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-[#344E41] ring-2 ring-[#344E41]/20 shadow-md bg-white'
                : 'border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#1A211D] hover:border-[#344E41]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  Light Theme
                </span>
              </div>
              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-[#344E41] text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="space-y-1.5 p-2 rounded-xl bg-[#F7F8F6] border border-[#E4E9E4]">
              <div className="w-full h-3 rounded bg-white" />
              <div className="w-2/3 h-2 rounded bg-[#344E41]" />
            </div>
            <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] mt-2.5">
              Crisp white surfaces, light neutral application background (#F7F8F6), and dark forest accents.
            </p>
          </div>

          {/* Dark Theme */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-[#344E41] ring-2 ring-[#344E41]/20 shadow-md bg-[#181E1A]'
                : 'border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#1A211D] hover:border-[#344E41]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  Dark Theme
                </span>
              </div>
              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="space-y-1.5 p-2 rounded-xl bg-[#101412] border border-[#27322A]">
              <div className="w-full h-3 rounded bg-[#181E1A]" />
              <div className="w-2/3 h-2 rounded bg-[#344E41]" />
            </div>
            <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] mt-2.5">
              Refined charcoal backgrounds (#101412), rich dark surfaces (#181E1A), and high-contrast text.
            </p>
          </div>

          {/* Brand Theme */}
          <div
            onClick={() => setTheme('brand')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'brand'
                ? 'border-[#344E41] ring-2 ring-[#344E41]/20 shadow-md bg-[#F4F8F5]'
                : 'border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9] dark:bg-[#1A211D] hover:border-[#344E41]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E7EDE8] text-[#344E41] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                  Brand Theme
                </span>
              </div>
              {theme === 'brand' && (
                <span className="w-5 h-5 rounded-full bg-[#344E41] text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="space-y-1.5 p-2 rounded-xl bg-[#E7EEE8] border border-[#D1DED3]">
              <div className="w-full h-3 rounded bg-[#F4F8F5]" />
              <div className="w-2/3 h-2 rounded bg-[#24372E]" />
            </div>
            <p className="text-[11px] text-[#68736C] dark:text-[#95A59A] mt-2.5">
              Forest-green led interface with coordinated sage surfaces (#E7EEE8) and primary brand highlights.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Trust Legal Profile */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#344E41]" />
            Trust Legal Identity & Tax Exemption
          </h3>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A]">
            Information printed on official 80G certificates and government receipts
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <Input
            label="Trust Legal Entity Name"
            value={trustName}
            onChange={(e) => setTrustName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Trust Registration #"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
            />
            <Input
              label="Trust PAN Number"
              value={trustPan}
              onChange={(e) => setTrustPan(e.target.value)}
            />
            <Input
              label="Section 80G Order Number"
              value={order80G}
              onChange={(e) => setOrder80G(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Active Operating Financial Year"
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              options={[
                { value: 'FY 2026-2027', label: 'FY 2026-2027 (Current)' },
                { value: 'FY 2025-2026', label: 'FY 2025-2026' },
                { value: 'FY 2024-2025', label: 'FY 2024-2025' },
              ]}
            />
            <Select
              label="Designated Branch Campus"
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              options={[
                { value: 'Main City Central Campus', label: 'Main City Central Campus' },
                { value: 'Hilltop Shrine Counter', label: 'Hilltop Shrine Counter' },
                { value: 'Pilgrim Complex A', label: 'Pilgrim Complex A' },
                { value: 'Headquarters & Trust Secretariat', label: 'Headquarters & Trust Secretariat' },
              ]}
            />
          </div>
        </form>
      </div>

      {/* Section 3: Reset Demo State */}
      <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">
            Reset All Mock Datasets
          </h4>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-400 mt-0.5">
            Clear all local state storage and re-seed original sample records.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={handleResetDemoData}
        >
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
};
