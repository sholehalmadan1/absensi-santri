/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PesantrenProvider, usePesantren } from './context/PesantrenContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UstadzDashboard } from './components/ustadz/UstadzDashboard';
import { WaliPortal } from './components/wali/WaliPortal';
import {
  ShieldCheck,
  QrCode,
  Heart,
  Building2,
  LogOut,
  User,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, role, setRole, pesantrenInfo, logout, selectedSantriForWali } = usePesantren();

  // If not authenticated, show the login page
  if (!currentUser) {
    return <LoginPage />;
  }

  // Determine active view:
  // For 'wali', strictly lock to WaliPortal
  // For 'ustadz', strictly lock to UstadzDashboard
  // For 'admin', display AdminDashboard (or allow previewing if setRole changed)
  const activeView =
    currentUser.role === 'wali'
      ? 'wali'
      : currentUser.role === 'ustadz'
      ? 'ustadz'
      : role;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'ustadz' && <UstadzDashboard />}
        {activeView === 'wali' && <WaliPortal />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
            <Building2 className="w-4 h-4" />
            <span>{pesantrenInfo.namaPondok}</span>
          </div>
          <p className="text-slate-400">
            Pengasuh: <span className="text-slate-200">{pesantrenInfo.pengasuh}</span> •{' '}
            {pesantrenInfo.alamat}
          </p>
          <p className="text-[11px] text-slate-600">
            Sistem Digitalisasi Presensi Terpadu Santri (Sholat, Qur'an, Kitab Kuning, Sekolah, Diniyah) & Portal Wali Santri
          </p>
        </div>
      </footer>

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2.5 flex items-center justify-between md:hidden z-40 no-print shadow-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            {currentUser.role === 'wali' ? (
              <Heart className="w-4 h-4 text-rose-400" />
            ) : currentUser.role === 'ustadz' ? (
              <QrCode className="w-4 h-4 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUser.role === 'wali' && selectedSantriForWali
                ? `Ananda: ${selectedSantriForWali.nama.split(' ')[0]}`
                : currentUser.title || currentUser.role}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Keluar dari akun?')) {
              logout();
            }
          }}
          className="py-1.5 px-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PesantrenProvider>
      <MainContent />
    </PesantrenProvider>
  );
}
