import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { AttendanceStatus, ActivityType } from '../../types';
import { getTodayDateString } from '../../data/mockData';
import {
  FileText,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  Building,
  UserCheck,
} from 'lucide-react';

export const AttendanceAudit: React.FC = () => {
  const { attendanceRecords, activities, santriList } = usePesantren();

  const [filterDate, setFilterDate] = useState<string>(getTodayDateString());
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = attendanceRecords.filter((rec) => {
    const matchDate = !filterDate || rec.date === filterDate;
    const matchActivity = filterActivity === 'all' || rec.activityId === filterActivity;
    const matchStatus = filterStatus === 'all' || rec.status === filterStatus;
    const matchSearch =
      rec.santriNama.toLowerCase().includes(search.toLowerCase()) ||
      rec.santriNis.toLowerCase().includes(search.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(search.toLowerCase()));

    return matchDate && matchActivity && matchStatus && matchSearch;
  });

  // Calculate summary counts for the filtered date
  const dateRecords = attendanceRecords.filter((r) => !filterDate || r.date === filterDate);
  const hadirCount = dateRecords.filter((r) => r.status === 'hadir').length;
  const izinCount = dateRecords.filter((r) => r.status === 'izin').length;
  const sakitCount = dateRecords.filter((r) => r.status === 'sakit').length;
  const masbuqCount = dateRecords.filter((r) => r.status === 'masbuq').length;
  const alphaCount = dateRecords.filter((r) => r.status === 'alpha').length;

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'hadir':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> Hadir
          </span>
        );
      case 'masbuq':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Masbuq
          </span>
        );
      case 'izin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 px-2 py-0.5 rounded-full">
            <FileText className="w-3 h-3" /> Izin
          </span>
        );
      case 'sakit':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Sakit
          </span>
        );
      case 'alpha':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" /> Ghoib/Alpha
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Jam', 'NIS', 'Nama Santri', 'Kamar', 'Kegiatan', 'Sub-Kegiatan', 'Status', 'Ustadz', 'Catatan'];
    const rows = filtered.map((r) => [
      r.date,
      r.time,
      `"${r.santriNis}"`,
      `"${r.santriNama}"`,
      `"${r.kamar}"`,
      `"${r.activityName}"`,
      `"${r.subActivity || '-'}"`,
      r.status,
      `"${r.ustadzNama}"`,
      `"${r.notes || '-'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-presensi-pesantren-${filterDate || 'semua'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg text-center">
          <p className="text-xs text-slate-400 font-medium">Hadir</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{hadirCount}</p>
          <span className="text-[10px] text-emerald-300/80">Tepat Waktu</span>
        </div>
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg text-center">
          <p className="text-xs text-slate-400 font-medium">Masbuq</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{masbuqCount}</p>
          <span className="text-[10px] text-amber-300/80">Tertinggal Rakaat</span>
        </div>
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-lg text-center">
          <p className="text-xs text-slate-400 font-medium">Izin</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{izinCount}</p>
          <span className="text-[10px] text-blue-300/80">Dengan Keterangan</span>
        </div>
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-lg text-center">
          <p className="text-xs text-slate-400 font-medium">Sakit</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{sakitCount}</p>
          <span className="text-[10px] text-purple-300/80">Rawat UKS / Kamar</span>
        </div>
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4 shadow-lg text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-400 font-medium">Alpha / Ghoib</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{alphaCount}</p>
          <span className="text-[10px] text-rose-300/80">Tanpa Kabar</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            />
          </div>

          {/* Activity selector */}
          <select
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Kegiatan</option>
            {activities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.name}
              </option>
            ))}
          </select>

          {/* Status selector */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="masbuq">Masbuq</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="alpha">Alpha</option>
          </select>

          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari santri, NIS, catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Rekap CSV</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Santri</th>
                <th className="py-3 px-4">Kamar / Asrama</th>
                <th className="py-3 px-4">Kegiatan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ustadz Pencatat</th>
                <th className="py-3 px-4">Catatan & Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Tidak ada data presensi yang cocok dengan filter tanggal/kegiatan ini.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-emerald-400 font-semibold">{item.time}</div>
                      <div className="text-[10px] text-slate-500">{item.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{item.santriNama}</div>
                      <div className="font-mono text-[10px] text-slate-400">NIS: {item.santriNis}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">{item.kamar}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{item.activityName}</div>
                      {item.subActivity && (
                        <div className="text-[10px] text-emerald-400/90 font-mono">
                          {item.subActivity}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-300 font-medium">{item.ustadzNama}</div>
                      <div className="text-[9px] text-slate-500 uppercase">
                        {item.verifiedMethod === 'qr_scan' ? 'Scan QR Kartu' : 'Presensi Manual'}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-300 line-clamp-2 italic">
                        {item.notes || '-'}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
