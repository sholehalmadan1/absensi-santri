import React, { useState } from 'react';
import { UstadzScanner } from './UstadzScanner';
import { ManualAttendanceSheet } from './ManualAttendanceSheet';
import { QrCode, ClipboardList, Sparkles } from 'lucide-react';

export const UstadzDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'manual'>('scanner');

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Panel Presensi Ustadz</h1>
          <p className="text-xs text-slate-400">
            Lakukan pemindaian QR Code pada kartu tanda santri (KTS) atau presensi massal per kamar.
          </p>
        </div>

        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Scan QR Code Kartu</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Presensi Rombel / Kamar</span>
          </button>
        </div>
      </div>

      {activeTab === 'scanner' ? <UstadzScanner /> : <ManualAttendanceSheet />}
    </div>
  );
};
