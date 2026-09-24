import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { SantriCardView } from '../common/SantriCardView';
import { ReportDownloadModal } from './ReportDownloadModal';
import { getTodayDateString } from '../../data/mockData';
import {
  Heart,
  Phone,
  Share2,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Compass,
  Scroll,
  Library,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  User,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

export const WaliPortal: React.FC = () => {
  const {
    santriList,
    selectedSantriForWali,
    setSelectedSantriIdForWali,
    pesantrenInfo,
    attendanceRecords,
    activities,
  } = usePesantren();

  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('today');
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const todayStr = getTodayDateString();
  const currentSantri = selectedSantriForWali || santriList[0];

  // Get records for this santri
  const santriRecords = attendanceRecords.filter((r) => r.santriId === currentSantri.id);
  const todayRecords = santriRecords.filter((r) => r.date === todayStr);

  const displayedRecords = dateFilter === 'today' ? todayRecords : santriRecords;

  // Sholat 5 waktu statuses for today
  const sholatList = ['Sholat Subuh', 'Sholat Dzuhur', 'Sholat Ashar', 'Sholat Maghrib', 'Sholat Isya'];
  const sholatStatuses = sholatList.map((sholat) => {
    const record = todayRecords.find(
      (r) =>
        r.activityId === 'jamaah_sholat' &&
        r.subActivity &&
        r.subActivity.toLowerCase().includes(sholat.toLowerCase())
    );
    return {
      nama: sholat,
      record,
      status: record?.status || 'belum',
      time: record?.time,
    };
  });

  // Calculate monthly attendance statistics
  const totalLogs = santriRecords.length;
  const hadirLogs = santriRecords.filter((r) => r.status === 'hadir').length;
  const masbuqLogs = santriRecords.filter((r) => r.status === 'masbuq').length;
  const attendanceRate =
    totalLogs > 0 ? Math.round(((hadirLogs + masbuqLogs) / totalLogs) * 100) : 100;

  // Activity specifics
  const quranRecord = todayRecords.find((r) => r.activityId === 'ngaji_quran');
  const kitabRecord = todayRecords.find((r) => r.activityId === 'ngaji_kitab');
  const sekolahRecord = todayRecords.find((r) => r.activityId === 'sekolah');
  const diniyahRecord = todayRecords.find((r) => r.activityId === 'diniyah');

  // WhatsApp formatted report
  const generateWhatsAppMessage = () => {
    const text = `*LAPORAN AKTIVITAS SANTRI - ${pesantrenInfo.namaPondok.toUpperCase()}*
Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}

Ananda: *${currentSantri.nama}* (NIS: ${currentSantri.nis})
Kamar/Asrama: ${currentSantri.kamar}
Wali Santri: ${currentSantri.waliNama}

*1. SHOLAT FARDHU BERJAMAAH:*
${sholatStatuses
  .map((s) => `• ${s.nama}: ${s.status === 'hadir' ? '✅ Hadir Berjamaah' : s.status === 'masbuq' ? '⚠️ Masbuq' : '⏳ Terjadwal'}`)
  .join('\n')}

*2. NGAJI AL-QUR'AN / TAHFIDZ:*
${quranRecord ? `✅ Hadir (${quranRecord.subActivity}) - ${quranRecord.notes || 'Lancar'}` : '⏳ Belum sesi / Jadwal sore'}

*3. NGAJI KITAB KUNING:*
${kitabRecord ? `✅ Hadir (${kitabRecord.subActivity})` : '⏳ Belum sesi / Jadwal ba’da shubuh'}

*4. KBM SEKOLAH FORMAL:*
${sekolahRecord ? `✅ Hadir (${sekolahRecord.time})` : '⏳ Libur / Belum KBM'}

*5. MADRASAH DINIYAH:*
${diniyahRecord ? `✅ Hadir (${diniyahRecord.time})` : '⏳ Jadwal ba’da Isya'}

Tingkat Disiplin Bulan Ini: *${attendanceRate}% Hadir*
Pengasuh: *${pesantrenInfo.pengasuh}*
Alhamdulillah ananda dalam keadaan sehat wal afiat.`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/62${currentSantri.waliPhone.replace(/^0/, '')}?text=${encoded}`;
  };

  return (
    <div className="space-y-6">
      {/* Islamic Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Portal Komunikasi & Laporan Wali Santri
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Ahlan wa Sahlan, {currentSantri.waliNama}
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-xl leading-relaxed">
              Memantau perkembangan ibadah, ngaji Al-Qur'an, kajian kitab kuning, sekolah, dan
              kesehatan ananda <strong>{currentSantri.nama}</strong> di Pondok Pesantren secara
              transparan & real-time.
            </p>
          </div>

          {/* Verified Private Child Badge (No switcher to other santri) */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3.5 flex flex-col gap-1.5 shrink-0 min-w-[260px] shadow-lg shadow-emerald-950/40">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Akses Privat Terverifikasi
              </span>
            </div>
            <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800">
              <p className="text-xs font-black text-white">{currentSantri.nama}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                <span className="font-mono text-emerald-400">NIS: {currentSantri.nis}</span>
                <span>{currentSantri.kamar.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Santri Profile Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Santri Card Summary */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-emerald-400/80 bg-slate-950 shadow-md shrink-0">
              <img
                src={currentSantri.fotoUrl}
                alt={currentSantri.nama}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                NIS: {currentSantri.nis}
              </span>
              <h3 className="font-bold text-base text-white truncate mt-0.5">
                {currentSantri.nama}
              </h3>
              <p className="text-xs text-slate-300 mt-1">{currentSantri.kamar}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Santri Aktif
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentSantri.kelasFormal}
                </span>
              </div>
            </div>
          </div>

          {/* Quick links & buttons */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setShowCardModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Lihat Kartu Santri Digital</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim ke WA</span>
              </a>
              <button
                onClick={() => setShowReportModal(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Raport PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Health Meter */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Indikator Kedisiplinan & Kehadiran Santri</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kompilasi presensi 5 kegiatan harian semester ini
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">{attendanceRate}%</span>
              <p className="text-[10px] text-slate-400">Tingkat Hadir</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Kehadiran Keseluruhan</span>
              <span>{hadirLogs} dari {totalLogs} sesi kegiatan</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
          </div>

          {/* Activity Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Hafalan Al-Qur'an:</span>
              <span className="font-bold text-emerald-400 mt-1 block">
                {currentSantri.hafalanTerakhir || 'Juz 30 (Al-A’la s.d An-Nas)'}
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Kajian Kitab Kuning:</span>
              <span className="font-bold text-amber-300 mt-1 block">
                {currentSantri.kitabTerakhir || 'Fathul Qorib - Bab Sholat'}
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Kondisi Kesehatan:</span>
              <span className="font-bold text-slate-200 mt-1 block">
                {currentSantri.catatanKesehatan || 'Alhamdulillah Sehat & Bugar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S 5 MANDATORY ACTIVITIES STATUS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Presensi Kegiatan Santri Hari Ini</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* 1. Sholat 5 Waktu Step Tracker */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Sholat Fardhu 5 Waktu Berjamaah</h3>
                <p className="text-xs text-slate-400">Wajib dilaksanakan berjamaah di Musholla Pondok</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {sholatStatuses.map((sholat) => {
              const isHadir = sholat.status === 'hadir';
              const isMasbuq = sholat.status === 'masbuq';

              return (
                <div
                  key={sholat.nama}
                  className={`p-3.5 rounded-xl border text-center transition flex flex-col justify-between ${
                    isHadir
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : isMasbuq
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{sholat.nama}</p>
                  <div className="my-2 flex justify-center">
                    {isHadir ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : isMasbuq ? (
                      <Clock className="w-6 h-6 text-amber-400" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700"></div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      {isHadir ? 'Hadir Berjamaah' : isMasbuq ? 'Masbuq' : 'Terjadwal'}
                    </span>
                    {sholat.time && (
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5 block">
                        {sholat.time}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2, 3, 4, 5. Sekolah, Ngaji Qur'an, Ngaji Kitab, Diniyah Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ngaji Qur'an & Tahfidz */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Ngaji Al-Qur'an & Tahfidz</h4>
                  <p className="text-xs text-slate-400">Ba'da Ashar (Halaqah Tahfidz)</p>
                </div>
              </div>
              {quranRecord ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hadir
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                  Jadwal Sore
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Setoran Terakhir:</span>
                <span className="font-semibold text-emerald-300">
                  {quranRecord?.subActivity || currentSantri.hafalanTerakhir}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Catatan Ustadz:</span>
                <span className="text-slate-200 italic max-w-xs text-right">
                  {quranRecord?.notes || 'Tartil, makhraj fasih & mutqin'}
                </span>
              </div>
            </div>
          </div>

          {/* Ngaji Kitab Kuning */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                  <Scroll className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Ngaji Kitab Kuning (Turats)</h4>
                  <p className="text-xs text-slate-400">Kajian Sorogan & Bandongan</p>
                </div>
              </div>
              {kitabRecord ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hadir
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                  Jadwal Ba'da Subuh
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Kitab yang Dibaca:</span>
                <span className="font-semibold text-amber-300">
                  {kitabRecord?.subActivity || currentSantri.kitabTerakhir}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Catatan Pembimbing:</span>
                <span className="text-slate-200 italic max-w-xs text-right">
                  {kitabRecord?.notes || 'Memahami makna murad & tarkib nahwu'}
                </span>
              </div>
            </div>
          </div>

          {/* Sekolah Formal KBM */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Sekolah Formal (KBM MTs/MA)</h4>
                  <p className="text-xs text-slate-400">Pukul 07:15 - 13:30 WIB</p>
                </div>
              </div>
              {sekolahRecord ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hadir
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                  Tercatat Otomatis
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Kelas Formal:</span>
                <span className="font-semibold text-slate-200">{currentSantri.kelasFormal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waktu Masuk:</span>
                <span className="font-mono text-emerald-400">{sekolahRecord?.time || '07:10:00'} WIB</span>
              </div>
            </div>
          </div>

          {/* Madrasah Diniyah Takmiliyah */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Madrasah Diniyah Takmiliyah</h4>
                  <p className="text-xs text-slate-400">Pukul 19:30 - 20:30 WIB (Malam)</p>
                </div>
              </div>
              {diniyahRecord ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hadir
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                  Jadwal Malam
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Tingkat Diniyah:</span>
                <span className="font-semibold text-purple-300">{currentSantri.kelasDiniyah}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Kehadiran:</span>
                <span className="font-semibold text-slate-200">
                  {diniyahRecord ? 'Hadir di Kelas' : 'Belum Mulai'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Feed List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Riwayat Aktivitas & Presensi Terperinci</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                dateFilter === 'today'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                dateFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Semua Riwayat
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {displayedRecords.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Belum ada riwayat aktivitas pada tanggal ini.
            </div>
          ) : (
            displayedRecords.map((r) => (
              <div
                key={r.id}
                className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="font-mono text-[11px] text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {r.time}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{r.activityName}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {r.subActivity || '-'} • Oleh {r.ustadzNama}
                    </p>
                    {r.notes && (
                      <p className="text-[11px] text-emerald-300 italic mt-0.5">
                        "{r.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.status === 'hadir'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : r.status === 'masbuq'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Digital Santri Card for Wali Santri */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setShowCardModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="font-bold text-base text-white mb-1">Kartu Santri Digital</h3>
            <p className="text-xs text-slate-400 mb-4 text-center">
              Dapat disimpan di galeri HP atau dicetak untuk dibawa santri.
            </p>
            <SantriCardView
              santri={currentSantri}
              pesantren={pesantrenInfo}
              colorScheme="emerald"
              showControls={true}
            />
          </div>
        </div>
      )}

      {/* Modal Report Download */}
      {showReportModal && (
        <ReportDownloadModal
          santri={currentSantri}
          pesantren={pesantrenInfo}
          records={santriRecords}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
