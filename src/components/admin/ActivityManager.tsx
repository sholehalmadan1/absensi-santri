import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { ActivityType, ActivityConfig } from '../../types';
import {
  ToggleLeft,
  ToggleRight,
  Clock,
  BookOpen,
  GraduationCap,
  Compass,
  Scroll,
  Library,
  Info,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { getTodayDateString } from '../../data/mockData';

export const ActivityManager: React.FC = () => {
  const { activities, toggleActivity, updateActivity, attendanceRecords } = usePesantren();
  const [editingId, setEditingId] = useState<ActivityType | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    timeSlot: string;
  }>({ name: '', description: '', timeSlot: '' });

  const todayStr = getTodayDateString();

  const getActivityIcon = (id: ActivityType) => {
    switch (id) {
      case 'jamaah_sholat':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'ngaji_quran':
        return <BookOpen className="w-5 h-5 text-teal-400" />;
      case 'ngaji_kitab':
        return <Scroll className="w-5 h-5 text-amber-400" />;
      case 'sekolah':
        return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'diniyah':
        return <Library className="w-5 h-5 text-purple-400" />;
    }
  };

  const getAttendanceCountToday = (actId: ActivityType) => {
    return attendanceRecords.filter(
      (r) => r.activityId === actId && r.date === todayStr
    ).length;
  };

  const handleStartEdit = (act: ActivityConfig) => {
    setEditingId(act.id);
    setEditForm({
      name: act.name,
      description: act.description,
      timeSlot: act.timeSlot,
    });
  };

  const handleSaveEdit = (id: ActivityType) => {
    updateActivity(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Info className="w-3.5 h-3.5" />
              Kontrol Presensi Pusat
            </div>
            <h2 className="text-xl font-bold text-white">Kelola & Jadwal Kegiatan Santri</h2>
            <p className="text-slate-300 text-sm mt-1">
              Sebagai Pengasuh/Admin, Anda dapat mengaktifkan atau menonaktifkan kegiatan kapan saja
              (misalnya libur semester, cuti massal, atau penyesuaian jadwal Ramadhan).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
              <div className="text-2xl font-black text-emerald-400">
                {activities.filter((a) => a.isActive).length}/{activities.length}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Kegiatan Aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((act) => {
          const isEditing = editingId === act.id;
          const countToday = getAttendanceCountToday(act.id);

          return (
            <div
              key={act.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                act.isActive
                  ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              {/* Card Header with Toggle Switch */}
              <div className="p-5 flex items-start justify-between gap-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner ${
                      act.isActive
                        ? 'bg-emerald-950/70 border-emerald-500/30'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {getActivityIcon(act.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">{act.name}</h3>
                      {act.isActive ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                          <XCircle className="w-2.5 h-2.5" />
                          Dinonaktifkan
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-serif text-emerald-400/80 tracking-wide mt-0.5" dir="rtl">
                      {act.arabicName}
                    </p>
                  </div>
                </div>

                {/* Master Switch */}
                <button
                  type="button"
                  onClick={() => toggleActivity(act.id)}
                  className={`p-1.5 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold border ${
                    act.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={act.isActive ? 'Nonaktifkan Kegiatan' : 'Aktifkan Kegiatan'}
                >
                  {act.isActive ? (
                    <>
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                      <span className="hidden sm:inline">Aktif</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-6 h-6 text-slate-500" />
                      <span className="hidden sm:inline">Mati</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card Body & Edit Form */}
              <div className="p-5 space-y-3">
                {isEditing ? (
                  <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Nama Kegiatan</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Jadwal & Waktu Presensi
                      </label>
                      <input
                        type="text"
                        value={editForm.timeSlot}
                        onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Keterangan</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(act.id)}
                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg flex items-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                    <div className="flex items-center gap-2 text-xs text-emerald-300/90 font-mono bg-emerald-950/30 border border-emerald-500/20 px-3 py-2 rounded-xl">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{act.timeSlot}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div className="text-slate-400">
                        Presensi hari ini:{' '}
                        <span className="font-bold text-emerald-400">{countToday} santri</span>
                      </div>
                      <button
                        onClick={() => handleStartEdit(act)}
                        className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Jadwal</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
