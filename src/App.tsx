import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MembersPage } from './features/members/MembersPage';
import { DonationsPage } from './features/donations/DonationsPage';
import { TicketsPage } from './features/tickets/TicketsPage';
import { StockPage } from './features/stock/StockPage';
import { DharamshalaPage } from './features/dharamshala/DharamshalaPage';
import { VouchersPage } from './features/vouchers/VouchersPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { MealBookingsPage } from './features/meal-bookings/MealBookingsPage';
import { UsersRolesPage } from './features/users-roles/UsersRolesPage';
import { SettingsPage } from './features/settings/SettingsPage';

export const App: React.FC = () => {
  const { theme } = useAppStore();

  // Synchronize theme with DOM on boot
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="dharamshala" element={<DharamshalaPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="meal-bookings" element={<MealBookingsPage />} />
          <Route path="users-roles" element={<UsersRolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
