import React from 'react';
import { Santri, AttendanceRecord, PesantrenInfo } from '../../types';
import { Printer, Download, X, Building2, CheckCircle2 } from 'lucide-react';

interface ReportDownloadModalProps {
  santri: Santri;
  pesantren: PesantrenInfo;
  records: AttendanceRecord[];
  onClose: () => void;
}

export const ReportDownloadModal: React.FC<ReportDownloadModalProps> = ({
  santri,
  pesantren,
  records,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const hadirCount = records.filter((r) => r.status === 'hadir').length;
  const masbuqCount = records.filter((r) => r.status === 'masbuq').length;
  const izinCount = records.filter((r) => r.status === 'izin').length;
  const sakitCount = records.filter((r) => r.status === 'sakit').length;
  const total = records.length;
  const percentHadir = total > 0 ? Math.round(((hadirCount + masbuqCount) / total) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-fade-in my-6 text-slate-900">
        {/* Modal Controls (Not Printed) */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="text-white">
            <h3 className="font-bold text-sm">Pratinjau Raport Presensi Santri</h3>
            <p className="text-xs text-slate-400">Siap cetak atau unduh sebagai PDF</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT (Styled like a formal Pesantren Report Sheet) */}
        <div className="print-area bg-white p-8 max-h-[80vh] overflow-y-auto print:max-h-none print:p-6 text-slate-900 font-sans">
          {/* Official Letterhead (KOP SURAT) */}
          <div className="border-b-4 border-double border-emerald-950 pb-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-800 flex items-center justify-center text-emerald-900 font-bold text-xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-emerald-800">
                  {pesantren.yayasan}
                </p>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {pesantren.namaPondok}
                </h1>
                <p className="text-[11px] text-slate-600">
                  {pesantren.alamat} • Telp: {pesantren.telepon} • Web: {pesantren.website}
                </p>
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="text-center my-5">
            <h2 className="text-base font-black uppercase tracking-wider text-emerald-950 underline decoration-emerald-600">
              LAPORAN REKAPITULASI PRESENSI & AKTIVITAS SANTRI
            </h2>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              Tahun Ajaran {pesantren.tahunAjaran} — Semester {pesantren.semester}
            </p>
          </div>

          {/* Santri Bio Box */}
          <div className="grid grid-cols-2 gap-4 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs mb-6">
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-slate-600 inline-block w-28">Nama Santri:</span>
                <span className="font-bold text-slate-900">{santri.nama}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-600 inline-block w-28">Nomor Induk (NIS):</span>
                <span className="font-mono font-bold text-emerald-800">{santri.nis}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-600 inline-block w-28">Kamar / Asrama:</span>
                <span>{santri.kamar}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-slate-600 inline-block w-28">Wali Santri:</span>
                <span className="font-bold text-slate-900">{santri.waliNama}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-600 inline-block w-28">Kelas Formal:</span>
                <span>{santri.kelasFormal}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-600 inline-block w-28">Madrasah Diniyah:</span>
                <span>{santri.kelasDiniyah}</span>
              </p>
            </div>
          </div>

          {/* Summary Attendance Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center mb-6">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Hadir / Tepat</p>
              <p className="text-xl font-black text-emerald-700 mt-0.5">{hadirCount}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Masbuq Sholat</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">{masbuqCount}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Izin / Sakit</p>
              <p className="text-xl font-black text-blue-600 mt-0.5">{izinCount + sakitCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
              <p className="text-[10px] text-emerald-800 font-bold uppercase">Persentase Kehadiran</p>
              <p className="text-xl font-black text-emerald-800 mt-0.5">{percentHadir}%</p>
            </div>
          </div>

          {/* Table of Activity Logs */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 text-xs">
            <table className="w-full text-left">
              <thead className="bg-emerald-950 text-white text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Tanggal & Jam</th>
                  <th className="py-2.5 px-3">Kegiatan Santri</th>
                  <th className="py-2.5 px-3">Rincian / Materi</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Ustadz Pengampu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400">
                      Belum ada catatan presensi untuk santri ini.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px]">
                        {r.date} {r.time}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{r.activityName}</td>
                      <td className="py-2 px-3">
                        <div className="text-slate-800">{r.subActivity || '-'}</div>
                        {r.notes && <div className="text-[10px] text-slate-500 italic">{r.notes}</div>}
                      </td>
                      <td className="py-2 px-3 uppercase font-bold text-[10px]">
                        <span
                          className={
                            r.status === 'hadir'
                              ? 'text-emerald-700'
                              : r.status === 'masbuq'
                              ? 'text-amber-700'
                              : 'text-slate-600'
                          }
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-600">{r.ustadzNama}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures & Formal Stamp */}
          <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-xs">
            <div className="text-center w-48">
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-semibold text-slate-800">Wali Santri</p>
              <div className="h-14"></div>
              <p className="font-bold underline text-slate-900">{santri.waliNama}</p>
            </div>

            <div className="text-center w-64 relative">
              <div className="absolute top-2 left-6 w-16 h-16 rounded-full border-2 border-emerald-600/40 rotate-12 flex items-center justify-center pointer-events-none">
                <span className="text-[8px] font-bold text-emerald-700 uppercase leading-none">
                  STEMPEL
                  <br />
                  PESANTREN
                </span>
              </div>
              <p className="text-slate-600">Bandung, {new Date().toLocaleDateString('id-ID')}</p>
              <p className="font-semibold text-slate-800">Pengasuh Pondok Pesantren,</p>
              <div className="h-14"></div>
              <p className="font-bold underline text-emerald-950">{pesantren.pengasuh}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
