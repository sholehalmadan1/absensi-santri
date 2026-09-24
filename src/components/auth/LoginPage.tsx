import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { Role } from '../../types';
import {
  Building2,
  Heart,
  QrCode,
  ShieldCheck,
  Lock,
  User,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    pesantrenInfo,
    login,
    loginAsSantriWali,
    loginAsUstadz,
    loginAsAdmin,
    santriList,
    ustadzList,
  } = usePesantren();

  const [activeTab, setActiveTab] = useState<Role>('wali');
  const [identifier, setIdentifier] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(activeTab, identifier, passwordOrPin);
      if (!result.success) {
        setErrorMessage(result.message || 'Gagal masuk. Periksa kembali data login Anda.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleTabSwitch = (newRole: Role) => {
    setActiveTab(newRole);
    setErrorMessage(null);
    setIdentifier('');
    setPasswordOrPin('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-8 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Decorative Islamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/15 via-teal-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/30 shadow-2xl shadow-emerald-950 text-white mx-auto">
            <Building2 className="w-9 h-9 text-emerald-200" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sistem Presensi & Pemantauan Terpadu Santri
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {pesantrenInfo.namaPondok}
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              {pesantrenInfo.alamat}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Role Tabs */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch('wali')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'wali'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span>Wali Santri</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('ustadz')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'ustadz'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>Ustadz</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Pengasuh / Admin</span>
            </button>
          </div>

          {/* Role Description Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs flex items-start gap-3">
            {activeTab === 'wali' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Portal Akses Wali Santri</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Masuk untuk memantau ibadah sholat berjamaah, setoran Qur'an, kajian kitab kuning, dan sekolah ananda secara privat.
                  </p>
                </div>
              </>
            )}

            {activeTab === 'ustadz' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Panel Presensi Ustadz & Musyrif</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Masuk untuk memindai QR Code Kartu Tanda Santri (KTS) atau melakukan presensi rombongan halaqah.
                  </p>
                </div>
              </>
            )}

            {activeTab === 'admin' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Panel Pengasuh & Administrasi</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Akses kontrol penuh manajemen santri, saklar kegiatan harian, rekapitulasi, serta cetak kartu digital.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {activeTab === 'wali'
                  ? 'NIS Santri atau No. WhatsApp Wali'
                  : activeTab === 'ustadz'
                  ? 'NIP Ustadz atau No. Telepon'
                  : 'Username / Email Admin'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {activeTab === 'wali' ? (
                    <User className="w-4 h-4" />
                  ) : activeTab === 'ustadz' ? (
                    <QrCode className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    activeTab === 'wali'
                      ? 'Contoh: 2024.01.001 atau 081289123456'
                      : activeTab === 'ustadz'
                      ? 'Contoh: UST.2018.014 atau ustadz'
                      : 'Contoh: admin'
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {activeTab === 'wali' ? 'PIN Keamanan Wali Santri' : 'Kata Sandi (Password)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordOrPin}
                  onChange={(e) => setPasswordOrPin(e.target.value)}
                  placeholder={
                    activeTab === 'wali' ? 'Masukkan 4 digit PIN (Default: 1234)' : 'Masukkan kata sandi'
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Login Shortcuts for Quick Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Akses Cepat Uji Coba (Demo 1-Klik):
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Tinggal Klik</span>
            </div>

            {activeTab === 'wali' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 mb-2">
                  Pilih salah satu wali santri untuk mencoba dashboard ananda:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {santriList.slice(0, 4).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => loginAsSantriWali(s.id)}
                      className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center gap-2.5 group"
                    >
                      <img
                        src={s.fotoUrl}
                        alt={s.nama}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                          Wali {s.nama.split(' ')[0]}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">NIS: {s.nis}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ustadz' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 mb-2">
                  Pilih akun ustadz pembimbing presensi:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ustadzList.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => loginAsUstadz(u.id)}
                      className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center gap-2.5 group"
                    >
                      <img
                        src={u.fotoUrl}
                        alt={u.nama}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                          {u.nama}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{u.nip}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div>
                <button
                  type="button"
                  onClick={loginAsAdmin}
                  className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400">
                        {pesantrenInfo.pengasuh}
                      </p>
                      <p className="text-[10px] text-slate-400">Pengasuh & Admin Pondok</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    Masuk Sekarang <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security & Privacy Commitment */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sistem Keamanan & Privasi Santri Terenkripsi</span>
          </p>
          <p>
            Wali santri hanya dapat melihat rekam aktivitas ananda masing-masing demi menjaga privasi dan ketertiban pesantren.
          </p>
        </div>
      </div>
    </div>
  );
};
