import React, { useState, useRef, useEffect } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { ActivityType, AttendanceStatus, Santri } from '../../types';
import { getTodayDateString } from '../../data/mockData';
import confetti from 'canvas-confetti';
import {
  Camera,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Users,
  Compass,
  BookOpen,
  Scroll,
  GraduationCap,
  Library,
  Volume2,
  VolumeX,
  Search,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const UstadzScanner: React.FC = () => {
  const {
    activeActivities,
    activities,
    currentUstadz,
    santriList,
    recordAttendance,
    getSantriByNis,
    attendanceRecords,
    showToast,
  } = usePesantren();

  // Selected active activity
  const [selectedActivityId, setSelectedActivityId] = useState<ActivityType>(() => {
    return activeActivities[0]?.id || 'jamaah_sholat';
  });

  // Sub-activity specific fields
  const [subActivity, setSubActivity] = useState<string>('Sholat Subuh');
  const [quranJuzSurah, setQuranJuzSurah] = useState<string>('Juz 30 (An-Naba s.d An-Nas)');
  const [quranGrade, setQuranGrade] = useState<string>('Mumtaz (Sangat Baik)');
  const [kitabTitle, setKitabTitle] = useState<string>('Fathul Qorib - Bab Sholat');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [defaultStatus, setDefaultStatus] = useState<AttendanceStatus>('hadir');

  // Scanner state
  const [manualNisInput, setManualNisInput] = useState<string>('');
  const [lastScannedSantri, setLastScannedSantri] = useState<{
    santri: Santri;
    time: string;
    status: AttendanceStatus;
    subActivity: string;
    notes?: string;
  } | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [simDrawerOpen, setSimDrawerOpen] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const todayStr = getTodayDateString();
  const selectedConfig = activities.find((a) => a.id === selectedActivityId);
  const isSelectedActive = selectedConfig?.isActive ?? false;

  // Sound effect using Web Audio API (no external file dependency)
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pleasant A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext may be restricted before interaction
    }
  };

  // Start real camera stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError(
        'Kamera fisik tidak dapat diakses atau izin ditolak. Anda tetap dapat menggunakan Mode Simulasi Tap Kartu Santri & Input NIS di bawah.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Process a successful scan by NIS
  const handleProcessScan = (nis: string) => {
    if (!isSelectedActive) {
      showToast(`Kegiatan ${selectedConfig?.name} sedang dinonaktifkan oleh Admin`);
      return;
    }

    const santri = getSantriByNis(nis);
    if (!santri) {
      showToast(`Santri dengan NIS ${nis} tidak ditemukan`);
      return;
    }

    // Determine subActivity text
    let resolvedSub = subActivity;
    let resolvedNotes = customNotes;

    if (selectedActivityId === 'ngaji_quran') {
      resolvedSub = `Setoran: ${quranJuzSurah}`;
      resolvedNotes = `${quranGrade} - ${customNotes || 'Tuntas setoran'}`;
    } else if (selectedActivityId === 'ngaji_kitab') {
      resolvedSub = kitabTitle;
    } else if (selectedActivityId === 'jamaah_sholat') {
      resolvedSub = subActivity;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    recordAttendance({
      santriId: santri.id,
      santriNis: santri.nis,
      santriNama: santri.nama,
      kamar: santri.kamar,
      activityId: selectedActivityId,
      activityName: selectedConfig?.name || selectedActivityId,
      subActivity: resolvedSub,
      date: todayStr,
      time: timeStr,
      status: defaultStatus,
      ustadzId: currentUstadz?.id || 'u-001',
      ustadzNama: currentUstadz?.nama || 'Ustadz Pembimbing',
      notes: resolvedNotes,
      verifiedMethod: 'qr_scan',
      location: 'Pesantren Al-Hikmah',
    });

    playBeep();

    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
    });

    setLastScannedSantri({
      santri,
      time: timeStr,
      status: defaultStatus,
      subActivity: resolvedSub,
      notes: resolvedNotes,
    });

    showToast(`Presensi berhasil dicatat: ${santri.nama}`);
    setManualNisInput('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNisInput.trim()) return;
    handleProcessScan(manualNisInput.trim());
  };

  // Recent scans for this activity today
  const recentActivityScans = attendanceRecords.filter(
    (r) => r.activityId === selectedActivityId && r.date === todayStr
  );

  return (
    <div className="space-y-6">
      {/* Ustadz Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PENGAMPU PRESENSI
              </span>
              <span className="text-xs text-slate-300">
                {currentUstadz?.specialty || 'Asatidz Pesantren'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              {currentUstadz?.nama || 'Ustadz Pembimbing'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Suara Scan</span>
          </button>
        </div>
      </div>

      {/* Activity Selector Strip (Only displays or indicates active activities!) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Pilih Kegiatan Santri Yang Akan Dipresensi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kegiatan yang dinonaktifkan oleh Admin tidak dapat dilakukan presensi.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {recentActivityScans.length} Santri Sudah Hadir Hari Ini
          </span>
        </div>

        {/* Activity Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {activities.map((act) => {
            const isSelected = selectedActivityId === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  setSelectedActivityId(act.id);
                  if (act.id === 'jamaah_sholat') setSubActivity('Sholat Maghrib');
                }}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                    : act.isActive
                    ? 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-800'
                    : 'bg-slate-900/40 text-slate-500 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{act.name}</span>
                  {!act.isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 font-semibold">
                      Off
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-2 truncate ${
                    isSelected ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {act.timeSlot.split('(')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Warning if selected activity is inactive */}
        {!isSelectedActive && (
          <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-3 flex items-center gap-3 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Kegiatan ini sedang <strong>dinonaktifkan</strong> oleh Pengasuh / Admin Pondok.
              Silakan pilih kegiatan lain yang bertanda aktif.
            </span>
          </div>
        )}

        {/* Sub-activity parameters when active */}
        {isSelectedActive && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedActivityId === 'jamaah_sholat' && (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Waktu Sholat</label>
                <select
                  value={subActivity}
                  onChange={(e) => setSubActivity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sholat Subuh">Sholat Subuh (Berjamaah Masjid)</option>
                  <option value="Sholat Dzuhur">Sholat Dzuhur (Berjamaah Masjid)</option>
                  <option value="Sholat Ashar">Sholat Ashar (Berjamaah Masjid)</option>
                  <option value="Sholat Maghrib">Sholat Maghrib (Berjamaah Masjid)</option>
                  <option value="Sholat Isya">Sholat Isya (Berjamaah Masjid)</option>
                </select>
              </div>
            )}

            {selectedActivityId === 'ngaji_quran' && (
              <>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target / Hafalan</label>
                  <input
                    type="text"
                    value={quranJuzSurah}
                    onChange={(e) => setQuranJuzSurah(e.target.value)}
                    placeholder="Contoh: Juz 30 / Surat Al-Mulk"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kualitas Bacaan</label>
                  <select
                    value={quranGrade}
                    onChange={(e) => setQuranGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Mumtaz (Sangat Baik/Istimewa)">Mumtaz (Istimewa / Lancar Sekali)</option>
                    <option value="Jayyid Jiddan (Baik Sekali)">Jayyid Jiddan (Baik Sekali)</option>
                    <option value="Jayyid (Cukup/Perlu Latihan)">Jayyid (Cukup/Perlu Diulang)</option>
                  </select>
                </div>
              </>
            )}

            {selectedActivityId === 'ngaji_kitab' && (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kitab & Bab</label>
                <input
                  type="text"
                  value={kitabTitle}
                  onChange={(e) => setKitabTitle(e.target.value)}
                  placeholder="Contoh: Fathul Qorib - Bab Sholat"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Status Kehadiran</label>
              <select
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value as AttendanceStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="hadir">Hadir (Tepat Waktu)</option>
                <option value="masbuq">Masbuq (Tertinggal Rakaat)</option>
                <option value="izin">Izin (Ada Udzhur)</option>
                <option value="sakit">Sakit (Di UKS/Kamar)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Catatan khusus untuk wali santri..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Viewfinder & Input Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Pemindai QR Code Kartu Santri</span>
              </h3>
              <div className="flex items-center gap-2">
                {cameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/40 hover:bg-rose-900"
                  >
                    Matikan Kamera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 shadow"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Aktifkan Kamera HP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Actual Video stream if on */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  cameraActive ? 'opacity-100' : 'hidden'
                }`}
              />

              {/* Viewfinder graphics */}
              <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 border-2 border-emerald-400/80 rounded-2xl flex flex-col items-center justify-between p-3 pointer-events-none shadow-2xl">
                {/* Corner targets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1 rounded-br"></div>

                {/* Laser scan line animation */}
                <div className="w-full h-0.5 bg-emerald-400/90 shadow-[0_0_12px_#34d399] animate-pulse"></div>

                <div className="text-center">
                  <p className="text-[10px] font-mono text-emerald-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Arahkan QR Code Kartu Santri ke sini
                  </p>
                </div>
              </div>

              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <QrCode className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-white">Scanner Siap Digunakan</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Aktifkan kamera untuk scan fisik, atau gunakan opsi simulasi tap kartu santri di sebelah kanan.
                  </p>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                {cameraError}
              </p>
            )}

            {/* Manual NIS / Barcode Reader input */}
            <form onSubmit={handleManualSubmit} className="pt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ketik NIS santri (contoh: 2024.01.001) lalu Enter..."
                  value={manualNisInput}
                  onChange={(e) => setManualNisInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Presensikan</span>
              </button>
            </form>
          </div>

          {/* Last Scanned Result Confirmation */}
          {lastScannedSantri && (
            <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 rounded-2xl p-5 shadow-2xl flex items-center gap-4 animate-fade-in">
              <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 bg-slate-950 shrink-0 shadow-lg">
                <img
                  src={lastScannedSantri.santri.fotoUrl}
                  alt={lastScannedSantri.santri.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">
                    NIS: {lastScannedSantri.santri.nis}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    BERHASIL
                  </span>
                </div>
                <h4 className="font-bold text-base text-white truncate mt-0.5">
                  {lastScannedSantri.santri.nama}
                </h4>
                <p className="text-xs text-slate-300 truncate">
                  {lastScannedSantri.santri.kamar} • {lastScannedSantri.subActivity}
                </p>
                {lastScannedSantri.notes && (
                  <p className="text-xs text-emerald-300/90 mt-1 italic">
                    "{lastScannedSantri.notes}"
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {lastScannedSantri.time}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Tap Simulator (Drawer for Testing Every Santri Card) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Simulasi Tap Kartu Santri</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Klik kartu santri untuk mensimulasikan scan QR instan.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {santriList.length} Kartu
            </span>
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1">
            {santriList.map((santri) => {
              // Check if already attended this activity today
              const isAttended = attendanceRecords.some(
                (r) =>
                  r.santriId === santri.id &&
                  r.activityId === selectedActivityId &&
                  r.date === todayStr
              );

              return (
                <div
                  key={santri.id}
                  onClick={() => handleProcessScan(santri.nis)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isAttended
                      ? 'bg-emerald-950/40 border-emerald-500/40 opacity-90'
                      : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                      <img
                        src={santri.fotoUrl}
                        alt={santri.nama}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{santri.nama}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">NIS: {santri.nis}</p>
                      <p className="text-[10px] text-slate-400 truncate">{santri.kamar}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isAttended ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Sudah
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 text-[11px] font-semibold transition border border-emerald-500/30">
                        Tap Kartu
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
