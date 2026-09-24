import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { AttendanceStatus, ActivityType } from '../../types';
import { getTodayDateString } from '../../data/mockData';
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Save,
  Check,
  Filter,
} from 'lucide-react';

export const ManualAttendanceSheet: React.FC = () => {
  const {
    santriList,
    activities,
    activeActivities,
    currentUstadz,
    recordAttendance,
    attendanceRecords,
    showToast,
  } = usePesantren();

  const [selectedKamar, setSelectedKamar] = useState<string>('all');
  const [selectedActivityId, setSelectedActivityId] = useState<ActivityType>(() => {
    return activeActivities[0]?.id || 'jamaah_sholat';
  });
  const [subActivity, setSubActivity] = useState<string>('Presensi Reguler');

  const todayStr = getTodayDateString();
  const uniqueKamars = Array.from(new Set(santriList.map((s) => s.kamar)));

  const filteredSantri = santriList.filter(
    (s) => selectedKamar === 'all' || s.kamar === selectedKamar
  );

  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const handleSetStatus = (santriId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({ ...prev, [santriId]: status }));
  };

  const handleSetNotes = (santriId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [santriId]: note }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const nextMap: Record<string, AttendanceStatus> = {};
    filteredSantri.forEach((s) => {
      nextMap[s.id] = status;
    });
    setStatusMap(nextMap);
  };

  const handleSaveAll = () => {
    const act = activities.find((a) => a.id === selectedActivityId);
    if (!act || !act.isActive) {
      showToast('Kegiatan ini dinonaktifkan oleh Admin');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let savedCount = 0;
    filteredSantri.forEach((santri) => {
      const status = statusMap[santri.id] || 'hadir';
      const notes = notesMap[santri.id] || '';

      recordAttendance({
        santriId: santri.id,
        santriNis: santri.nis,
        santriNama: santri.nama,
        kamar: santri.kamar,
        activityId: selectedActivityId,
        activityName: act.name,
        subActivity: subActivity,
        date: todayStr,
        time: timeStr,
        status,
        ustadzId: currentUstadz?.id || 'u-001',
        ustadzNama: currentUstadz?.nama || 'Ustadz Pembimbing',
        notes,
        verifiedMethod: 'manual',
        location: 'Pesantren Al-Hikmah',
      });
      savedCount++;
    });

    showToast(`Presensi manual ${savedCount} santri berhasil disimpan!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Kegiatan Presensi</label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value as ActivityType)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {activities
                .filter((a) => a.isActive)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Filter Kamar / Asrama</label>
            <select
              value={selectedKamar}
              onChange={(e) => setSelectedKamar(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Semua Kamar ({santriList.length} santri)</option>
              {uniqueKamars.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('hadir')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-semibold transition"
          >
            Tandai Semua Hadir
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Presensi Rombel</span>
          </button>
        </div>
      </div>

      {/* Santri Sheet */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Santri</th>
                <th className="py-3 px-4">Kamar</th>
                <th className="py-3 px-4 text-center">Status Presensi</th>
                <th className="py-3 px-4">Catatan Ustadz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredSantri.map((santri) => {
                const currentStatus = statusMap[santri.id] || 'hadir';

                return (
                  <tr key={santri.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={santri.fotoUrl}
                          alt={santri.nama}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{santri.nama}</p>
                          <p className="font-mono text-[10px] text-emerald-400">NIS: {santri.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{santri.kamar}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSetStatus(santri.id, 'hadir')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'hadir'
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(santri.id, 'masbuq')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'masbuq'
                              ? 'bg-amber-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Masbuq
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(santri.id, 'izin')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'izin'
                              ? 'bg-blue-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Izin
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(santri.id, 'sakit')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'sakit'
                              ? 'bg-purple-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Sakit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(santri.id, 'alpha')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'alpha'
                              ? 'bg-rose-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Alpha
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Tambahkan catatan khusus..."
                        value={notesMap[santri.id] || ''}
                        onChange={(e) => handleSetNotes(santri.id, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
