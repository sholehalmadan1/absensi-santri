import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { Santri } from '../../types';
import { SantriCardView } from '../common/SantriCardView';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard,
  Printer,
  Download,
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Building2,
  Users,
  Eye,
  LayoutGrid,
} from 'lucide-react';

export const SantriCardGenerator: React.FC = () => {
  const { santriList, pesantrenInfo } = usePesantren();

  const [selectedKamar, setSelectedKamar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSantriIds, setSelectedSantriIds] = useState<string[]>(() =>
    santriList.map((s) => s.id)
  );
  const [activePreviewSantriId, setActivePreviewSantriId] = useState<string>(
    santriList[0]?.id || ''
  );
  const [cardTheme, setCardTheme] = useState<'emerald' | 'navy' | 'maroon'>('emerald');
  const [viewMode, setViewMode] = useState<'interactive' | 'batch_print'>('interactive');

  // Unique kamar list
  const uniqueKamars = Array.from(new Set(santriList.map((s) => s.kamar)));

  // Filtered santri
  const filteredSantri = santriList.filter((s) => {
    const matchKamar = selectedKamar === 'all' || s.kamar === selectedKamar;
    const matchQuery =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKamar && matchQuery;
  });

  const previewSantri =
    santriList.find((s) => s.id === activePreviewSantriId) || santriList[0];

  const handleToggleSelect = (id: string) => {
    setSelectedSantriIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSantriIds.length === filteredSantri.length) {
      setSelectedSantriIds([]);
    } else {
      setSelectedSantriIds(filteredSantri.map((s) => s.id));
    }
  };

  const handlePrintCards = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sistem Generator KTS (Kartu Tanda Santri)
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Generator & Cetak Kartu Santri Ber-QR Code
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cetak kartu identitas resmi santri ber-QR Code untuk presensi sholat berjamaah,
              tahfidz Al-Qur'an, sorogan kitab kuning, KBM sekolah, dan madrasah diniyah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'interactive'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau Interaktif</span>
            </button>
            <button
              onClick={() => setViewMode('batch_print')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'batch_print'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Lembar Cetak Massal (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Theme, Search, Kamar Filter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari santri berdasarkan nama atau NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Kamar */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedKamar}
            onChange={(e) => setSelectedKamar(e.target.value)}
            className="bg-slate-950/70 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Kamar / Asrama</option>
            {uniqueKamars.map((kamar) => (
              <option key={kamar} value={kamar}>
                {kamar}
              </option>
            ))}
          </select>
        </div>

        {/* Card Theme Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Tema:</span>
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCardTheme('emerald')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                cardTheme === 'emerald'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hijau Klasik
            </button>
            <button
              onClick={() => setCardTheme('navy')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                cardTheme === 'navy'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Biru Modern
            </button>
            <button
              onClick={() => setCardTheme('maroon')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                cardTheme === 'maroon'
                  ? 'bg-rose-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Maroon
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'interactive' ? (
        /* INTERACTIVE PREVIEW MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Santri Selector Table */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  Daftar Santri ({filteredSantri.length})
                </h3>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
              >
                {selectedSantriIds.length === filteredSantri.length ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Batal Pilih Semua</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Pilih Semua Santri</span>
                  </>
                )}
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
              {filteredSantri.map((s) => {
                const isSelected = selectedSantriIds.includes(s.id);
                const isActivePreview = activePreviewSantriId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setActivePreviewSantriId(s.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActivePreview
                        ? 'bg-emerald-950/60 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(s.id);
                        }}
                        className="text-slate-400 hover:text-emerald-400 shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                        <img
                          src={s.fotoUrl}
                          alt={s.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{s.nama}</p>
                        <p className="text-xs text-emerald-400 font-mono">NIS: {s.nis}</p>
                        <p className="text-[11px] text-slate-400 truncate">{s.kamar}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                        {s.kelasFormal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live 3D Card Preview */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  Pratinjau Kartu Fisik Digital
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Pilih santri di samping untuk melihat
              </span>
            </div>

            {previewSantri ? (
              <div className="w-full flex flex-col items-center py-2">
                <SantriCardView
                  santri={previewSantri}
                  pesantren={pesantrenInfo}
                  colorScheme={cardTheme}
                  showControls={true}
                />

                {/* Card Specification Info */}
                <div className="w-full mt-6 bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Dimensi Standar:</span>
                    <span className="font-mono text-emerald-400">CR80 (85.6 × 54.0 mm)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Enkripsi QR:</span>
                    <span className="font-mono text-emerald-400">NIS & Validasi Pesantren</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kompatibilitas:</span>
                    <span className="text-slate-200">
                      Scanner Ustadz (Kamera HP & Barcode Reader)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Tidak ada santri yang dipilih</p>
            )}
          </div>
        </div>
      ) : (
        /* BATCH PRINT MODE (SIAP CETAK A4) */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 no-print">
            <div>
              <h3 className="font-bold text-base text-white">
                Lembar Cetak Massal Kartu Santri ({selectedSantriIds.length} Terpilih)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Format lembar kertas siap cetak atau simpan ke PDF. Disusun dalam kisi rapi
                dengan tanda potong.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintCards}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Kartu (Print/PDF)</span>
              </button>
            </div>
          </div>

          {/* Printable Grid Area */}
          <div className="print-area grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            {santriList
              .filter((s) => selectedSantriIds.includes(s.id))
              .map((santri) => (
                <div
                  key={santri.id}
                  className="p-3 border border-slate-700/60 rounded-2xl bg-slate-900 flex justify-center break-inside-avoid shadow"
                >
                  <SantriCardView
                    santri={santri}
                    pesantren={pesantrenInfo}
                    colorScheme={cardTheme}
                    showControls={false}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
