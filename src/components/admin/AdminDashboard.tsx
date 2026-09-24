import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { ActivityManager } from './ActivityManager';
import { SantriCardGenerator } from './SantriCardGenerator';
import { StudentManager } from './StudentManager';
import { AttendanceAudit } from './AttendanceAudit';
import { getTodayDateString } from '../../data/mockData';
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Users,
  ClipboardList,
  Building2,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Compass,
  BookOpen,
  Scroll,
  GraduationCap,
  Library,
  ChevronRight,
  QrCode,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    pesantrenInfo,
    activities,
    toggleActivity,
    santriList,
    ustadzList,
    attendanceRecords,
  } = usePesantren();

  const [activeTab, setActiveTab] = useState<
    'ringkasan' | 'kegiatan' | 'kartu_santri' | 'santri' | 'audit'
  >('ringkasan');

  const todayStr = getTodayDateString();
  const todayRecords = attendanceRecords.filter((r) => r.date === todayStr);
  const activeActivitiesCount = activities.filter((a) => a.isActive).length;

  const getActivityIcon = (id: string) => {
    switch (id) {
      case 'jamaah_sholat':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'ngaji_quran':
        return <BookOpen className="w-4 h-4 text-teal-400" />;
      case 'ngaji_kitab':
        return <Scroll className="w-4 h-4 text-amber-400" />;
      case 'sekolah':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'diniyah':
        return <Library className="w-4 h-4 text-purple-400" />;
      default:
        return <CalendarCheck className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">
              Panel Pengasuh & Admin Pondok
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Dasbor Manajemen Pesantren
          </h1>
          <p className="text-xs text-slate-400">
            {pesantrenInfo.namaPondok} • Tahun Ajaran {pesantrenInfo.tahunAjaran} ({pesantrenInfo.semester})
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'ringkasan'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan</span>
          </button>
          <button
            onClick={() => setActiveTab('kegiatan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'kegiatan'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Kelola Kegiatan ({activeActivitiesCount}/{activities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('kartu_santri')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'kartu_santri'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>Generator Kartu QR</span>
          </button>
          <button
            onClick={() => setActiveTab('santri')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'santri'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Santri</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Audit Presensi</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: RINGKASAN */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Total Santri Aktif</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mt-2">{santriList.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Santriwan & Santriwati</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Asatidz & Pembimbing</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mt-2">{ustadzList.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Ustadz & Ustadzah</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Kegiatan Diaktifkan</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-amber-400 mt-2">
                {activeActivitiesCount}{' '}
                <span className="text-sm font-normal text-slate-400">/ {activities.length}</span>
              </p>
              <p className="text-[11px] text-emerald-400 mt-1">Dapat di-toggle kapan saja</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Log Presensi Hari Ini</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-400 mt-2">{todayRecords.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Tercatat di sistem</p>
            </div>
          </div>

          {/* Quick Activity Toggle Strip */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span>Kontrol Cepat Status Kegiatan Hari Ini</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik saklar toggle untuk mengaktifkan atau menonaktifkan kegiatan santri secara instan.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('kegiatan')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Kelola Jadwal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    act.isActive
                      ? 'bg-slate-800/80 border-emerald-500/40'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(act.id)}
                      <span className="font-bold text-xs text-white leading-tight">
                        {act.name}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold ${
                        act.isActive ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {act.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleActivity(act.id)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      {act.isActive ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Shortcut Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shortcut Card Generator */}
            <div
              onClick={() => setActiveTab('kartu_santri')}
              className="group bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 p-6 rounded-2xl shadow-xl cursor-pointer transition flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-emerald-300 transition">
                  Generator Kartu Santri Ber-QR Code
                </h4>
                <p className="text-xs text-slate-300 max-w-sm">
                  Cetak kartu tanda santri (KTS) resmi satuan maupun massal (A4) untuk dipindai oleh para Ustadz.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition" />
            </div>

            {/* Shortcut Audit Rekap */}
            <div
              onClick={() => setActiveTab('audit')}
              className="group bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl shadow-xl cursor-pointer transition flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-indigo-300 transition">
                  Audit Presensi & Export Rekap
                </h4>
                <p className="text-xs text-slate-300 max-w-sm">
                  Lihat rekapitulasi kehadiran sholat, ngaji Qur'an, kitab, sekolah, dan diniyah lengkap dengan nama ustadz pencatat.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-indigo-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: KELOLA KEGIATAN */}
      {activeTab === 'kegiatan' && <ActivityManager />}

      {/* TAB CONTENT: GENERATOR KARTU SANTRI */}
      {activeTab === 'kartu_santri' && <SantriCardGenerator />}

      {/* TAB CONTENT: DATA SANTRI */}
      {activeTab === 'santri' && <StudentManager />}

      {/* TAB CONTENT: AUDIT PRESENSI */}
      {activeTab === 'audit' && <AttendanceAudit />}
    </div>
  );
};
