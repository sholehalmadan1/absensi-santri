import React from 'react';
import { usePesantren } from '../context/PesantrenContext';
import {
  ShieldCheck,
  QrCode,
  Heart,
  Building2,
  RotateCcw,
  LogOut,
  User,
  UserCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    pesantrenInfo,
    selectedSantriForWali,
    currentUstadz,
    role,
    setRole,
    resetAllData,
  } = usePesantren();

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-950/80 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/40 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base sm:text-lg tracking-tight leading-none">
                  Santri<span className="text-emerald-400">Connect</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase hidden sm:inline-block">
                  {currentUser?.role === 'admin'
                    ? 'Pengasuh & Admin'
                    : currentUser?.role === 'ustadz'
                    ? 'Panel Ustadz'
                    : 'Portal Wali'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                {pesantrenInfo.namaPondok}
              </p>
            </div>
          </div>

          {/* Center Navigation: Only shown if Admin wants to inspect other views */}
          {currentUser?.role === 'admin' && (
            <div className="hidden lg:flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setRole('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Utama</span>
              </button>
              <button
                onClick={() => setRole('ustadz')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  role === 'ustadz'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Simulasi Ustadz</span>
              </button>
              <button
                onClick={() => setRole('wali')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  role === 'wali'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Simulasi Wali</span>
              </button>
            </div>
          )}

          {/* Right: Active User Identity & Logout */}
          <div className="flex items-center gap-3">
            {/* Identity Info Card */}
            {currentUser && (
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 py-1.5 px-3 rounded-2xl">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div className="min-w-0 hidden sm:block text-left">
                  <p className="text-xs font-bold text-white truncate max-w-[160px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-400 truncate max-w-[160px]">
                    {currentUser.role === 'wali' && selectedSantriForWali
                      ? `Ananda: ${selectedSantriForWali.nama.split(' ')[0]}`
                      : currentUser.title || currentUser.role.toUpperCase()}
                  </p>
                </div>
              </div>
            )}

            {/* Reset Demo button for quick convenience */}
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data demo pesantren ke default awal?')) {
                  resetAllData();
                }
              }}
              title="Reset Data Demo"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Keluar dari Akun"
              className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
